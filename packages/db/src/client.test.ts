import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { DrizzleClient } from "./client";

describe("packages / db", () => {
  let container: StartedPostgreSqlContainer;

  const users = pgTable("users", {
    id: integer().primaryKey(),
    name: text().notNull(),
  });

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

  it("should properly seed database", async () => {
    const client = new DrizzleClient({
      dbUrl: container.getConnectionUri(),
    });

    await client.seedDatabase({ seeds: { users } });

    const cli = client.getClient();
    expect(cli.select().from(users)).toBeDefined();
  });

  it("should throw on production seeding", async () => {
    const client = new DrizzleClient({
      dbUrl: container.getConnectionUri(),
      env: "production",
    });

    await expect(client.seedDatabase({ seeds: { users } })).rejects.toThrow();
  });

  it("should reset the seeds", async () => {
    const client = new DrizzleClient({
      dbUrl: container.getConnectionUri(),
    });

    await client.seedDatabase({ seeds: { users } });

    const result = await client.getClient().select().from(users);
    expect(result.length).toBe(10);

    await client.resetSeeds({ seeds: { users } });
    const cleanResult = await client.getClient().select().from(users);
    expect(cleanResult.length).toBe(0);
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
