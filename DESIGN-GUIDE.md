# FlyDeals — Design Tokens & Utviklerguide

## Farger
```
Primary (Orange):     #ff6b00
Primary Dark:         #e55f00
Background:           #050505
Surface:              #0e0e0e  (kort, paneler)
Surface 2:            #111111  (hover)
Border:               #1a1a1a
Border Hover:         rgba(255,255,255,0.12)
Text Primary:         #ffffff
Text Secondary:       rgba(255,255,255,0.5)
Text Tertiary:        rgba(255,255,255,0.28)
Green (deals):        #22c55e
```

## Typografi
```
Font:        DM Sans (Google Fonts)
Weights:     400, 500, 600, 700, 800, 900
Google URL:  https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap

Heading XL:  font-size: 58px, font-weight: 900, letter-spacing: -2.5px
Heading L:   font-size: 40px, font-weight: 900, letter-spacing: -1.5px
Heading M:   font-size: 24px, font-weight: 800, letter-spacing: -0.5px
Body:        font-size: 15px, font-weight: 400
Small:       font-size: 13px
Caption:     font-size: 11px
```

## Ikonbibliotek
```
Material Symbols Outlined
URL: https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap
Bruk: <span class="material-symbols-outlined">icon_name</span>
```

## Spacing
```
Border radius kort:   12px (rounded-xl)
Border radius knapp:  100px (rounded-full)
Border radius input:  12px
Sidebar bredde:       256px (w-64)
Navbar høyde:         56px
```

## Komponenter

### Primær knapp
```html
<button style="
  background: #ff6b00;
  color: #fff;
  border-radius: 100px;
  padding: 13px 26px;
  font-family: DM Sans;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
">Logg inn</button>
```

### Deal badge (grønn)
```html
<span style="
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  color: #22c55e;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
">-41%</span>
```

### Kort
```html
<div style="
  background: #0e0e0e;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 20px;
"></div>
```

## Filstruktur
```
flydeals/
├── index.html          ← Landingsside (offentlig)
├── login.html          ← Logg inn / Registrer (offentlig)
├── deals.html          ← Live deals (innlogget)
├── varsler.html        ← Dine varsler (innlogget)
├── oppdag.html         ← Oppdag ruter (innlogget)
├── historikk.html      ← Historikk (innlogget)
├── innstillinger.html  ← Innstillinger (innlogget)
└── brukerstotte.html   ← Brukerstøtte (innlogget)
```

## Abonnement
```
Prøveperiode:  7 dager gratis
Pris:          149 kr / mnd
Binding:       Ingen
Betaling:      Stripe (planlagt)
```

## Flyplasser vi dekker
```
OSL — Oslo Gardermoen
TRF — Torp / Sandefjord
BGO — Bergen Flesland
SVG — Stavanger Sola
TRD — Trondheim Værnes
TOS — Tromsø Langnes
KRS — Kristiansand Kjevik
```

## Tech stack (planlagt)
```
Frontend:    Next.js / Vercel
Database:    PostgreSQL (Railway)
E-post:      Resend
Betaling:    Stripe
Datainnhenting: fli-biblioteket + Webshare proxy
```
