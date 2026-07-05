import {
  getDatabase,
  databaseId,
  metricsCollectionId,
  ID,
  Query,
} from "../server/appwrite.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { searchTerm, movie } = request.body || {};

  if (!searchTerm || !movie?.id) {
    return response.status(400).json({ error: "searchTerm and movie are required" });
  }

  try {
    if (!metricsCollectionId) {
      throw new Error("Missing Appwrite env vars: APPWRITE_METRICS_ID");
    }

    const database = getDatabase();
    const result = await database.listDocuments({
      databaseId,
      collectionId: metricsCollectionId,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument({
        databaseId,
        collectionId: metricsCollectionId,
        documentId: doc.$id,
        data: { count: doc.count + 1 },
      });
    } else {
      await database.createDocument({
        databaseId,
        collectionId: metricsCollectionId,
        documentId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
