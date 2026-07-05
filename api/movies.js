const API_BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(request, response) {
  const { query } = request.query;
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error: "VITE_TMDB_API_KEY is not configured on the server",
    });
  }

  try {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;

    const tmdbResponse = await fetch(endpoint);

    if (!tmdbResponse.ok) {
      return response.status(tmdbResponse.status).json({
        error: `TMDB API responded with status ${tmdbResponse.status}`,
      });
    }

    const data = await tmdbResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      error: `Server error: ${error.message}`,
    });
  }
}
