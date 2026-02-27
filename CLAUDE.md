# Laura Messerschmitt — Digital Showroom

## Project Overview

Premium stylist portfolio & rental engine for Laura Messerschmitt, a Berlin-based fashion stylist. Built on **Shopify Basic** with a custom Liquid theme. Replaces the existing WordPress site at `laura-messerschmitt.de`.

**Client:** Laura Mona Messerschmitt
**Agency:** Maison Malou Berlin
**Language:** German only (v1.0)
**Workflow:** Build locally → Push to GitHub → Shopify pulls theme via GitHub integration

---

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Platform | Shopify Basic | CMS, products, inventory, checkout |
| Theme | Custom Liquid | Bespoke front-end (no pre-built theme) |
| Rental Logic | FlexConversion (free app) | Calendar, duration pricing, deposits, rent/buy toggle |
| Payments | Stripe (via Shopify Payments) | Payment processing |
| Email | Google Workspace | Branded professional email |
| Automation | n8n (Maison Malou managed) | Content pipeline, monthly reports, newsletter |
| Analytics | Shopify Analytics + Google Search Console | Traffic & SEO |
| Image Hosting | Shopify native | Product images hosted on Shopify CDN |

---

## Architecture

```
FRONT-END (Custom Liquid Theme)
├── Portfolio (gallery, video, testimonials)
├── Rental Engine (FlexConversion-powered PDP)
└── Shop (direct purchase)

SHOPIFY CORE
├── Products · Inventory · Checkout · Customers

INTEGRATIONS
├── FlexConversion (rental calendar + pricing)
├── Stripe (payments)
└── Google Workspace (email)

AGENCY BACKEND (n8n)
├── Content Pipeline (Google Drive → Shopify)
├── Monthly Reports (analytics compilation)
└── Newsletter (draft → approve → send)
```

---

## Core Modules

### 1. Portfolio
- Hero section with looping background video (muted, autoplay, optimised MP4)
- Project gallery as Shopify blog or metaobject collection
- Detail pages: image grids, embedded YouTube videos, descriptions
- Categories: Events, Videos, Photo Shoots, Red Carpet, Magazine
- Testimonials as a dedicated scrollable component
- Infinite scroll or "load more" on mobile
- Minimal UI: no Shopify chrome, no breadcrumbs, no sidebar

### 2. Rental Engine
- UX reference: HURR Collective (client-approved)
- FlexConversion handles: calendar, availability, duration pricing, deposits, double-booking prevention
- Duration pricing displayed as **horizontal selectable cards** (not dropdown): duration, total, daily rate, savings %
- Retail value shown alongside rental price ("Retail: €X — You save €Y")
- Primary CTA: "Book This Look"
- Cart/checkout shows: garment name, rental dates, duration, total
- Post-checkout: automated confirmation email with return instructions

### 3. E-Commerce Shop
- Shares product catalogue with rentals (tag-based separation)
- Tags: `for-rent`, `for-sale` (products can have both)
- Dual items use FlexConversion's native Rent/Buy toggle
- Standard collection → PDP → cart → checkout flow
- Filtering by category, size, price range

### 4. Communication Layer
- Floating WhatsApp button (all pages, bottom-right)
  - Opens `wa.me/4915773142682` with pre-filled message including page URL
- Contact page: simple form (Name, Email, Message) → branded inbox
- No chatbot, no live chat

### 5. Domain & Email
- Domain: `laura-messerschmitt.de` (migrated to Shopify, or new domain — TBD)
- Google Workspace: branded email replacing Gmail
- 301 redirects from old WordPress URLs
- Social links in footer: Instagram, TikTok, LinkedIn, YouTube

---

## Design Direction

### Principles
- **"Berlin Minimal"** — monochrome base, whitespace-heavy, sharp typography
- **Mobile-first** — every layout starts at 375px
- **Speed over spectacle** — no heavy animation libraries; subtle transitions only
- **HURR-inspired rental PDP** but more personal, more Berlin

### Typography & Colour
- Headings: editorial sans-serif (Neue Haas Grotesk / Helvetica Now / Google Font alt)
- Body: clean, high-legibility sans-serif
- Palette: `#000000`, `#FFFFFF`, `#F5F5F5`, one muted warm accent (TBD)
- Photography: full-bleed, no rounded corners, no drop shadows

### Navigation
- Minimal top nav: logo left, hamburger right (mobile)
- Max 5 links: Portfolio, Rent, Shop, About, Contact

---

## Product Data Schema

| Field | Shopify Mapping | Notes |
|-------|-----------------|-------|
| Title | `title` | German, with designer name |
| Description | `body_html` | Styling note + fabric/care |
| Images | `images` | Min 3 per garment |
| Sale Price | `variants[].price` | For outright purchase |
| Rental Pricing | FlexConversion config | Duration-based tiers |
| Size | `variants[].option1` | DE/EU sizing |
| Colour | `variants[].option2` | If applicable |
| Tags | `tags` | `for-rent`, `for-sale`, `category:*`, `designer:*` |
| Retail Value | Custom metafield | For "Save €Y" display |

---

## FlexConversion Integration

- App injects its own JS/CSS on PDP — theme must override/contain styling
- Budget significant time for CSS overrides (HURR-style cards are custom UI, not default)
- Use FlexConversion's custom CSS support before resorting to JS overrides
- Calendar and pricing logic lives in the plugin — do not rebuild
- Verify double-booking prevention works with Shopify native inventory during QA
- Demo store: `flexcon-us-demo.myshopify.com`
- Docs: https://flexconversion-product-rental.gitbook.io/user-guide

---

## n8n Workflows (In Scope)

### Content Pipeline
- Trigger: Laura drops assets in shared Google Drive folder
- Process: detect new files → resize/optimise → format metadata → upload to Shopify via Admin API
- Output: new content live on site, Laura notified via email

### Monthly Reporting
- Trigger: 1st of each month (scheduled)
- Process: pull Shopify Analytics + Google Search Console → compile report
- Output: PDF/email briefing (traffic, top products, SEO, Berlin fashion events)

### Newsletter
- Trigger: bi-weekly or monthly (scheduled)
- Process: index recent site updates + trends → generate draft
- Output: draft to Laura for approval → distribute on approval
- Platform: TBD (Klaviyo / Shopify Email / Mailchimp)

---

## Development Conventions

### Shopify Theme
- Build locally, push to GitHub, Shopify pulls via GitHub integration
- Use Shopify CLI for local dev (`shopify theme dev`)
- Section-based architecture — every visual block is a Shopify section with schema
- All content editable via Shopify admin (no code deploys for content changes)
- Lazy-load all media; preload hero video
- Mobile-first CSS (start at 375px, enhance upward)
- No heavy JS frameworks — vanilla JS or Alpine.js at most
- Lighthouse Performance target: ≥ 85

### Theme File Structure
```
├── assets/          # CSS, JS, images, fonts
├── config/          # settings_schema.json, settings_data.json
├── layout/          # theme.liquid (main layout)
├── locales/         # de.default.json (German)
├── sections/        # Modular sections (hero, portfolio, rental-pdp, etc.)
├── snippets/        # Reusable partials (product-card, whatsapp-button, etc.)
├── templates/       # Page templates (collection, product, page, blog, etc.)
└── templates/customers/  # Account templates (if needed later)
```

### CSS
- BEM naming convention
- CSS custom properties for theme colours/fonts
- No Tailwind, no CSS-in-JS — plain CSS or SCSS compiled to single stylesheet
- FlexConversion overrides in a dedicated `flexcon-overrides.css` file

### JavaScript
- Vanilla JS preferred; Alpine.js acceptable for interactive components
- No React, no Vue, no SPA frameworks
- Shopify AJAX Cart API for cart interactions
- Defer/async all non-critical scripts

---

## Open Items (Require Decisions)

1. Domain — retain `laura-messerschmitt.de` or purchase new branded domain?
2. Accent colour — muted warm tone TBD with Laura
3. FlexConversion compatibility — verify on Shopify Basic (duration cards, rent/buy toggle, deposits)
4. Newsletter platform — Klaviyo vs. Shopify Email vs. Mailchimp
5. WhatsApp — existing personal number or WhatsApp Business?
6. Rental pricing — flat 200€/outfit or duration-based tiers per garment?

---

## Out of Scope (v1.0)

- Multi-language support (English toggle)
- Customer accounts / rental history
- Blog / editorial section
- SMS marketing
- Custom mobile app
- Additional bookable services (Wardrobe Makeover, Shopping Consultation, etc.)
- Peer-to-peer marketplace model

---

## v2 Assets

The previous React/Vite/Supabase prototype (in the `laura website` directory) includes a working **AI virtual try-on** system using Replicate API via Supabase Edge Functions. Deferred to v2 per the RPD but represents prior art:
- `useTryOn.js` hook with caching logic
- `generate-tryon` Supabase Edge Function
- `tryon_cache` database table
- Mannequin display component

Reference when planning v2's AI try-on feature.

---

## Reference Links

| Resource | URL |
|----------|-----|
| Current site | https://www.laura-messerschmitt.de/ |
| Rental UX reference | https://www.hurrcollective.com/listings/rabanne-lace-trimmed-silk-satin-maxi-dress |
| FlexConversion App | https://apps.shopify.com/flexcon-product-rental-hire |
| FlexConversion Demo | https://flexcon-us-demo.myshopify.com/ |
| FlexConversion Docs | https://flexconversion-product-rental.gitbook.io/user-guide |
| Laura's YouTube | https://www.youtube.com/@LauraMonaMesserschmitt |
