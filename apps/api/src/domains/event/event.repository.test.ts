import { Test } from "@nestjs/testing";
import { vi } from "vitest";
import { seed } from "drizzle-seed";

import { beforeAll } from "vitest";
import { createTestDb } from "@skeddo/testing";
import { EventRepository } from "./event.repository";
import { ConfigModule } from "@nestjs/config";
import { DbService } from "../../db/db.service";
import { eventSchema } from "./event.schema";

describe("domains / event / repository", () => {
  let repository: EventRepository;
  let ids: string[] = [];

  beforeAll(async () => {
    const { connectionUri } = await createTestDb("eventRepository", eventSchema);
    const moduleRef = await Test.createTestingModule({
      providers: [EventRepository, DbService],
      imports: [
        await ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: connectionUri })],
        }),
      ],
    }).compile();

    const db = moduleRef.get<DbService>(DbService);
    repository = moduleRef.get(EventRepository);

    await seed(db.getClient(), { eventSchema }).refine((f) => ({
      eventSchema: {
        count: 20,
        columns: {
          price: f.int({ minValue: 0, maxValue: 100_000 }),
          description: f.loremIpsum(),
        },
      },
    }));

    const data = await db.getClient().select().from(eventSchema);
    data.forEach((item) => {
      ids.push(item.id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createRandomEvent = async (name = "Shaving") =>
    await repository.createEvent({
      name,
      description: "Will just shave you",
      price: 12000,
    });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should allow to fetch event by id", async () => {
    const id = ids[0];
    const result = await repository.getEventById(id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
  });

  it("should throw when item is not found", async () => {
    await expect(repository.getEventById("00000000-0000-0000-0000-000000000000")).rejects.toThrow();
  });

  it("should allow to fetch up to 10 events at once by their ids", async () => {
    const result = await repository.getEventsByIds(ids.slice(0, 10));
    expect(result.length).toBe(10);
  });

  it("should allow to create an event", async () => {
    const result = await createRandomEvent();

    expect(result).toBeDefined();
  });

  it("should create a disabled event by default", async () => {
    const creation = await createRandomEvent();
    const result = await repository.getEventById(creation.id);
    expect(result.enabled).toBeFalsy();
  });

  it("should create event with default created and modified at fields", async () => {
    const creation = await createRandomEvent();
    const result = await repository.getEventById(creation.id);

    expect(result.created_at).toBeGreaterThan(0);
    expect(result.modified_at).toBeGreaterThan(0);
    expect(result.modified_at).toEqual(result.created_at);
  });

  it("should allow to edit event", async () => {
    const creation = await createRandomEvent();
    const result = await repository.editEvent(creation.id, {
      name: "Buzz cut",
    });

    expect(result.name).toBe("Buzz cut");
  });

  it("should change modified data after edit", async () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const creation = await createRandomEvent();

    vi.setSystemTime(new Date("2026-01-01T00:01:00Z"));
    const result = await repository.editEvent(creation.id, {
      name: "Buzz cut",
    });

    expect(result.modifiedAt).toBeGreaterThan(result.createdAt);

    vi.useRealTimers();
  });

  it("should allow to delete hidden events", async () => {
    const creation = await createRandomEvent();
    await repository.deleteEventById(creation.id);

    await expect(repository.getEventById(creation.id)).rejects.toThrow();
  });
});
