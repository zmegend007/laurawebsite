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
| Email Ingest | Gmail API (OAuth2) | Fetch Laura's product emails + image attachments |

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
- Headings: **Cormorant** (serif, weight 200–400) — editorial, refined
- Body: **Work Sans** (sans-serif, weight 300–500) — clean, high-legibility
- Palette: `#000000`, `#FFFFFF`, `#F5F5F5`, `#1A1A1A`, `#C4A882` (warm accent)
- Photography: full-bleed, no rounded corners, no drop shadows
- Grain texture overlay on hero + light sections for cinematic depth

### Navigation
- Minimal top nav: logo left, hamburger right (mobile)
- Links: Styling | Rent | About | Contact

---

## Product Data Schema

### Field Priority

**Tier 1 — ESSENTIAL (every product):**

| Field | Shopify Path | Format |
|-------|-------------|--------|
| Title | `title` | `Designer — Garment Type in Material` (e.g. "Roberto Collina — Wool V-Neck Sweater") |
| Description | `body_html` | Editorial HTML — opening hook, material details, styling suggestions, sizing note |
| Images | `images[]` | Min 3 per garment, with descriptive `alt` text |
| Price | `variants[0].price` | Rental price (base for FlexConversion) |
| Compare At Price | `variants[0].compare_at_price` | Retail value — powers strikethrough + savings display |
| Vendor | `vendor` | Designer name exactly as known (e.g. "Roberto Collina", "Balenciaga") |
| Product Type | `product_type` | Category: Sweater, Dress, Bag, Jacket, Trousers, Accessories |
| Tags | `tags` | Comma-separated: `for-rent`, `for-sale`, `designer:Name`, `category:Type`, `season:SS25`, `color:Black`, `material:Wool` |
| Size | `variants[0].option1` | DE/EU sizing (S, M, L, 36, 38, etc.) |
| Status | `status` | `active` when ready |

**Tier 2 — HIGH VALUE (when info available):**

| Field | Shopify Path | Notes |
|-------|-------------|-------|
| Retail Value metafield | `custom.retail_value` (money) | Same as compare_at_price, stored as metafield for template display |
| Fabric | `shopify.fabric` | Metaobject reference — Wool, Silk, Cotton, etc. |
| Color Pattern | `shopify.color-pattern` | Metaobject reference — for filtering |
| Image Alt Text | `images[].alt` | SEO + accessibility (e.g. "Roberto Collina cream wool V-neck sweater front view") |
| SKU | `variants[0].sku` | Format: `DESIGNER-TYPE-SIZE` (e.g. `RC-SWEATER-S`) |

**Tier 3 — AUTO/OPTIONAL:** neckline, target-gender, age-group, top-length-type, weight, barcode

**Tier 4 — APP-MANAGED (never set manually):** `flex_conversion.config`, `inventory_quantity`

### Product Description Template

Every product description follows this structure in `body_html`. Keep it **short — mobile-first**. Most customers scroll on their phone.

```html
<p><strong>3-word hook.</strong> 1-2 sentences max — garment appeal + designer nod + condition.</p>

<h4>The Designer</h4>
<p>2-3 sentences about the designer/house. Heritage, craftsmanship, where they're stocked. This is what customers google — give it to them here.</p>

<h4>Details</h4>
<ul>
  <li>Material & composition (e.g. "68% Baby Alpaca blend — finer than cashmere")</li>
  <li>Measurements — combine on one line with · separator</li>
  <li>Size + fit note on one line</li>
  <li>Condition</li>
  <li>Retail value</li>
</ul>
```

**Rules:**
- **NO styling tips.** That's Laura's domain — she advises clients in person. Never include "pair with" or "wear it to" suggestions.
- Tone: editorial luxury magazine. Confident, never salesy.
- Max 3 sections: Hook → Designer → Details. Nothing else.
- Keep bullet points tight — use · separators to combine related info on one line.

---

## Product Pipeline Workflow

Two modes: **Enrich** (products already on Shopify) and **Ingest** (new products from Laura's emails).

---

### Mode A: Enrich Existing Products

When the user says "we got new products" or similar, and products are already uploaded to Shopify:

**Step 1: Discover**
- Get fresh Shopify API token via client credentials grant
- `GET /admin/api/2024-10/products.json` — find all products
- Identify unenriched: `vendor == "lauramesserschmitt"` OR no tags OR no `body_html`

**Step 2: Inspect**
- Download all product images via Shopify CDN URLs
- Visually inspect each image to identify: brand, garment type, material, colour, condition
- Read labels/tags in photos for size, composition, origin — **these override title info**

**Step 3: Research**
- Use **WebSearch** to research designer and specific garment (parallel agents for speed)
- Look for: brand story, retail price, collection info, material details
- Cross-reference with Laura's email snippets if available

**Step 4: Write**
- Title format: `Designer — Garment Type in Material`
- Editorial description: Hook → The Designer → Details (NO styling tips, mobile-first)
- Tag set: `for-rent, designer, {brand-handle}, {product-type}, {size}, {material}, {colour}`
- SKU format: `BRAND-TYPE-SIZE`
- Alt text for every image (descriptive, SEO-friendly)
- If brand/details unclear: prefix title with `?` and add `? needs-review` tag

**Step 5: Push**
- Single Python script per batch via Shopify Admin REST API:
  - `PUT /products/{id}.json` — title, body_html, vendor, product_type, tags
  - `PUT /variants/{id}.json` — SKU, compare_at_price (retail value)
  - `PUT /products/{id}/images/{id}.json` — alt text for each image
  - `POST /inventory_levels/set.json` — set to 1 if currently 0
  - `POST /collects.json` — add to collections (Frontpage, Shoes, Bags, etc.)

**Step 6: Hero Image Processing (Gemini)**
- Download hero image (position 1) from Shopify CDN
- Send to Gemini `gemini-2.5-flash-image` with locked prompt (see `memory/gemini-hero-template.md`)
- Prompt places garment on a natural, healthy-bodied female model — grey studio, 1:1 square
- Save output for user review before uploading
- Upload edited 1024x1024 PNG as new hero (position 1); original mannequin photo shifts to position 2+
- Credentials: Gemini API key in `memory/gemini-credentials.md`

**Step 7: Verify**
- Spot-check 2-3 products via API: confirm all fields saved, 0 missing alt texts, hero image updated
- Report summary table to user with flagged items

---

### Mode B: Ingest from Laura's Emails (Gmail → Shopify)

Laura sends product images and descriptions via email. This mode fetches them directly.

**Step 0: Authenticate**
- Gmail OAuth2 tokens stored at `~/.gmail-mcp/credentials.json`
- If token expired, refresh via `POST https://oauth2.googleapis.com/token` with refresh_token
- Google Cloud Project: `automation-fashionpipeline`

**Step 1: Fetch Emails**
- Search: `from:lauramonamesserschmitt@gmail.com has:attachment`
- For each email: extract subject, snippet (contains garment description in German), date
- For each image attachment: download via `GET /messages/{id}/attachments/{attId}`
- Skip `1000024133.jpg` — this is Laura's email signature image, not product content

**Step 2: Cross-Reference**
- Compare email subjects/snippets against existing Shopify product titles
- Match by brand + garment type to avoid duplicates
- Flag emails whose products are already on Shopify (skip or update images)

**Step 3: Parse Laura's Description**
- Laura's email snippets contain: brand, garment type, size, colour, material, condition, sometimes retail price
- These are in German — parse and translate key fields
- Example: "Hermès Lederhose Größe 34 XS Hergestellt in Belgien Vintage" → Hermès, leather trousers, size 34/XS, Made in Belgium, vintage

**Step 4: Create Shopify Product**
- `POST /admin/api/2024-10/products.json` — create product with images from email
- Upload images via Shopify's `images[].attachment` field (base64)
- Set initial data from Laura's email description

**Step 5: Enrich**
- Run Mode A enrichment on the newly created product (research, write, push)

**Step 6: Hero Image Processing (Gemini)**
- Same as Mode A Step 6 — process hero through Gemini, upload edited version

**Step 7: Verify**
- Confirm all fields, hero image, and alt texts

---

### Email Sender
- **From:** lauramonamesserschmitt@gmail.com
- **To:** contact@marielouisemueller.com
- **Volume:** ~138 emails, ~677 images to date (growing daily)
- **Format:** German text with product details in subject/body + JPEG attachments

### API Credentials
- **Shopify:** Stored in Claude's local memory (never committed to git)
  - See `~/.claude/projects/-Users-Pumpkinshoe2-Desktop-laurawebsite/memory/shopify-credentials.md`
  - Token flow: `POST /admin/oauth/access_token` with `grant_type=client_credentials`
  - Scopes: write_products, write_files, write_inventory, write_metaobject_definitions, write_content
- **Gmail:** OAuth2 credentials at `~/.gmail-mcp/gcp-oauth.keys.json`
  - Tokens at `~/.gmail-mcp/credentials.json` (auto-refresh)
  - Google Cloud Project: `automation-fashionpipeline` (ID: 261602617341)
  - Scopes: gmail.modify, gmail.settings.basic

### Collections
| Collection | ID | Type |
|---|---|---|
| Frontpage | 692721058176 | Manual |
| Shoes | 692734099840 | Manual |
| Bags | 692776305024 | Manual |
| Vintage | 692734067072 | Manual |
| For Rent | 692751139200 | Smart (tag: for-rent) |

### Location ID
`114145984896`

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
