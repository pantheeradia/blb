import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Use Turso only if URL is a Turso remote URL AND auth token is present; otherwise fall back to local SQLite
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const isTursoUrl = tursoUrl?.startsWith("libsql://");
const useTurso = isTursoUrl && tursoAuthToken;

const client = createClient({
  url: useTurso ? tursoUrl ?? "file:./local.db" : "file:./local.db",
  authToken: useTurso ? tursoAuthToken : undefined,
});

export const db = drizzle(client, { schema });
