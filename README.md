# Rent that counts

Marketing site for **Rent that counts**, a rent-to-own scheme: 10% of the rent a tenant pays is recorded
as credit that comes off the price if they buy the home they rent.

Three guides, one per audience:

| Path         | Audience           | Indexed by search engines |
| ------------ | ------------------ | ------------------------- |
| `/`          | Renters            | Yes                       |
| `/landlords` | Landlords          | Yes                       |
| `/investors` | Investors (shared) | No (`noindex`)            |

Old links to the single-page version (`/#landlords`, `/#investors`) redirect to the matching page.

## Stack

- [Astro](https://astro.build) static site, TypeScript strict mode
- Self-hosted fonts via Fontsource (no third-party requests, so no cookie banner needed for fonts)
- Vitest for unit tests, Prettier for formatting, `astro check` for type checking
- Deployed on Vercel, DNS on Cloudflare (see [DEPLOY.md](DEPLOY.md))

## Getting started

Requires Node 22.12 or later (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Local dev server with hot reload                 |
| `npm run build`   | Type-check, then build static files into `dist/` |
| `npm run preview` | Serve the built `dist/` locally                  |
| `npm test`        | Unit tests                                       |
| `npm run format`  | Format all files                                 |
| `npm run ci`      | Everything CI runs: format check, tests, build   |

## Project layout

```
src/
  layouts/Base.astro        page shell: head/meta, audience nav, footer
  pages/                    one file per route (index, landlords, investors, 404, robots.txt)
  components/               Beat, Steps, IfThen, Ledger, Faq, Stats, CreditCalculator
  lib/credit.ts             credit rules (10%, 5-year cap) and £ formatting
  styles/global.css         design tokens (light and dark) and shared styles
tests/                      unit tests
vercel.json                 security headers, caching, clean URLs
```

### Changing the scheme's numbers

The credit rate, cap and calculator limits live in `src/lib/credit.ts`. Change them there and update
`tests/credit.test.ts`. Copy that mentions figures (for example "10%" or "five years") is written in
the page files, so search for it there too.

## Configuration

| Variable          | Where                   | Purpose                                             |
| ----------------- | ----------------------- | --------------------------------------------------- |
| `PUBLIC_SITE_URL` | Vercel project env vars | Production URL for canonical links, sitemap, robots |

See `.env.example`.

## Known issue

`npm audit` reports a high-severity ReDoS advisory in `picomatch` (GHSA-fc5q-39xc-vjpf), pulled in by
Astro, Vite and Vitest. There is no patched release yet. It affects build-time glob matching only and
does not ship in the static site. Dependabot will raise a PR when a fix lands.
