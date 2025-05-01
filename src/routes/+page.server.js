import { env } from '$env/dynamic/private';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeFuelPrices() {
    try {
        const response = await axios.get('https://www.cargopedia.net/europe-fuel-prices', {
            timeout: 10000 // 10 second timeout
        });
        const $ = cheerio.load(response.data);
        
        const benzin = $('table tbody tr:nth-child(34) td:nth-child(2)').text().trim();
        const dizel = $('table tbody tr:nth-child(34) td:nth-child(3)').text().trim();
        
        return {
            benzin: parseFloat(benzin),
            dizel: parseFloat(dizel),
            date: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error scraping fuel prices:', error);
        return {
            benzin: 0,
            dizel: 0,
            date: new Date().toISOString().split('T')[0],
            error: true
        };
    }
}

export async function load() {
    try {
        const ceneData = await scrapeFuelPrices();
        
        return {
            googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
            ceneData
        };
    } catch (error) {
        console.error('Error in load function:', error);
        return {
            googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
            ceneData: {
                benzin: 0,
                dizel: 0,
                date: new Date().toISOString().split('T')[0],
                error: true
            }
        };
    }
} 