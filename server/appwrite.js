import { Client, Databases, ID, Query } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

export const databaseId = process.env.APPWRITE_DATABASE_ID;
export const metricsCollectionId = process.env.APPWRITE_METRICS_ID;
export const favoritesCollectionId = process.env.APPWRITE_FAVORITES_ID || "favourites";
export { ID, Query };

export function getDatabase() {
  const missingVars = [];

  if (!projectId) missingVars.push("APPWRITE_PROJECT_ID");
  if (!apiKey) missingVars.push("APPWRITE_API_KEY");
  if (!databaseId) missingVars.push("APPWRITE_DATABASE_ID");

  if (missingVars.length > 0) {
    throw new Error(`Missing Appwrite env vars: ${missingVars.join(", ")}`);
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new Databases(client);
}
