import axios from 'axios';
import * as cheerio from 'cheerio';
import snapshot from './cene.json' with { type: 'json' };

// cargopedia blocks the default axios user agent (HTTP 520)
const UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// Vercel's filesystem is read-only, so nothing here writes to disk at request
// time — that write is what made /api/fuel-prices return null. The scrape is
// held in module memory instead, and cene.json ships as the fallback.
// Refresh the snapshot with `npm run scrape`.
const TTL_OK = 6 * 60 * 60 * 1000;
const TTL_FAIL = 10 * 60 * 1000; // a bad scrape shouldn't retry on every request
let memo = null;

export async function scrapeFuelPrices() {
    const response = await axios.get('https://www.cargopedia.net/europe-fuel-prices', {
        headers: { 'User-Agent': UA },
        timeout: 10000
    });
    const $ = cheerio.load(response.data);

    const countries = [];
    $('table tbody tr').each((i, el) => {
        const tds = $(el).find('td');
        const name = $(tds[0]).text().replace(/ /g, ' ').trim();
        const code = ($(tds[0]).find('img').attr('src') || '').match(/flags\/24\/([A-Z]+)\.png/)?.[1];
        const benzin = parseFloat($(tds[1]).text());
        const dizel = parseFloat($(tds[2]).text());
        if (code && name && isFinite(benzin) && isFinite(dizel)) {
            countries.push({ code, name, benzin, dizel });
        }
    });
    if (!countries.length) throw new Error('cargopedia returned no usable rows');

    return { countries, date: new Date().toISOString().split('T')[0] };
}

export async function getFuelPrices() {
    if (memo && Date.now() < memo.until) return memo.data;
    try {
        memo = { until: Date.now() + TTL_OK, data: await scrapeFuelPrices() };
    } catch (error) {
        console.error('fuel price scrape failed, serving snapshot:', error.message);
        memo = { until: Date.now() + TTL_FAIL, data: snapshot };
    }
    return memo.data;
}
