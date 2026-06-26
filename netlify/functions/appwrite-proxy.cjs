const { Client, Databases, ID, Query } = require('appwrite');

const requiredEnvVars = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_METRICS_ID',
    'APPWRITE_FAV_ID',
];

const jsonResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

const getConfig = () => {
    const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing Appwrite environment variables: ${missingEnvVars.join(', ')}`);
    }

    return {
        endpoint: process.env.APPWRITE_ENDPOINT,
        projectId: process.env.APPWRITE_PROJECT_ID,
        databaseId: process.env.APPWRITE_DATABASE_ID,
        metricsId: process.env.APPWRITE_METRICS_ID,
        favId: process.env.APPWRITE_FAV_ID,
    };
};

const getDatabase = ({ endpoint, projectId }) => {
    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    if (process.env.APPWRITE_API_KEY) {
        client.setKey(process.env.APPWRITE_API_KEY);
    }

    return new Databases(client);
};

const readRequestBody = (event) => {
    if (!event.body) {
        return {};
    }

    const body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;

    return JSON.parse(body);
};

const getTrendingMovies = async (database, config) => {
    const result = await database.listDocuments(config.databaseId, config.metricsId, [
        Query.limit(5),
        Query.orderDesc('count'),
    ]);

    return result.documents;
};

const getFavMovies = async (database, config) => {
    const result = await database.listDocuments(config.databaseId, config.favId, [
        Query.limit(5),
        Query.orderAsc('order'),
    ]);

    return result.documents;
};

const updateSearchCount = async (database, config, searchTerm, movie) => {
    if (!searchTerm || !movie?.id) {
        return;
    }

    const result = await database.listDocuments(config.databaseId, config.metricsId, [
        Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
        const doc = result.documents[0];

        await database.updateDocument(config.databaseId, config.metricsId, doc.$id, {
            count: doc.count + 1,
        });

        return;
    }

    await database.createDocument(config.databaseId, config.metricsId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    });
};

exports.handler = async (event) => {
    try {
        const config = getConfig();
        const database = getDatabase(config);

        if (event.httpMethod === 'GET') {
            const action = event.queryStringParameters?.action;

            if (action === 'trending') {
                return jsonResponse(200, await getTrendingMovies(database, config));
            }

            if (action === 'favourites') {
                return jsonResponse(200, await getFavMovies(database, config));
            }
        }

        if (event.httpMethod === 'POST') {
            const { action, searchTerm, movie } = readRequestBody(event);

            if (action === 'update-search-count') {
                await updateSearchCount(database, config, searchTerm, movie);

                return jsonResponse(200, { ok: true });
            }
        }

        return jsonResponse(400, { error: 'Unsupported Appwrite proxy request' });
    } catch (error) {
        console.error(error);

        return jsonResponse(500, { error: 'Appwrite proxy request failed' });
    }
};
