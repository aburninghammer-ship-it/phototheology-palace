/**
 * Build-time sitemap generator.
 * Run: node scripts/generate-sitemap.js
 * Called automatically via the "build" script in package.json.
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://phototheologybible.com";
const today = new Date().toISOString().split("T")[0];

const routes = [
  // Core pages
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/palace", changefreq: "weekly", priority: 0.9 },
  { path: "/bible", changefreq: "weekly", priority: 0.9 },

  // Marketing & info
  { path: "/pricing", changefreq: "monthly", priority: 0.8 },
  { path: "/why-phototheology", changefreq: "monthly", priority: 0.8 },
  { path: "/comparison", changefreq: "monthly", priority: 0.8 },
  { path: "/app-tour", changefreq: "monthly", priority: 0.7 },
  { path: "/interactive-demo", changefreq: "monthly", priority: 0.7 },
  { path: "/paths", changefreq: "monthly", priority: 0.7 },

  // Tools & features
  { path: "/phototheologygpt", changefreq: "weekly", priority: 0.7 },
  { path: "/games", changefreq: "weekly", priority: 0.7 },
  { path: "/daily-challenges", changefreq: "daily", priority: 0.7 },
  { path: "/genesis-challenge", changefreq: "monthly", priority: 0.6 },

  // Community & support
  { path: "/community", changefreq: "daily", priority: 0.6 },
  { path: "/donate", changefreq: "monthly", priority: 0.5 },
  { path: "/guesthouse", changefreq: "weekly", priority: 0.6 },

  // Auth & sales
  { path: "/auth", changefreq: "monthly", priority: 0.5 },
  { path: "/quick-start", changefreq: "monthly", priority: 0.6 },
  { path: "/study-suite", changefreq: "monthly", priority: 0.6 },
  { path: "/bible-prophecy-guide", changefreq: "monthly", priority: 0.6 },

  // Legal
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
];

function generateSitemap() {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const sitemap = generateSitemap();
const outPath = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`Sitemap generated with ${routes.length} URLs -> public/sitemap.xml`);
