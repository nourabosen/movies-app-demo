exports.handler = async (event) => {
  // Use the native global fetch available in Node 18+
  const query = event.queryStringParameters?.query;
  
  // Changed to match your requirement: using VITE_ prefix
  const apiKey = process.env.VITE_TMDB_API_KEY; 
  const apiBaseUrl = "https://api.themoviedb.org/3";

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "VITE_TMDB_API_KEY is not configured on the server" }),
    };
  }

  try {
    const endpoint = query 
      ? `${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}` 
      : `${apiBaseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `TMDB API responded with status ${response.status}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};
