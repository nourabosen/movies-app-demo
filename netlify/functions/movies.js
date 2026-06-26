const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.query;
  const apiKey = process.env.TMDB_API_KEY;
  const apiBaseUrl = "https://api.themoviedb.org/3";

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TMDB_API_KEY is not configured on the server" }),
    };
  }

  try {
    const endpoint = query 
      ? `${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}` 
      : `${apiBaseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;

    const response = await fetch(endpoint);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch movies from TMDB" }),
    };
  }
};
