# Deploying: GitHub → Vercel, DNS on Cloudflare

Vercel builds and hosts the site. Cloudflare runs DNS for your domain and points it at Vercel.

## 1. Connect the repo to Vercel

1. Sign in at vercel.com and choose **Add New → Project**.
2. Import `gaveesh89/rtc` from GitHub (grant the Vercel GitHub app access to the repo if asked).
3. Vercel detects **Astro**. Leave the defaults; `vercel.json` already sets the build command
   (`npm run build`) and output folder (`dist`).
4. Under **Environment Variables**, add `PUBLIC_SITE_URL` set to your final domain, for example
   `https://rentthatcounts.co.uk` (no trailing slash). Apply it to Production.
5. Click **Deploy**.

From then on:

- every push to `main` deploys to production;
- every pull request gets its own preview URL.

## 2. Add your domain in Vercel

1. In the Vercel project, go to **Settings → Domains**.
2. Add the apex domain (`rentthatcounts.co.uk`) and `www.rentthatcounts.co.uk`.
3. Choose one as primary and let Vercel redirect the other to it.
4. Vercel then shows the DNS records it needs. Keep that page open.

## 3. Point Cloudflare DNS at Vercel

In the Cloudflare dashboard, open your domain → **DNS → Records** and add the records Vercel showed you.
They are typically:

| Type  | Name  | Content                                                | Proxy status |
| ----- | ----- | ------------------------------------------------------ | ------------ |
| A     | `@`   | the IP Vercel shows (often `76.76.21.21`)              | DNS only     |
| CNAME | `www` | the target Vercel shows (often `cname.vercel-dns.com`) | DNS only     |

Always copy the exact values from Vercel's Domains page, because they can differ per project.

**Set Proxy status to "DNS only" (grey cloud).** This is Vercel's recommended setup: Vercel issues
and renews the SSL certificate itself and serves the site from its own edge network. Putting
Cloudflare's proxy in front adds a second CDN, can break certificate renewal, and hides visitor IPs
from Vercel.

Remove any old A, AAAA or CNAME records for `@` and `www` that point elsewhere.

Within a few minutes Vercel's Domains page should show both domains as **Valid Configuration** with
a certificate issued.

### If you do want Cloudflare's proxy (orange cloud)

Only if you need Cloudflare features such as its WAF or bot rules:

1. Cloudflare → **SSL/TLS → Overview**: set encryption mode to **Full (strict)**. Never "Flexible",
   which causes redirect loops.
2. Cloudflare → **Caching**: leave HTML uncached (the default). `vercel.json` already sets long
   cache headers on the hashed files in `/_astro/`.
3. Expect Vercel to warn that the domain is proxied. Certificate renewal may need the record set to
   DNS only briefly.

### Other Cloudflare settings worth turning on

- **SSL/TLS → Edge Certificates → Always Use HTTPS**: on (harmless with DNS only).
- **DNSSEC**: enable it in Cloudflare, then add the DS record at your domain registrar.
- If you send email from the domain, add SPF, DKIM and DMARC records. Vercel does not need them.

## 4. Check the live site

- `https://<domain>/`, `/landlords` and `/investors` load; `/anything-else` shows the 404 page.
- `https://<domain>/robots.txt` and `/sitemap-index.xml` show your domain, not `rtc.vercel.app`.
  If they don't, `PUBLIC_SITE_URL` was not set when the site was built: set it and redeploy.
- Run the domain through securityheaders.com: it should score A or higher.
- `/#landlords` redirects to `/landlords`.

## Rolling back

Vercel → **Deployments** → pick an earlier deployment → **Promote to Production**.
