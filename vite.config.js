import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/* Resolves the public site URL (env > Vercel's production URL > placeholder), then injects it
   into index.html (canonical + Open Graph need absolute URLs) and emits sitemap.xml / robots.txt
   so the "[YOUR_DOMAIN]" placeholders of the old project can never ship again. */
function seo(siteUrl) {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n` });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (env.VITE_SITE_URL || (vercel ? `https://${vercel}` : 'https://example.com')).replace(/\/$/, '');
  if (mode === 'production' && siteUrl === 'https://example.com') {
    console.warn('\n[seo] VITE_SITE_URL is not set: canonical, Open Graph and sitemap will point at example.com.\n');
  }
  return {
    plugins: [react(), seo(siteUrl)],
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          // Long-lived vendor chunks cache across deploys; app code splits per lazy section.
          manualChunks: { react: ['react', 'react-dom'] }
        }
      }
    }
  };
});
