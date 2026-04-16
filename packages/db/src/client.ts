import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import type { ConstructorParams } from "./types";

export class DrizzleClient {
  private readonly client: NodePgDatabase & { $client: Pool };
  private readonly pool: Pool;

  constructor({ dbUrl }: ConstructorParams) {
    this.pool = new Pool({
      connectionString: dbUrl,
      allowExitOnIdle: true,
    });

    this.client = drizzle(this.pool);
  }

  public getClient() {
    return this.client;
  }

  public async disconnect() {
    try {
      await (this.client.$client as Pool).end();
    } catch {
      await this.pool.end();
    }
  }
}
