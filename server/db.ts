import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a postgres connection
const queryClient = postgres(process.env.DATABASE_URL!);

// Initialize Drizzle with our schema
export const db = drizzle(queryClient, { schema });

// Export a db type for use with infer helper types
export type DB = typeof db;