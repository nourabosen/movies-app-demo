const APPWRITE_PROXY_URL = '/.netlify/functions/appwrite-proxy';

const requestAppwriteProxy = async (params, options = {}) => {
    const response = await fetch(`${APPWRITE_PROXY_URL}${params}`, options);

    if (!response.ok) {
        throw new Error(`Appwrite proxy request failed with status ${response.status}`);
    }

    return response.json();
}

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        await requestAppwriteProxy('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update-search-count',
                searchTerm,
                movie,
            }),
        });
    } catch (error) {
        console.log(error)
    }
}


export const getTrendingMovies = async () => {
    try {
        return await requestAppwriteProxy('?action=trending');
    } catch (error) {
        console.log(error)
        return [];
    }
}


export const getFavMovies = async () => {
    try {
        return await requestAppwriteProxy('?action=favourites');
    } catch (error) {
        console.log(error)
        return [];
    }
}