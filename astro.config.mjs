// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set PUBLIC_SITE_URL in Vercel (e.g. https://rentthatcounts.co.uk) so canonical
// URLs and the sitemap point at the production domain.
const site = process.env.PUBLIC_SITE_URL ?? 'https://rtc.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Keep CSS in external files so the Content-Security-Policy can stay strict.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    // The investor page is shared privately and carries noindex, so keep it out of the sitemap.
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/investors') }),
  ],
});
