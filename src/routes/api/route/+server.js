import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// GET /api/route?stops=Beograd|place_id:ChIJ123|Zagreb
//   200 {"km":372.4,"legs":3,"polyline":"…","points":[[lat,lng],…]}
//   400 {"error":"Could not find: Novi Sadd","stop":1}
//
// No KV, no Redis: a road's length never changes, so the response is immutable
// and s-maxage hands the caching to the CDN — the origin sees each distinct
// route once. Add a real store only when something needs to read those rows
// back out (joining HERE toll data onto them, say).

export async function GET({ url, setHeaders }) {
    const stops = (url.searchParams.get('stops') ?? '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);

    if (stops.length < 2) {
        return json({ error: 'Need at least two stops' }, { status: 400 });
    }

    const api = new URL('https://maps.googleapis.com/maps/api/directions/json');
    api.searchParams.set('origin', stops[0]);
    api.searchParams.set('destination', stops[stops.length - 1]);
    if (stops.length > 2) api.searchParams.set('waypoints', stops.slice(1, -1).join('|'));
    api.searchParams.set('language', 'sr-Latn');
    api.searchParams.set('key', env.VITE_GOOGLE_MAPS_API_KEY);

    let data;
    try {
        data = await (await fetch(api)).json();
    } catch (error) {
        console.error('directions request failed:', error.message);
        return json({ error: 'Route service unavailable' }, { status: 502 });
    }

    if (data.status === 'NOT_FOUND') {
        const stop = await firstUngeocodable(stops);
        return json({ error: `Could not find: ${stops[stop]}`, stop }, { status: 400 });
    }
    if (data.status === 'ZERO_RESULTS') {
        return json({ error: 'No driving route between these stops' }, { status: 400 });
    }
    if (data.status !== 'OK') {
        console.error('directions returned', data.status, data.error_message ?? '');
        return json({ error: data.error_message ?? data.status }, { status: 502 });
    }

    const legs = data.routes[0].legs;
    setHeaders({ 'cache-control': 'public, max-age=3600, s-maxage=31536000, immutable' });

    return json({
        km: legs.reduce((m, l) => m + l.distance.value, 0) / 1000,
        legs: legs.length,
        polyline: data.routes[0].overview_polyline.points,
        // one point per stop, so the app can mark each one on its route preview
        points: [
            [legs[0].start_location.lat, legs[0].start_location.lng],
            ...legs.map((l) => [l.end_location.lat, l.end_location.lng])
        ]
    });
}

// Directions says NOT_FOUND without saying which stop. Only runs on the error
// path, so the extra geocode calls cost nothing in normal use.
async function firstUngeocodable(stops) {
    for (const [i, s] of stops.entries()) {
        if (s.startsWith('place_id:')) continue; // a picked place always resolves
        const u = new URL('https://maps.googleapis.com/maps/api/geocode/json');
        u.searchParams.set('address', s);
        u.searchParams.set('key', env.VITE_GOOGLE_MAPS_API_KEY);
        try {
            const g = await (await fetch(u)).json();
            if (g.status !== 'OK') return i;
        } catch {
            return i;
        }
    }
    return 0;
}
