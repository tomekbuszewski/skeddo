import { pushSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { Pool } from "pg";

import type {
  ConstructorParams,
  SeedDatabaseParams,
  SeedParams,
} from "./types";

const PROD = "production";

export class DrizzleClient {
  private readonly client;
  private readonly env: string;
  private readonly pool: Pool;

  constructor({
    dbUrl,
    env = process.env.NODE_ENV || PROD,
  }: ConstructorParams) {
    this.pool = new Pool({
      connectionString: dbUrl,
      allowExitOnIdle: true,
    });

    this.env = env;
    this.client = drizzle(this.pool);
  }

  public getClient() {
    return this.client;
  }

  public async resetSeeds({ seeds }: SeedParams) {
    await reset(this.client, seeds);
  }

  public async seedDatabase({ seeds, config }: SeedDatabaseParams) {
    if (this.env === PROD) {
      throw new Error("Seeding cannot be performed on production");
    }

    const { apply } = await pushSchema(seeds, this.client);
    await apply();
    await seed(this.client, seeds, config);
  }

  public async disconnect() {
    try {
      await this.client.$client.end();
    } catch {
      await this.pool.end();
    }
  }
}
