const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://aigameboy.replit.app';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/games', priority: 0.9, changefreq: 'daily' },
  { url: '/leaderboard', priority: 0.8, changefreq: 'weekly' },
  { url: '/create', priority: 0.7, changefreq: 'weekly' },
  { url: '/about', priority: 0.5, changefreq: 'monthly' }
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
