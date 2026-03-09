# CLAUDE.md — FlyDeals / FLYDNO-FRONTEND

This file describes the codebase structure, conventions, and development workflows for AI assistants working on this repository.

---

## Project Overview

**FlyDeals** is a Norwegian flight deal alert and discovery platform. It is currently a **static HTML/CSS/JavaScript prototype** — no build system, no framework, no backend. Every page is a self-contained HTML file.

**Target audience:** Norwegian-speaking travelers looking for discounted flights from Norwegian airports.

**Business model:** 7-day free trial, then 149 kr/month (no lock-in). Payments via Stripe (planned).

---

## Repository Structure

```
NR3/
├── index.html             # Public landing page (7-day trial CTA, animated globe)
├── login.html             # Login / registration page (public)
├── deals.html             # Live flight deals (authenticated app view)
├── varsler.html           # Notification alerts management
├── oppdag.html            # Discover routes / browse destinations
├── historikk.html         # Booking/deal history
├── innstillinger.html     # Account settings
├── brukerstotte.html      # Help & support / FAQ
├── earth-preview.html     # Embedded globe preview (base64 image, utility page)
├── DESIGN-GUIDE.md        # Design tokens, typography, colors, component specs
├── README.md              # Minimal title file
├── iStock-1370838389.jpg  # Large background image (15.2 MB, 6689×3843 px)
├── fix.js                 # Batch Norwegian character encoding fix (Node.js)
├── fix_encoding.js        # Buffer-based UTF-8 recovery for mojibake
├── fix_encoding.ps1       # PowerShell encoding fix
├── fix_encoding.py        # Python encoding fix
├── fix_flags.js           # Repair corrupted emoji flag characters
├── replace_chars.ps1      # Targeted character replacement (Windows paths)
└── revert.ps1             # Revert changes script
```

**No `src/`, `components/`, `lib/`, or `public/` directories.** All application code lives at the root level in HTML files.

---

## Tech Stack

### Current (prototype)
- **HTML5** — semantic markup, `lang="no"`, `<html class="dark">`
- **Tailwind CSS** — loaded from CDN (`https://cdn.tailwindcss.com?plugins=forms,container-queries`), configured inline via `tailwind.config`
- **Vanilla JavaScript** — embedded in `<script>` tags per page, no framework
- **Google Fonts** — DM Sans (typography) and Material Symbols Outlined (icons)
- **No build step** — files are served directly as-is

### Planned backend (not yet implemented)
- **Frontend:** Next.js on Vercel
- **Database:** PostgreSQL (Railway)
- **Email:** Resend
- **Payments:** Stripe
- **Flight data:** fli-library + Webshare proxy

---

## Design System

See `DESIGN-GUIDE.md` for the full specification. Key values:

### Colors
| Token | Value |
|---|---|
| Primary (orange) | `#ff6b00` |
| Primary dark | `#e55f00` |
| Background | `#050505` |
| Surface (cards) | `#0e0e0e` / `#111111` |
| Border | `#1a1a1a` / `#1e1e1e` |
| Text primary | `#ffffff` |
| Text secondary | `rgba(255,255,255,0.5)` |
| Text tertiary | `rgba(255,255,255,0.28)` |
| Green (deals/savings) | `#22c55e` |

### Typography
- **Font:** DM Sans (Google Fonts), weights 300–900
- **Heading XL:** 58px, weight 900, letter-spacing −2.5px
- **Heading L:** 40px, weight 900, letter-spacing −1.5px
- **Heading M:** 24px, weight 800, letter-spacing −0.5px
- **Body:** 15px, weight 400
- **Small:** 13px — **Caption:** 11px

### Icons
Use Material Symbols Outlined via `<span class="ms">icon_name</span>`.
- Filled variant: add class `ms-fill`
- Size override: `style="font-size:18px"`

### Spacing & Shape
- Card border radius: 12px (`rounded-xl`)
- Button border radius: 100px (`rounded-full`)
- Sidebar width: 256px (`w-64`)
- Navbar height: 56px

---

## Page Conventions

### All authenticated pages share an identical shell:
1. **Tailwind CDN** script + inline `tailwind.config` with custom colors/fonts
2. **Google Fonts** link tags (DM Sans + Material Symbols)
3. A `<style>` block with shared utilities: `.ms`, `.ms-fill`, `.nav-active`, `.nav-link`, scrollbar styles
4. **`<html class="dark" lang="no">`** — always dark mode, always Norwegian
5. **Sidebar** (`<aside class="w-64 ...">`) with logo and navigation links
6. **Navbar** (`<div class="h-14 ...">`) at top of main content area
7. **Main content** area filling remaining space

### Navigation sidebar links (in order):
- `deals.html` — Live Deals (icon: `local_offer`)
- `varsler.html` — Dine Varsler (icon: `notifications`)
- `oppdag.html` — Oppdag Ruter (icon: `explore`)
- `historikk.html` — Historikk (icon: `history`)
- `innstillinger.html` — Innstillinger (icon: `settings`)
- `brukerstotte.html` — Brukerstøtte (icon: `help_outline`)

Active page nav item uses class `.nav-active`; others use `.nav-link`.

### Standard Tailwind config block (copy into every page `<head>`):
```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: { "primary": "#ff6b00", "bg": "#050505", "surface": "#111111", "border": "#1e1e1e" },
      fontFamily: { "sans": ["DM Sans", "sans-serif"] }
    }
  }
}
```

---

## Data Conventions

Flight deal data is **currently hardcoded as JavaScript constants** inside the HTML:

```js
const deals = [
  { from: 'Oslo', fromCode: 'OSL', to: 'Bangkok', toCode: 'BKK', flag: '🇹🇭', price: 2489, normal: 4230, discount: 41, airline: 'Norwegian', stops: 1, duration: '11t 20m' },
  // ...
]
```

### Supported Norwegian departure airports:
| Code | Airport |
|---|---|
| OSL | Oslo Gardermoen |
| TRF | Torp / Sandefjord |
| BGO | Bergen Flesland |
| SVG | Stavanger Sola |
| TRD | Trondheim Værnes |
| TOS | Tromsø Langnes |
| KRS | Kristiansand Kjevik |

---

## Character Encoding

Norwegian text contains special characters (ø, å, æ) that are vulnerable to UTF-8/Latin-1 mojibake. The `fix_*.{js,py,ps1}` scripts were created to repair corrupted content — they should not need to be run in normal development.

**Always save HTML files as UTF-8 without BOM.**

If characters appear corrupted (e.g. `Ã¸` instead of `ø`), run:
```bash
node fix.js
```

---

## Coding Conventions

- **Language:** All UI text and comments are in **Norwegian (Bokmål)**
- **No external JS files:** JavaScript is embedded in `<script>` tags within each HTML page
- **No CSS files:** Styles use Tailwind utilities + embedded `<style>` blocks
- **DOM manipulation:** Vanilla `document.getElementById()`, `.innerHTML`, `.classList`
- **Data rendering:** Filter arrays, then `map()` to HTML strings, inject via `.innerHTML`
- **Event handlers:** Mix of inline `onclick` attributes and `addEventListener()`
- **No modules, no bundler, no transpilation** — code must run in modern browsers as-is

---

## No Tests, No Build

This project has **no test suite** and **no build pipeline**. There is nothing to run.

To preview locally, open any `.html` file directly in a browser, or serve with any static file server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Component Reference

### Primary button
```html
<button style="background:#ff6b00;color:#fff;border-radius:100px;padding:13px 26px;font-family:DM Sans;font-weight:700;font-size:14px;border:none;cursor:pointer;">
  Logg inn
</button>
```

### Deal badge (green savings indicator)
```html
<span style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);color:#22c55e;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700;">
  -41%
</span>
```

### Card container
```html
<div style="background:#0e0e0e;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;">
</div>
```

---

## Git Workflow

- **Default branch:** `master`
- **Feature branches:** prefix with `claude/` for AI-assisted work
- Only 2 commits in history — project is early-stage

When making changes:
1. Work on the designated feature branch
2. Commit with clear, descriptive messages in English or Norwegian
3. Push with `git push -u origin <branch-name>`

---

## Key Things to Know for AI Assistance

1. **No framework magic** — everything is plain HTML/CSS/JS; changes are straightforward
2. **Duplicate sidebar/navbar** across all authenticated pages — if changing the nav, update all 6 pages
3. **Inline styles are intentional** — design values are hardcoded inline, not via CSS variables, because there is no build step to inject them
4. **Data is mock** — all deal prices, airlines, and routes are sample data; do not treat them as real
5. **Norwegian language** — all user-facing text should remain in Norwegian (Bokmål)
6. **Dark mode only** — do not add light mode; the design is dark-first and dark-only
7. **CDN Tailwind limitations** — some Tailwind features (JIT arbitrary values, plugins) may behave differently from a locally installed Tailwind build
8. **Large image asset** — `iStock-1370838389.jpg` is 15 MB; avoid git operations that re-encode or duplicate it
