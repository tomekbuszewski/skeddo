import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { DrizzleClient } from "./client";

describe("packages / db", () => {
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:17").start();
  });

  afterEach(async () => {
    await container.exec([
      "psql",
      "-U",
      container.getUsername(),
      "-d",
      container.getDatabase(),
      "-c",
      "DROP SCHEMA public CASCADE; CREATE SCHEMA public;",
    ]);
  });

  it("should prepare client", async () => {
    const client = new DrizzleClient({
      dbUrl: `postgres://${container.getHost()}}`,
    });

    expect(client.getClient()).toBeDefined();
  });

  it("should disconnect", async () => {
    const client = new DrizzleClient({
      dbUrl: container.getConnectionUri(),
    });

    expect(client.getClient().$client.ended).toBeFalsy();

    await client.disconnect();

    expect(client.getClient().$client.ended).toBeTruthy();
  });
});
