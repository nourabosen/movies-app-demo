export const updateSearchCount = async (searchTerm, movie) => {
    try {
        await fetch('/api/search-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm, movie }),
        });
    } catch (error) {
        console.log(error)
    }
}


export const getTrendingMovies = async () => {
    try {
        const response = await fetch('/api/trending');
        if (!response.ok) return [];

        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.log(error)
        return [];
    }
}


export const getFavMovies = async () => {
    try {
        const response = await fetch('/api/favorites');
        if (!response.ok) return [];

        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.log(error)
        return [];
    }
}