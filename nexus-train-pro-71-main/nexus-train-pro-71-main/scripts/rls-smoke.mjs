import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY. Set env vars and retry.')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

function log(title, ok, details) {
  const status = ok ? 'PASS' : 'FAIL'
  console.log(`[${status}] ${title}${details ? ` -> ${details}` : ''}`)
}

function assertOk(ok, title, details) {
  log(title, ok, details)
  if (!ok) throw new Error(`${title} failed`)
}

function nowPlus(hours) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString()
}

;(async () => {
  const suffix = Date.now()
  const studentEmail = `rls.student+${suffix}@example.com`
  const trainerEmail = `rls.trainer+${suffix}@example.com`
  const password = 'Test1234!'

  // 1) Create users (confirmed) via admin API
  const { data: sUserData, error: sUserErr } = await admin.auth.admin.createUser({
    email: studentEmail,
    password,
    email_confirm: true
  })
  assertOk(!sUserErr && sUserData?.user, 'Create student', sUserErr?.message)
  const studentId = sUserData.user.id

  const { data: tUserData, error: tUserErr } = await admin.auth.admin.createUser({
    email: trainerEmail,
    password,
    email_confirm: true
  })
  assertOk(!tUserErr && tUserData?.user, 'Create trainer', tUserErr?.message)
  const trainerId = tUserData.user.id

  // 2) Upsert profiles with roles and must_change_password=false (bypass assert_password_changed gate)
  const { error: profErr } = await admin.from('profiles').upsert([
    { id: studentId, role: 'student', full_name: 'RLS Student', must_change_password: false },
    { id: trainerId, role: 'trainer', full_name: 'RLS Trainer', must_change_password: false }
  ])
  assertOk(!profErr, 'Upsert profiles', profErr?.message)

  // 3) Create a course owned by trainer within a date window
  const course = {
    title: `RLS Course ${suffix}`,
    description: 'Smoke test course',
    trainer_id: trainerId,
    capacity: 10,
    start_at: nowPlus(-24),
    end_at: nowPlus(24 * 30),
    status: 'active'
  }
  const { data: courseData, error: courseErr } = await admin.from('courses').insert(course).select('id').single()
  assertOk(!courseErr && courseData?.id, 'Insert course', courseErr?.message)
  const courseId = courseData.id

  // 4) Enroll student
  const { error: enrErr } = await admin.from('course_enrollments').insert({ course_id: courseId, student_id: studentId })
  assertOk(!enrErr, 'Enroll student into course', enrErr?.message)

  // 5) Create a class inside course dates
  const cls = {
    course_id: courseId,
    title: 'Intro',
    starts_at: nowPlus(1),
    ends_at: nowPlus(2)
  }
  const { data: classData, error: classErr } = await admin.from('classes').insert(cls).select('id').single()
  assertOk(!classErr && classData?.id, 'Insert class', classErr?.message)

  // 6) Create an assignment
  const asg = {
    course_id: courseId,
    title: 'HW 1',
    instructions: 'Do the thing',
    due_at: nowPlus(24),
    created_by: trainerId
  }
  const { data: asgData, error: asgErr } = await admin.from('assignments').insert(asg).select('id').single()
  assertOk(!asgErr && asgData?.id, 'Insert assignment', asgErr?.message)

  // 7) Student session
  const student = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: sLogin, error: sLoginErr } = await student.auth.signInWithPassword({ email: studentEmail, password })
  assertOk(!sLoginErr && sLogin?.user, 'Student login', sLoginErr?.message)

  // Student can read classes for enrolled course
  const { data: sClasses, error: sClassesErr } = await student.from('classes').select('id').eq('course_id', courseId)
  assertOk(!sClassesErr && (sClasses?.length || 0) >= 1, 'Student reads classes', sClassesErr?.message)

  // Student can read assignments for enrolled course
  const { data: sAsg, error: sAsgErr } = await student.from('assignments').select('id').eq('course_id', courseId)
  assertOk(!sAsgErr && (sAsg?.length || 0) >= 1, 'Student reads assignments', sAsgErr?.message)

  // Student reads own profile, not trainer
  const { data: sOwn, error: sOwnErr } = await student.from('profiles').select('id').eq('id', studentId)
  assertOk(!sOwnErr && (sOwn?.length || 0) === 1, 'Student reads own profile', sOwnErr?.message)
  const { data: sOther, error: sOtherErr } = await student.from('profiles').select('id').eq('id', trainerId)
  assertOk(!sOtherErr && (sOther?.length || 0) === 0, 'Student cannot read other profile')

  // 8) Trainer session
  const trainer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: tLogin, error: tLoginErr } = await trainer.auth.signInWithPassword({ email: trainerEmail, password })
  assertOk(!tLoginErr && tLogin?.user, 'Trainer login', tLoginErr?.message)

  // Trainer can read classes for their course
  const { data: tClasses, error: tClassesErr } = await trainer.from('classes').select('id').eq('course_id', courseId)
  assertOk(!tClassesErr && (tClasses?.length || 0) >= 1, 'Trainer reads classes', tClassesErr?.message)

  // Trainer can read enrolled student profile via trainer_read_students policy
  const { data: tStudentProfile, error: tProfErr } = await trainer.from('profiles').select('id').eq('id', studentId)
  assertOk(!tProfErr && (tStudentProfile?.length || 0) === 1, 'Trainer reads enrolled student profile', tProfErr?.message)

  // 9) Public RPC verify_certificate returns 0 rows for random code
  const { data: rpcData, error: rpcErr } = await anon.rpc('verify_certificate', { code_input: 'nope-' + suffix })
  assertOk(!rpcErr && (rpcData?.length || 0) === 0, 'verify_certificate harmless call', rpcErr?.message)

  console.log('RLS smoke test complete: all checks passed.')
  process.exit(0)
})().catch((e) => {
  console.error(e?.message || e)
  process.exit(2)
})
