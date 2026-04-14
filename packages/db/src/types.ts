import type { PgTable } from "drizzle-orm/pg-core";

export interface ConstructorParams {
  dbUrl: string;
  env?: string;
}

export interface SeedParams {
  seeds: { [key: string]: PgTable };
}

export interface SeedDatabaseParams extends SeedParams {
  config?: { count?: number; seed?: number };
}
