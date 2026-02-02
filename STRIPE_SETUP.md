# Stripe Payment Integration Setup

This guide explains how to set up Stripe payment integration for the ticket resale platform.

## Prerequisites

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Stripe Payment
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting Your Stripe Keys

1. **API Keys** (Secret and Publishable):
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

2. **Webhook Secret**:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Click "Add endpoint"
   - Set the endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
   - Select events to listen to:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Copy the **Signing secret** (starts with `whsec_`)

## Local Development with Stripe CLI

For local testing, use the Stripe CLI to forward webhook events:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. The CLI will output a webhook signing secret. Use this in your `.env` file as `STRIPE_WEBHOOK_SECRET`

## Testing the Payment Flow

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing the Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Navigate to an event and click "Comprar"

4. You'll be redirected to the Stripe Checkout page

5. Use a test card to complete the payment

6. You'll be redirected back to the success page

7. Check your terminal to see the webhook event being processed

## Production Deployment

### 1. Update Environment Variables

Replace test keys with live keys:
- `sk_live_...` for `STRIPE_SECRET_KEY`
- `pk_live_...` for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Update `NEXT_PUBLIC_APP_URL` to your production domain

### 2. Configure Webhook Endpoint

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-production-domain.com/api/webhooks/stripe`
3. Select the same events as in test mode
4. Copy the signing secret and update `STRIPE_WEBHOOK_SECRET`

### 3. Test in Production

Use real cards or Stripe test mode in production to verify everything works.

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive keys
- Verify webhook signatures to prevent fraud
- Use HTTPS in production
- Keep your Stripe keys secure

## Troubleshooting

### Webhook not receiving events

- Check that Stripe CLI is running (local dev)
- Verify webhook URL is correct in Stripe Dashboard
- Check webhook signing secret matches your `.env`
- Look for errors in your server logs

### Payment not completing

- Check Stripe Dashboard for payment status
- Verify webhook is processing `checkout.session.completed` events
- Check database for transaction status updates
- Look for errors in webhook handler logs

### Redirect URLs not working

- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check that success/cancel URLs are accessible
- Ensure URLs use HTTPS in production

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
