# Copilot Instructions for nexus-train-pro-71

This repo is a Vite + React + TypeScript app using shadcn-ui, Radix, and TanStack Query, backed by Supabase (Auth, Postgres, Storage, Realtime, Edge Functions). Frontend lives in `src/`; SQL and Edge Functions in `supabase/`.

## Architecture essentials
- Entrypoints: `src/main.tsx` + `src/App.tsx`; routing via page components under `src/pages/`..
- State/data: TanStack Query hooks wrap a centralized Supabase API in `src/lib/supabase-api.ts`. Prefer using the hooks in `src/hooks/useSupabase.ts`.
- Auth and roles: `src/context/AuthContext.tsx` fetches `profiles.role` for `isAdmin/isTrainer/isStudent`. First-login password change: `src/components/auth/ForcePasswordChangeModal.tsx` (rendered by `Navigation`).
- Admin Dashboard: `src/pages/EnhancedAdminPanel.tsx` — shows payments, consultations, students/trainers, applications, certificates; wired to Supabase. Uses realtime to refresh on table changes.
- Payments: users upload proof to Storage (`payment_screens`), rows recorded in `public.payments`; admin approves and triggers provisioning + welcome email via Edge Functions. See mutations/hooks in `useSupabase.ts` and flows in `PaymentModal.tsx` and `EnrollmentFormModal.tsx`.
- Provisioning: frontend calls Edge Functions (tries `create-account`, `provision-account`, falls back to `provision-user`) then `send-welcome-email`. See `provisionUserFromPayment` in `lib/supabase-api.ts`.
- Certificates: DB schema + RPCs in `supabase/sql/certificates.sql`. Issue via RPC `issue_certificate` (immutable, unique IDs like `KA-2025-CODE-00001`). Verify via RPC `verify_certificate` used in `src/lib/api.ts` and page `src/pages/VerifyCertificate.tsx`. Admin panel supports backfill from local certs and PDF attachment.
- Local fallbacks: Legacy local storage utilities in `src/utils/localStore.ts` are still present for offline or partial flows; new code should prefer Supabase paths first, then fallback.

## Data model quick map (Postgres)
- `profiles` (id=auth.users.id, role: admin|trainer|student). Referenced across features.
- `payments` (+ RLS): stores payment metadata (payer_* fields, course info, status). Screenshots live in Storage `payment_screens/`.
- `consultations`, `wishlists` (+ RLS): created by `supabase/sql/consultations_wishlist.sql`.
- `certificates`, `certificate_sequences` (+ RLS, trigger immutability): created by `supabase/sql/certificates.sql`.
- Assignments/attendance/classes/courses tables are assumed; see API methods in `lib/supabase-api.ts` for expected shapes.

## Patterns and conventions
- API first: add Supabase queries in `src/lib/supabase-api.ts`, then a wrapper hook in `src/hooks/useSupabase.ts`, then call from components/pages.
- Error handling: return Supabase errors; components show toasts via `use-toast`.
- Realtime: subscribe via `supabase.channel(...).on('postgres_changes', ...)` and invalidate related Query keys.
- Storage: `uploadFile`/`uploadBlob` + `getFileUrl`; current buckets: `payment_screens` and `certificates` (public by default; plan to move to signed URLs later).
- Edge Function calls: `(supabase as any).functions.invoke(name, { body })`; creator function names can vary — `provisionUserFromPayment` tries several.

## Dev workflows
- Install/build: `npm i` then `npm run dev` or `npm run build`. No custom build steps beyond Vite.
- Lint: `npm run lint` (many warnings tolerated; not build-blocking).
- Smoke tests: `npm run smoke:storage` and `npm run smoke:rls` use `.env` and small scripts in `scripts/`.
- SQL migrations: apply files under `supabase/sql/` via Supabase SQL editor. Ensure buckets exist in Storage.
- Edge Functions: see `supabase/functions/provision-user` with README for deploy and required secrets.

## Where to implement new features
- Admin: `src/pages/EnhancedAdminPanel.tsx` (extend tabs; use existing hooks/APIs). Example: payments approval uses `useUpdatePaymentStatus` then calls `provisionUserFromPayment`.
- User flows: `src/components/*` (e.g., `PaymentModal`, `EnrollmentFormModal`, `ScheduleCallModal`). Follow existing storage → table insert → toast pattern.
- API/hook additions: put DB logic in `lib/supabase-api.ts`, then add a hook in `hooks/useSupabase.ts` with invalidations and toasts.

## Gotchas
- Some features still use local storage fallbacks; always try Supabase and catch to fallback to `Storage.*` methods.
- Edge Functions run in Deno; local ESLint will flag `Deno` globals, but they’re valid in Supabase runtime.
- RLS expects `profiles.role` to be set; provisioning must upsert the profile.
- Payments screenshot URLs are public for now; signed URLs are a deferred enhancement.

## Example: issuing a certificate
- Frontend: call `supabase.rpc('issue_certificate', { p_user_id, p_course_id, p_course_code })`.
- Result has `certificate_id` (immutable unique ID). Optionally upload a PDF to `certificates/<row_id>.pdf` and `update` the row with `pdf_url`.
- Verify any time: `supabase.rpc('verify_certificate', { code_input: 'KA-2025-PRP-00001' })`.
