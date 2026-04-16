import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { pushSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgTable } from "drizzle-orm/pg-core";

export async function createTestDb(serviceName?: string, schema?: PgTable) {
  const dbName = `test_${serviceName ?? randomUUID().replace(/-/g, "")}`;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(`CREATE DATABASE "${dbName}"`);
  await client.end();

  const baseUrl = new URL(process.env.DATABASE_URL!);
  baseUrl.pathname = `/${dbName}`;
  const connectionUri = baseUrl.toString();

  if (schema) {
    const db = drizzle(connectionUri);
    const { apply } = await pushSchema({ schema }, db);
    await apply();
    await db.$client.end();
  }

  return {
    connectionUri,
    dbName,
    async cleanup() {
      const adminClient = new Client({
        connectionString: process.env.DATABASE_URL,
      });
      await adminClient.connect();
      await adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);
      await adminClient.end();
    },
  };
}
