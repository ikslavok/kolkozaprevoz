import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// GET /api/places?q=Novi&session=<token>
//   200 {"suggestions":[{"id":"ChIJ…","main":"Novi Sad","secondary":"Vojvodina, Serbia"}]}
//
// The session token matters for billing: Google charges a whole typing burst as
// one autocomplete session when every request in it carries the same token, and
// the client mints a new one each time a suggestion is taken.

export async function GET({ url, setHeaders }) {
    const q = (url.searchParams.get('q') ?? '').trim();
    const session = url.searchParams.get('session') ?? '';

    // the app already withholds shorter queries; belt and braces against a
    // hand-rolled request burning autocomplete calls on a single letter
    if (q.length < 3) return json({ suggestions: [] });

    const api = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    api.searchParams.set('input', q);
    api.searchParams.set('types', 'geocode');
    api.searchParams.set('language', 'sr-Latn');
    if (session) api.searchParams.set('sessiontoken', session);
    api.searchParams.set('key', env.VITE_GOOGLE_MAPS_API_KEY);

    let data;
    try {
        data = await (await fetch(api)).json();
    } catch (error) {
        console.error('places request failed:', error.message);
        return json({ error: 'Places service unavailable' }, { status: 502 });
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('places returned', data.status, data.error_message ?? '');
        return json({ error: data.error_message ?? data.status }, { status: 502 });
    }

    setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300' });

    return json({
        suggestions: (data.predictions ?? []).slice(0, 5).map((p) => ({
            id: p.place_id,
            main: p.structured_formatting.main_text,
            secondary: p.structured_formatting.secondary_text ?? ''
        }))
    });
}
