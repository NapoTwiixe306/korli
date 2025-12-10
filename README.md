# 📘 korli — FULL PROJECT DOCUMENTATION

**Complete Product Specification — V1**

---

## #️⃣ 1. Product Name

**korli**

*"The Intelligent Link Identity Platform"*

---

## #️⃣ 2. Concept Overview

korli is an adaptive, intelligent link-in-bio platform.

Unlike Linktree, which is static, korli personalizes content in real time based on each visitor.

**korli = Your entire digital identity, optimized automatically.**

---

## #️⃣ 3. Core Differentiation

### 🧠 Smart Blocks (Killer Feature)

Every link (block) can change dynamically using conditions:

- **Traffic source** (TikTok, IG, YouTube, etc.)
- **Country**
- **Device type**
- **New vs returning visitors**
- **Time of day / day of week**
- **Smart auto-optimization**
- **A/B testing on blocks**

This system turns a simple "link page" into a mini-landing page that adapts like a funnel.

**No competitor does this well.**

---

## #️⃣ 4. Target Users

- Content creators
- Entrepreneurs
- Freelancers
- Influencers
- Streamers
- Coaches / Educators
- Anyone needing a clean, link-in-bio system

---

## #️⃣ 5. High-Level Goals

- Replace static link pages with intelligent adaptive identities
- Provide creators with better analytics than Linktree
- Create the most visually polished link-in-bio builder on the market
- Monetize through Pro / Pro+ plans + template marketplace
- Build long-term toward automation and integrations

---

## #️⃣ 6. Product Features (Complete List)

### 6.1 Public Page

Accessible via:
- `korli.fr/username`

Features:
- Fully customizable design
- Blocks arranged vertically
- Dynamic Smart Rules system
- Auto-generated shortlinks
- Adaptive layout (mobile-first)

### 6.2 Blocks (Link Modules)

**Block types:**

- Standard Link
- Social Link
- Media (YouTube, TikTok…)
- Contact
- Product (V2)
- Calendar Link
- Pay/Tip Button (Stripe)
- Shortlink Block
- A/B Testing Block
- Conditional Block
- Promo Block
- Event Mode Block

### 6.3 Smart Rules

Rules that modify which blocks appear to which visitors.

**Rule categories:**

- **Traffic Source**: TikTok / IG / YouTube / Direct / Google
- **Device**: mobile / desktop
- **Location**: country
- **Time-based**: day of week / hour
- **Visitor Type**: new / returning
- **Smart Optimization**: auto reorder based on performance

### 6.4 Design Builder

**Controls:**

- Themes
- Colors
- Gradients
- Fonts
- Button styles
- Layout spacing
- Backgrounds
- Avatar + bio

### 6.5 Analytics

**Overview:**

- Total views
- Total clicks
- Global CTR
- Block performance ranking

**Traffic Sources:**

- TikTok
- Instagram
- YouTube
- Twitter
- Direct
- Other

**Audience (Pro):**

- Countries
- Devices
- Returning visitors

**Behavior:**

- Scroll depth
- Engagement time

### 6.6 Shortlinks

- Auto-generated per block
- Manual creation
- Stats per shortlink
- Custom alias (Pro)
- Smart Rules on shortlinks (Pro+)

### 6.7 Integrations

(Available from Ascendant)

- Stripe
- Calendly
- YouTube
- TikTok
- Shopify (later)

### 6.8 Shop / Digital Products (V2 Ascendant)

- Add products
- Set price
- Checkout via Stripe
- Track purchases
- Upsell blocks

### 6.9 Automations (V3 Nebula)

- "If visitor is from TikTok → show promo block"
- "If block is ignored 3 days → auto reorder"
- "If new visitor → tag + show welcome message"

---

## #️⃣ 7. Pricing Model

### Free

- 1 page
- 20 blocks
- Shortlinks illimités
- Analytics avancés gratuits (ton différenciateur)
- Smart Rules basiques (3 règles actives)
  - Conditions simples : Traffic source OU Device OU Country
  - Actions : Show/Hide blocks
  - Pas de conditions multiples complexes
  - Pas de time-based rules
- Templates basiques
- QR codes
- Lien korli.fr/username
- Light branding

### Premium (7–9€/month)

- Tout du Free
- Pages illimitées (ou 3–5 pages)
- Blocks illimités
- Smart Rules avancées (5–10 règles actives)
  - Conditions multiples : Traffic source ET Device ET Country
  - Time-based rules (heure, jour de la semaine)
  - Visitor type (new vs returning)
  - Réordonnancement automatique
- Thèmes premium + animations
- Embeds (YouTube, Spotify, X posts)
- Suppression du branding
- Shortlinks custom (alias personnalisés)
- Support email

### Pro (15€/month)

- Tout du Premium
- Smart Rules illimitées
- A/B testing sur les blocks
- Custom domain
- Analytics exports (CSV/PDF)
- Pages multiples (3–5)
- Support prioritaire

### Pro+ (25€/month) — V2 Features

- Tout du Pro
- Shop access (V2)
- Automatisations avancées (V3)
- Multi-brands (3–5 brands)
- API access (V3)

---

## #️⃣ 8. Product Roadmap (Named Versions)

### 🔹 Version 0 — ALPHA: Foundation

**Goal:** Working MVP.

**Includes:**

- Auth
- Blocks
- Basic appearance
- Public page
- Basic analytics
- Shortlinks

### 🔹 Version 1 — GENESIS

**The real public release.**

**Includes:**

- Smart Rules basic
- Advanced analytics
- Design builder full
- A/B testing basic
- Premium system
- Custom domain

### 🔹 Version 2 — ASCENDANT

**Where korli becomes better than Linktree.**

**Includes:**

- Smart Rules advanced
- Product shop
- Stripe payments
- Event blocks
- Advanced funnels
- Templates marketplace

### 🔹 Version 3 — NEBULA

**Full automation ecosystem.**

**Includes:**

- Automations (IFTTT style)
- API
- Integrations
- Marketplace for blocks/themes

---

## #️⃣ 9. Architecture Overview

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind
- Server Components
- Edge rendering for public pages

### Backend

- PostgreSQL
- Prisma
- Redis (for tracking & rate limiting)
- tRPC or REST
- Edge functions for fast redirect

### Routing Structure

```
app/
 ├ dashboard/
 │   ├ page.tsx
 │   ├ page-builder/
 │   ├ analytics/
 │   ├ account/
 │   └ tools/
 ├ api/
 │   ├ blocks/
 │   ├ rules/
 │   ├ shortlinks/
 └ (public-pages)/[username]/
```

---

## #️⃣ 10. Sidebar Structure (Final English Version)

### Dashboard

### Page Builder
   • Blocks
   • Appearance
   • Smart Rules
   • Preview

### Analytics
   • Overview
   • Traffic Sources
   • Block Performance
   • Audience (Pro)

### Account
   • Profile
   • Page URL
   • Billing
   • Security

### TOOLS
   • Shortlinks
   • Templates (Coming Soon)
   • Integrations (Coming Soon)

---

## #️⃣ 11. User Flow Summary

1. User registers
2. Chooses username
3. Page is instantly created
4. Dashboard appears
5. User adds blocks
6. Customizes design
7. Sets rules
8. Shares link
9. Analytics start tracking
10. Upsell triggers naturally (rules, analytics, themes)

---

## #️⃣ 12. Brand Principles

- Clean UI
- Fast interactions
- Beautiful design templates
- Smart by default
- No complexity for beginners
- Depth for advanced creators

---

## #️⃣ 13. Future Expansions

- Team accounts
- Collaboration
- AI-generated themes
- AI block suggestions
- Personalized funnels

---

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Development

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

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**✅ END OF DOCUMENT**

This is the complete korli product specification, ready for development, design, and marketing.
