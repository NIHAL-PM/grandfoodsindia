// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: provision-user
// Creates a user after an approved payment and sends welcome email

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

interface Payload {
  payment_id: string
  payer_email?: string
  payer_name?: string
  course_title?: string
  plan?: string
}

Deno.serve(async (req) => {
  const { payment_id, payer_email, payer_name, course_title, plan } = await req.json() as Payload
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const APP_URL = Deno.env.get('APP_URL') || 'https://example.com'
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

  const fetcher = async (path: string, init: RequestInit) => {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      ...init,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}) as any,
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    return res.json()
  }

  try {
    // Load payment row for metadata
    const { data: payments } = await fetcher('/rest/v1/payments?select=*&id=eq.' + payment_id, { method: 'GET' })
    const payment = payments?.[0]
    if (!payment) throw new Error('Payment not found')

    const email = payer_email || payment.payer_email
    const name = payer_name || payment.payer_name || 'Student'
    if (!email) throw new Error('No payer email')

    // Generate student ID and initial password
    const studentId = `STD-${Date.now().toString().slice(-8)}`
    const initialPassword = studentId // same as ID per requirement

    // Create user via auth admin API
    const { data: created } = await fetcher('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: initialPassword,
        email_confirm: true,
        user_metadata: { full_name: name, role: 'student', must_change_password: true }
      })
    })
    const newUser = created?.user || created
    const userId = newUser?.id

    // Upsert profile with role student
    await fetcher('/rest/v1/profiles', {
      method: 'POST',
      body: JSON.stringify({ id: userId, email, full_name: name, role: 'student' }),
      headers: { Prefer: 'resolution=merge-duplicates' }
    })

    // Send welcome email (SendGrid)
    const subject = 'Welcome to Kaisan Associates – Enrollment Confirmed'
    const content = `Hello ${name},\n\nYour enrollment is confirmed for ${payment.course_title || course_title || 'your course'}.\n\nLogin credentials:\nEmail: ${email}\nPassword: ${initialPassword}\n\nPlease change your password on first login.\nPortal: ${APP_URL}\n\nThank you!`

    if (SENDGRID_API_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: 'no-reply@kaisanassociates.com', name: 'Kaisan Associates' },
          subject,
          content: [{ type: 'text/plain', value: content }]
        })
      })
    } else {
      console.log('Email payload', { to: email, subject, content })
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId, student_id: studentId }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400 })
  }
})
