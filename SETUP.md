# SETUP.md — FlyDeals Flydeal-deteksjonssystem

Dette dokumentet beskriver hvordan du setter opp og kjører det komplette flydeal-deteksjonssystemet for FlyDeals.

## Oversikt over systemet

Systemet består av tre hovedkomponenter:

1. **Databasemigrasjoner** — Opprett `price_history`-tabell og oppdater `flights`-tabell
2. **Edge Function: `fetch-flights`** — Henter flyprisdata fra RapidAPI og lagrer historiske priser
3. **Edge Function: `send-deal-alerts`** — Sender e-poster til brukere med nye deals
4. **Frontend `deals.html`** — Viser reelle prisdata fra databasen

---

## Del 1: Miljøvariabler (Environment Variables)

Før du starter, må du sette opp følgende miljøvariabler i Supabase:

### 1.1 RapidAPI Google Flights API-nøkkel

```
RAPIDAPI_KEY = 94d8ca287cmsh020d29e3ffb7fd3p16cb7bjsn64a15b813501
```

### 1.2 Resend E-post API-nøkkel

```
RESEND_API_KEY = [Hent fra Resend Dashboard]
```

### 1.3 Cron-hemmelighet (for sikker autentisering)

```
CRON_SECRET = [Generer en tilfeldig streng, f.eks. med `openssl rand -hex 32`]
```

**Hvor du setter miljøvariablene:**
- Gå til Supabase Dashboard → Project Settings → Functions
- Klikk "Environment Variables" og legg til hver variabel

---

## Del 2: Kjør databasemigrasjonen

### 2.1 Åpne Supabase SQL Editor

1. Gå til [Supabase Dashboard](https://app.supabase.com)
2. Velg prosjektet `FlyDeals`
3. Klikk "SQL Editor" i menyen
4. Klikk "New Query"

### 2.2 Kopier og kjør migrasjonen

1. Åpne filen `/migrations/002_price_history_and_deals.sql`
2. Kopier hele innholdet
3. Lim inn i SQL Editor-vinduet
4. Klikk "Run" (eller trykk `Ctrl+Enter`)

### 2.3 Verifiser at migrasjonen var vellykket

Etter kjøring skal du se:
- `price_history`-tabellen opprettet
- `price_history`-indekser opprettet
- `price_statistics`-visning opprettet
- Nye kolonner lagt til `flights`-tabellen: `avg_price`, `price_level`, `typical_price_low`, `typical_price_high`

Hvis du får feil om "already exists", er det OK — migrasjonen er idempotent.

---

## Del 3: Deploy Edge Functions

### 3.1 Installer Supabase CLI

```bash
npm install -g supabase
```

### 3.2 Logg inn på Supabase

```bash
supabase login
```

Denne kommandoen åpner en nettleser for autentisering. Velg prosjektet ditt.

### 3.3 Link lokalt prosjekt (første gang)

```bash
supabase link --project-ref erhlxomyatirrqhaxroh
```

### 3.4 Deploy `fetch-flights` edge function

```bash
supabase functions deploy fetch-flights --no-verify-jwt
```

**Forklaring av flagg:**
- `--no-verify-jwt` — Tillater både JWT og `x-cron-secret` autentisering

### 3.5 Deploy `send-deal-alerts` edge function

```bash
supabase functions deploy send-deal-alerts --no-verify-jwt
```

### 3.6 Verifiser deployment

```bash
supabase functions list
```

Du skal se begge funksjonene listet opp med deres URL-er.

---

## Del 4: Test Edge Functions

### 4.1 Test `fetch-flights` manuelt

```bash
curl -X POST https://erhlxomyatirrqhaxroh.supabase.co/functions/v1/fetch-flights \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: [DIN_CRON_SECRET]" \
  -d '{}'
```

**Forventet respons:**
```json
{
  "success": true,
  "total": 10,
  "updated": 10,
  "deals_found": 2,
  "errors": 0,
  "details": [...]
}
```

### 4.2 Test `send-deal-alerts` manuelt

```bash
curl -X POST https://erhlxomyatirrqhaxroh.supabase.co/functions/v1/send-deal-alerts \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: [DIN_CRON_SECRET]" \
  -d '{}'
```

**Forventet respons:**
```json
{
  "success": true,
  "emails_sent": 3,
  "total_users": 5,
  "details": [...]
}
```

### 4.3 Sjekk Supabase-loggen

1. Gå til Supabase Dashboard → Functions
2. Klikk på `fetch-flights` eller `send-deal-alerts`
3. Klikk "Logs" for å se utdata og feil

---

## Del 5: Sett opp Cron-jobber

### Alternativ A: Supabase pg_cron (anbefalt)

1. Åpne Supabase SQL Editor
2. Kjør denne SQL-kommandoen for å kjøre `fetch-flights` hver dag klokken 06:00:

```sql
-- Opprett extension (kjøres bare en gang)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Planlegg fetch-flights for hver dag klokken 06:00
SELECT cron.schedule(
  'fetch-flights-daily',
  '0 6 * * *',
  $$SELECT http_post(
    'https://erhlxomyatirrqhaxroh.supabase.co/functions/v1/fetch-flights',
    '{}',
    'application/json',
    jsonb_build_object('x-cron-secret', '[DIN_CRON_SECRET]')
  )$$
);

-- Planlegg send-deal-alerts for en time etter (07:00)
SELECT cron.schedule(
  'send-deal-alerts-daily',
  '0 7 * * *',
  $$SELECT http_post(
    'https://erhlxomyatirrqhaxroh.supabase.co/functions/v1/send-deal-alerts',
    '{}',
    'application/json',
    jsonb_build_object('x-cron-secret', '[DIN_CRON_SECRET]')
  )$$
);
```

### Alternativ B: GitHub Actions (ekstern cron)

1. Opprett en ny fil `.github/workflows/flydeal-fetch.yml`:

```yaml
name: Fetch Flights Daily

on:
  schedule:
    - cron: '0 6 * * *'

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch flights
        run: |
          curl -X POST https://erhlxomyatirrqhaxroh.supabase.co/functions/v1/fetch-flights \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```

2. Legg til `CRON_SECRET` som GitHub Secret

3. Push til GitHub — jobben kjøres automatisk

---

## Del 6: Verifiser og overvåk systemet

### 6.1 Kontroller at deals er oppdatert

1. Gå til `deals.html` i nettleseren
2. Logg inn
3. Du skal se deals med:
   - Reelle priser (fra API)
   - "Lavt pris" eller "Høyt pris" badge basert på `price_level`
   - Rabatt % basert på historisk gjennomsnittspris

### 6.2 Kontroller `flights`-tabellen

1. Åpne Supabase Dashboard → Table Editor
2. Velg `flights`-tabellen
3. Verifiser at kolonnene er oppdatert:
   - `avg_price` — Gjennomsnittspris fra historikken
   - `price_level` — "low", "typical" eller "high"
   - `typical_price_low` — Laveste pris i 25%-percentilen
   - `typical_price_high` — Høyeste pris i 75%-percentilen

### 6.3 Sjekk `price_history`-tabellen

1. Velg `price_history`-tabellen
2. Du skal se flere prisdata-punkter for hver rute
3. Eksempel:
   - Dato: 2026-04-15, Pris: 4890 NOK
   - Dato: 2026-04-16, Pris: 4850 NOK
   - osv.

### 6.4 Sjekk e-postforsendelser

1. Åpne Supabase Dashboard → Functions → `send-deal-alerts`
2. Klikk "Logs"
3. Du skal se entries som:
   - `📧 E-post sendt til brukerepost@example.com`

---

## Del 7: Feilsøking

### Problemet: `fetch-flights` returnerer "Unauthorized"

**Årsak:** `x-cron-secret` header mangler eller er feil.

**Løsning:**
1. Verifiser at `CRON_SECRET` er satt i Supabase Dashboard
2. Verifiser at hemmeligheten samsvarer i cron-kallet
3. Prøv med `curl` for å teste manuelt

### Problemet: "RAPIDAPI_KEY" ikke funnet

**Årsak:** Miljøvariabel er ikke satt.

**Løsning:**
1. Gå til Supabase Dashboard → Settings → Functions
2. Legg til `RAPIDAPI_KEY = 94d8ca287cmsh020d29e3ffb7fd3p16cb7bjsn64a15b813501`
3. Deploy Edge Function på nytt

### Problemet: E-poster sendes ikke

**Årsak:** `RESEND_API_KEY` mangler eller `alerts`-tabell har ingen oppføringer.

**Løsning:**
1. Verifiser `RESEND_API_KEY` i Supabase Settings
2. Verifiser at det finnes aktive alerts i `alerts`-tabellen (is_active = true)
3. Sjekk loggen for `send-deal-alerts` funksjonen

### Problemet: Deals vises ikke på frontend

**Årsak:** `flights`-tabellen er tom eller RLS-policyene er feil.

**Løsning:**
1. Kjør `fetch-flights` manuelt for å populere tabellen
2. Verifiser at RLS-policyen "Authenticated users can read flights" eksisterer
3. Logg av og inn på nytt for å oppdatere JWT-token

---

## Del 8: Vedlikehold og skalering

### Utvide antall ruter

1. Åpne `/supabase/functions/fetch-flights/index.ts`
2. Legg til flere ruter i `routes`-arrayet:
   ```typescript
   { from: "KRS", to: "AGP", fromCity: "Kristiansand", toCity: "Málaga", cc: "es" },
   { from: "OSL", to: "LIS", fromCity: "Oslo", toCity: "Lissabon", cc: "pt" },
   ```
3. Deploy på nytt: `supabase functions deploy fetch-flights --no-verify-jwt`

### Endre oppdateringsfrekvens

1. Åpne Supabase SQL Editor
2. Oppdater `cron.schedule()` kommandoen:
   ```sql
   -- Kjør hver 6. time
   SELECT cron.schedule('fetch-flights-daily', '0 */6 * * *', ...);
   ```

### Overvåk API-bruk

1. Gå til RapidAPI Dashboard
2. Sjekk "Usage" for Google Flights API
3. Hver `fetch-flights`-kjøring bruker ~11 API-kall (1 searchFlights + 1 getPriceGraph per rute)

---

## Del 9: Sikkerhet

- **CRON_SECRET:** Oppbevares i `x-cron-secret`-header, ikke i URL
- **RAPIDAPI_KEY:** Lagres som miljøvariabel, aldri hardkodet
- **RESEND_API_KEY:** Lagres som miljøvariabel, aldri eksponeert til frontend
- **RLS-policyer:** Edge Functions bruker `service_role`-nøkkel, brukere kan bare lese

---

## Nyttige kommandoer

```bash
# Vis alle edge functions
supabase functions list

# Vis loggen for en funksjon
supabase functions logs fetch-flights

# Deploy bare en funksjon
supabase functions deploy fetch-flights --no-verify-jwt

# Fjern en funksjon
supabase functions delete fetch-flights

# Kjør en query direkte
supabase db execute "SELECT COUNT(*) FROM flights;"
```

---

## Kontakt og støtte

Hvis du har problemer:

1. Sjekk Supabase-loggen (Dashboard → Functions → Logs)
2. Sjekk RapidAPI-statusen (https://rapidapi.com/status)
3. Sjekk Resend-statusen (https://resend.com/status)
4. Se under "Feilsøking" i Del 7

---

**Sist oppdatert:** 2026-03-19
