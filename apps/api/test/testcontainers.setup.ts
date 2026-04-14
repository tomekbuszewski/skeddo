import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";

export default async function setup() {
  const container = await new PostgreSqlContainer("postgres:17").start();
  const connectionUri = container.getConnectionUri();

  process.env.DATABASE_URL = connectionUri;

  return async () => {
    const client = new Client({ connectionString: connectionUri });
    await client.connect();

    const { rows } = await client.query(
      `SELECT datname FROM pg_database WHERE datistemplate = false AND datname != current_database()`,
    );

    for (const row of rows) {
      await client.query(`DROP DATABASE IF EXISTS "${row.datname}"`);
    }

    await client.end();
    await container.stop();
  };
}
