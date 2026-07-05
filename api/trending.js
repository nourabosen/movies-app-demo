import {
  getDatabase,
  databaseId,
  metricsCollectionId,
  Query,
} from "../server/appwrite.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!metricsCollectionId) {
      throw new Error("Missing Appwrite env vars: APPWRITE_METRICS_ID");
    }

    const database = getDatabase();
    const result = await database.listDocuments({
      databaseId,
      collectionId: metricsCollectionId,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    return response.status(200).json({ documents: result.documents });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
