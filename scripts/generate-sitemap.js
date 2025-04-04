import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://aigameboy.replit.app';
const OUTPUT_FILE = path.join(__dirname, '../client/public/sitemap.xml');

// Define all site pages with their priorities and change frequencies
const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/games', priority: 0.9, changefreq: 'daily' },
  { url: '/models', priority: 0.9, changefreq: 'weekly' },
  { url: '/leaderboard', priority: 0.8, changefreq: 'weekly' },
  { url: '/about', priority: 0.7, changefreq: 'monthly' },
  { url: '/privacy', priority: 0.5, changefreq: 'monthly' },
  { url: '/terms', priority: 0.5, changefreq: 'monthly' }
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${SITE_URL}${page.url}</loc>
      <priority>${page.priority}</priority>
      <changefreq>${page.changefreq}</changefreq>
    </url>
  `).join('')}
</urlset>`;

  fs.writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`Sitemap generated at ${OUTPUT_FILE}`);
};

generateSitemap();
