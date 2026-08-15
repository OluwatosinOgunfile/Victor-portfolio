# Admin dashboard setup

## 1. Supabase

1. Create a Supabase project.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. In **Authentication → Users**, create one user:
   - Email: `victoriyoyo2493@gmail.com`
   - Use a strong temporary password and change it after first login.
4. In **Authentication → URL Configuration**, set the site URL to `https://victor-portfolio-one-beta.vercel.app` and add `https://victor-portfolio-one-beta.vercel.app/admin/reset-password` as a redirect URL.
5. Copy the project URL, anon key, and service-role key into the matching Vercel variables from `.env.example`.

## 2. Gmail fallback

1. Enable two-step verification on `victoriyoyo2493@gmail.com`.
2. Create a Google app password for Mail.
3. Add it to Vercel as `GMAIL_APP_PASSWORD`. Never use the normal Gmail password.

## 3. Twilio WhatsApp

1. Create a Twilio account and enable the WhatsApp Sandbox.
2. Join the sandbox from `+234 902 230 1666` using the instruction displayed by Twilio.
3. Configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, and `TWILIO_WHATSAPP_TO` in Vercel.
4. Sandbox messages use a free-form body during the active session. For production, onboard a WhatsApp sender, approve a utility template with variables for lead name and secure URL, then set `TWILIO_CONTENT_SID`.

## 4. Remaining Vercel variables

- `NEXT_PUBLIC_SITE_URL=https://victor-portfolio-one-beta.vercel.app`
- `ADMIN_EMAIL=victoriyoyo2493@gmail.com`
- `ANALYTICS_HASH_SECRET`: generate a random value of at least 32 characters.

Redeploy after adding variables. Visit `/admin/login` to sign in.

## 5. Apply the latest database migration

For an existing project, run `supabase/migrations/20260815_notification_status_and_retention.sql` in the Supabase SQL Editor. This enables accurate Twilio delivery states and schedules automatic deletion of analytics older than 12 months. Enable the `pg_cron` extension in Supabase first if needed.

Then run `supabase/migrations/20260815_lead_workflow.sql` to add preferred contact details, priorities, follow-up dates, and tags to enquiries.
