# Operations

## Production

- App URL: https://zabirarkam-portfolio.vercel.app
- Vercel project: `zabirarkam-portfolio`
- Required runtime env vars:
  - `DATABASE_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `AUTH_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - `ADMIN_CHANGE_CODE`
  - `SITE_URL`

## Error Tracking

Sentry is wired in `instrumentation.ts` and the `sentry.*.config.ts` files.

To activate it, create a free Sentry project and add these Vercel environment variables:

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`

The app only initializes Sentry when the DSN env vars are present, so local and preview builds work without a Sentry account.

## Email Inbox And Replies

The public contact form saves messages to Neon in `ContactMessage`. Dashboard admins can read messages in the Inbox section.

For direct dashboard replies, configure:

- `RESEND_API_KEY`
- `FROM_EMAIL=hello@zabir.dev`

Without `RESEND_API_KEY`, the dashboard still shows the message and provides an `Open mail app` fallback.

For real incoming email to `hello@zabir.dev`, configure an email provider with MX records for the domain and forward inbound webhooks to:

```text
https://zabirarkam-portfolio.vercel.app/api/inbound/resend
```

If `INBOUND_EMAIL_SECRET` is set, the webhook must send it in the `x-inbound-email-secret` header.

## Analytics

Vercel Web Analytics and Speed Insights are enabled for the Vercel project. The app includes:

- `@vercel/analytics/next`
- `@vercel/speed-insights/next`

## Database Backup

Neon provides point-in-time restore and branching. For this portfolio:

1. Keep the production branch protected.
2. Before large dashboard edits, create a Neon branch from production.
3. Use Neon point-in-time restore if bad content or schema changes need rollback.
4. Keep Prisma migrations committed in `prisma/migrations`.

## Security Checks

Run these before deployment:

```bash
npm audit --audit-level=moderate
npm run lint
npm run build
```

The dashboard save route uses a longer Prisma transaction timeout because it persists all editable content sections in one bulk save.
