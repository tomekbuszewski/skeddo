import { randomUUID } from "node:crypto";
import { Client } from "pg";

export async function createTestDb(serviceName?: string) {
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
