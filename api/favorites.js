import {
  getDatabase,
  databaseId,
  favoritesCollectionId,
  Query,
} from "../server/appwrite.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const database = getDatabase();
    const result = await database.listDocuments({
      databaseId,
      collectionId: favoritesCollectionId,
      queries: [Query.limit(5), Query.orderAsc("order")],
    });

    return response.status(200).json({ documents: result.documents });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
