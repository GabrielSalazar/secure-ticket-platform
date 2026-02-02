# Deployment Guide

## Environment Variables

Ensure the following environment variables are set in your Vercel project settings:

### General
- `NEXT_PUBLIC_APP_URL`: The absolute URL of your production deployment (e.g., `https://your-project.vercel.app`). **Critical for Stripe redirects.**

### Database (Supabase/Prisma)
- `DATABASE_URL`: Connection string for PostgreSQL (Transaction mode, port 6543).
- `DIRECT_URL`: Connection string for PostgreSQL (Session mode, port 5432).
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### Stripe (Payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe Publishable Key (`pk_test_...` or `pk_live_...`).
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key (`sk_test_...` or `sk_live_...`).
- `STRIPE_WEBHOOK_SECRET`: The secret for your Stripe Webhook endpoint (`whsec_...`).

### Stripe Customer Portal
The application now uses the Stripe Customer Portal.
1. Go to Stripe Dashboard > Settings > Customer Portal.
2. Enable the portal.
3. Allow customers to "View and manage their saved payment methods".
4. Save changes.

## Build Command
`npm run build` (runs `prisma generate && next build`)

## Install Command
`npm install`
