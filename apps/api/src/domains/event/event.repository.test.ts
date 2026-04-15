import { TestingModule } from "@nestjs/testing";

import { beforeAll } from "vitest";
import { EventRepository } from "./event.repository";
import { createTestingModule } from "@skeddo/testing";

describe("domains / event / repository", () => {
  let repository: EventRepository;
  let module: TestingModule;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    const testing = await createTestingModule<EventRepository>(EventRepository);
    repository = testing.service;
    module = testing.module;
    cleanup = testing.cleanup;
  });

  afterAll(async () => {
    await module.close();
    await cleanup();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});
