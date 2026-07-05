import { Client, Databases, ID, Query } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID;

export const databaseId = process.env.APPWRITE_DATABASE_ID;
export const metricsCollectionId = process.env.APPWRITE_METRICS_ID;
export const favoritesCollectionId = process.env.APPWRITE_FAV_ID || "favourites";
export { ID, Query };

export function getDatabase() {
  const missingVars = [];

  if (!projectId) missingVars.push("APPWRITE_PROJECT_ID");
  if (!databaseId) missingVars.push("APPWRITE_DATABASE_ID");

  if (missingVars.length > 0) {
    throw new Error(`Missing Appwrite env vars: ${missingVars.join(", ")}`);
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  return new Databases(client);
}
