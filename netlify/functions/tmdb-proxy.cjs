const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const jsonResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const tmdbKey = process.env.TMDB_API_KEY || process.env.TMDB_ACCESS_TOKEN;

    if (!tmdbKey) {
        return jsonResponse(500, { error: 'TMDB API key is not configured' });
    }

    const query = event.queryStringParameters?.q?.trim() || '';
    const url = new URL(query ? `${TMDB_BASE_URL}/search/movie` : `${TMDB_BASE_URL}/discover/movie`);

    if (query) {
        url.searchParams.set('query', query);
    } else {
        url.searchParams.set('sort_by', 'popularity.desc');
    }

    const usesBearerToken = tmdbKey.startsWith('eyJ') || tmdbKey.split('.').length === 3;

    if (!usesBearerToken) {
        url.searchParams.set('api_key', tmdbKey);
    }

    const response = await fetch(url, {
        headers: {
            accept: 'application/json',
            ...(usesBearerToken ? { Authorization: `Bearer ${tmdbKey}` } : {}),
        },
    });
    const body = await response.text();

    return {
        statusCode: response.status,
        headers: {
            'Content-Type': response.headers.get('content-type') || 'application/json',
        },
        body,
    };
};
