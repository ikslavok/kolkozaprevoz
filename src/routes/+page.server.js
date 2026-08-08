import { env } from '$env/dynamic/private';
import { getFuelPrices } from '$lib/scraped/scrape.js';

export async function load() {
    return {
        googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
        // never throws — falls back to the shipped snapshot if the scrape fails
        ceneData: await getFuelPrices()
    };
}
