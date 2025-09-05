# provision-user Edge Function

Creates a user after an approved payment, assigns a student ID as the initial password, sets must_change_password, and sends a welcome email.

Environment variables required (set in Supabase project settings → Functions → Secrets):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SENDGRID_API_KEY (optional, if absent the function logs the email payload)
- APP_URL (optional, used in email templates)

Deploy steps:
1) Copy this folder to your Supabase functions directory or use Supabase Studio → Edge Functions to create `provision-user`.
2) Deploy from the CLI: `supabase functions deploy provision-user --project-ref <your-project-ref>`
3) Grant invoke access: `supabase functions secrets set ...` and ensure your anon key can invoke (default).
