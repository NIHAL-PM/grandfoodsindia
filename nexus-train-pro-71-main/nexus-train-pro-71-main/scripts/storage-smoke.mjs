import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const PUBLIC_BUCKET = process.env.PUBLIC_BUCKET || 'assets'
const PUBLIC_PATH = process.env.PUBLIC_PATH || 'smoke.txt'
const PRIVATE_BUCKET = process.env.PRIVATE_BUCKET || 'materials'
const PRIVATE_PATH = process.env.PRIVATE_PATH || 'smoke.txt'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Set env vars and retry.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const admin = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null

function log(title, ok, details) {
  const status = ok ? 'PASS' : 'FAIL'
  console.log(`[${status}] ${title}${details ? ` -> ${details}` : ''}`)
}

async function testPublicRead() {
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(PUBLIC_PATH)
  const url = data?.publicUrl
  if (!url) {
    log(`Public URL for ${PUBLIC_BUCKET}/${PUBLIC_PATH}`, false, 'no URL returned (file may not exist)')
    return false
  }
  try {
    const res = await fetch(url, { method: 'GET' })
    const ok = res.ok
    log(`Anon fetch public ${PUBLIC_BUCKET}/${PUBLIC_PATH}`, ok, `HTTP ${res.status}`)
    return ok
  } catch (e) {
    log(`Anon fetch public ${PUBLIC_BUCKET}/${PUBLIC_PATH}`, false, e.message)
    return false
  }
}

async function testPrivateRead() {
  const { data, error } = await supabase.storage.from(PRIVATE_BUCKET).download(PRIVATE_PATH)
  if (error) {
    // Expected to fail as anon
    log(`Anon download private ${PRIVATE_BUCKET}/${PRIVATE_PATH}`, true, error.message)
    return true
  }
  // If it unexpectedly succeeded, that's a policy problem.
  const size = data?.size || 0
  log(`Anon download private ${PRIVATE_BUCKET}/${PRIVATE_PATH}`, false, `unexpectedly succeeded (size=${size})`)
  return false
}

async function ensureObject(bucket, path, isPublic) {
  if (!admin) return false
  // check if object exists by listing its parent prefix
  const prefix = path.includes('/') ? path.split('/').slice(0, -1).join('/') : ''
  const { data: list, error: listErr } = await admin.storage.from(bucket).list(prefix)
  if (listErr) return false
  const exists = (list || []).some(o => (prefix ? `${prefix}/` : '') + o.name === path)
  if (exists) return true
  const content = Buffer.from(`storage-smoke ${bucket}/${path} ${new Date().toISOString()}\n`)
  const { error: upErr } = await admin.storage.from(bucket).upload(path, content, { upsert: true, contentType: 'text/plain' })
  if (upErr) {
    log(`Seed ${bucket}/${path}`, false, upErr.message)
    return false
  }
  if (isPublic) {
    // nothing else needed; bucket policy should make it public via URL
  }
  log(`Seed ${bucket}/${path}`, true)
  return true
}

;(async () => {
  console.log('Storage smoke test (anon):')
  let pub = await testPublicRead()
  if (!pub && admin) {
    await ensureObject(PUBLIC_BUCKET, PUBLIC_PATH, true)
    pub = await testPublicRead()
  }
  let priv = await testPrivateRead()
  if (admin) {
    await ensureObject(PRIVATE_BUCKET, PRIVATE_PATH, false)
    priv = await testPrivateRead()
  }
  const allOk = pub && priv
  console.log(allOk ? 'All storage checks passed.' : 'Some storage checks failed.')
  process.exit(allOk ? 0 : 2)
})()
