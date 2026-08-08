// Refreshes the cene.json fallback snapshot. Run with `npm run scrape`.
// The server never writes this file — Vercel's filesystem is read-only.
import { writeFileSync } from 'fs';
import { scrapeFuelPrices } from './scrape.js';

const data = await scrapeFuelPrices();
writeFileSync(new URL('./cene.json', import.meta.url), JSON.stringify(data, null, 2));
console.log(`cene.json updated — ${data.countries.length} countries, ${data.date}`);
