# GolfGives - Premium Charity Golf Platform

GolfGives is a production-grade web application that turns every golf round into a contribution for high-impact charities, combined with a monthly prize draw based on user scores.

## 🚀 Built With
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Server Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (Checkout + Webhooks + Portal)
- **Email**: Resend.com
- **Animations**: Framer Motion

## 🎯 Architecture
### Database Schema
The system uses a highly relational PostgreSQL schema with Row Level Security (RLS).
- `profiles`: User information, subscription status, and charity preferences.
- `charities`: Directory of partner organizations.
- `golf_scores`: User-submitted rounds (rolling 5 limit).
- `draws`: Monthly prize draw records.
- `winners`: Prize claim and verification tracking.

### Core Logic
1. **Draw Engine**: Implements both `Truly Random` and `Algorithmic` (popularity-based) draw strategies.
2. **Impact Calculator**: Dynamic calculation of charity donations (min 10%) and prize pool (50%) from subscriptions.
3. **Verification**: Multi-stage winner verification process requiring admin approval of score proof.

## 🛠️ Getting Started
1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Copy `.env.local.example` to `.env.local` and fill in the keys.
4. **Database Setup**: Execute the `supabase-schema.sql` in your Supabase SQL Editor.
5. **Run the app**: `npm run dev`

## 🔒 Security
- Strict RLS policies ensure users can only access their own data.
- Server-side middleware protects `/dashboard` and `/admin` routes.
- Stripe Webhook verification prevents spoofing.
- Admin access is restricted via database roles.

## 🎨 Brand Guidelines
GolfGives avoids traditional "golf" aesthetics (grass green, literal balls/clubs) in favor of a premium, impact-first luxury brand.
- **Forest Green**: Impact & Growth
- **Charcoal**: Stability & Modernity
- **Gold**: Excellence & Reward
- **Cream**: Cleanliness & Premium Feel

## 🚀 Deployment (Vercel)
1. **Push to GitHub**: Connect your repository to Vercel.
2. **Environment Variables**: Add all keys from `.env.example` to Vercel Project Settings.
3. **App URL**: Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL.
4. **Supabase Auth**: Add your Vercel URL to "Redirect URLs" in the Supabase Dashboard.
5. **Stripe Webhook**: Add `https://your-domain.com/api/stripe/webhook` to Stripe and copy the signing secret to `STRIPE_WEBHOOK_SECRET`.

---
*Created as a premium full-stack solution for Golf Draw & Charity Platform.*
