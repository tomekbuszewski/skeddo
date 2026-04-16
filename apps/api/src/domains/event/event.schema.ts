import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const defaultFields = {
  created_at: timestamp("createdAt").defaultNow(),
  modified_at: timestamp("modifiedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
};

export const eventSchema = pgTable(
  "events",
  {
    name: varchar().notNull(),
    description: text().notNull(),
    price: integer().notNull(),
    enabled: boolean().default(false).notNull(),
    ...defaultFields,
  },
  (table) => [index("name_idx").on(table.name)],
);

export type NewEventDto = typeof eventSchema.$inferInsert;
export type UpdateEventDto = Partial<NewEventDto>;
export type EventDto = typeof eventSchema.$inferSelect;
