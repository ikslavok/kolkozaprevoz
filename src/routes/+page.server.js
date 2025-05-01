import { env } from '$env/dynamic/private';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const CENE_FILE = join(process.cwd(), 'src/lib/scraped/cene.json');

async function scrapeFuelPrices() {
    try {
        const response = await axios.get('https://www.cargopedia.net/europe-fuel-prices');
        const $ = cheerio.load(response.data);
        
        const benzin = $('table tbody tr:nth-child(34) td:nth-child(2)').text().trim();
        const dizel = $('table tbody tr:nth-child(34) td:nth-child(3)').text().trim();
        
        const data = {
            benzin: parseFloat(benzin),
            dizel: parseFloat(dizel),
            date: new Date().toISOString().split('T')[0]
        };
        
        writeFileSync(CENE_FILE, JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error scraping fuel prices:', error);
        return null;
    }
}

export async function load() {
    let ceneData;
    try {
        ceneData = JSON.parse(readFileSync(CENE_FILE, 'utf-8'));
        const today = new Date().toISOString().split('T')[0];
        
        if (ceneData.date !== today) {
            ceneData = await scrapeFuelPrices();
        }
    } catch (error) {
        ceneData = await scrapeFuelPrices();
    }

    return {
        googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
        ceneData
    };
} 