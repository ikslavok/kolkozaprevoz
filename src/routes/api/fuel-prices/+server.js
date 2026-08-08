import { json } from '@sveltejs/kit';
import { getFuelPrices } from '$lib/scraped/scrape.js';

export async function GET({ setHeaders }) {
    // prices move at most once a day; let the CDN absorb the traffic
    setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=3600' });
    return json(await getFuelPrices());
}
