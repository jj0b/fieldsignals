This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Stripe webhooks (local development)

Stripe cannot call `localhost`, so locally you forward events with the [Stripe CLI](https://stripe.com/docs/stripe-cli):

1. **Install the Stripe CLI** (macOS): `brew install stripe/stripe-cli/stripe`. Then log in: `stripe login`.
2. In one terminal, run: `bun run stripe:listen`. Leave it running.
3. The CLI will print a **webhook signing secret** (`whsec_...`). Add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
   ```
4. Restart your Next app (`bun dev`) so it picks up the new env var. After that, completed checkouts (and subscription events) will be forwarded to your local `/api/stripe/webhook`.

Your existing Stripe keys in `.env.local` (from the Dashboard: Developers → API keys and Product catalog) are enough; the only extra value for local webhook testing is `STRIPE_WEBHOOK_SECRET` from the CLI in step 3.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
