import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";

import { createTestDb } from "../../test/create-test-db";
import { DbService } from "./db.service";

describe("DbService", () => {
  let service: DbService;
  let module: TestingModule;
  let cleanup: () => Promise<void>;
  let connectionUri;

  beforeAll(async () => {
    const testDb = await createTestDb(DbService.name);
    cleanup = testDb.cleanup;
    connectionUri = testDb.connectionUri;

    module = await Test.createTestingModule({
      providers: [DbService],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: connectionUri })],
        }),
      ],
    }).compile();

    service = module.get<DbService>(DbService);
  });

  afterAll(async () => {
    await module.close();
    await cleanup();
  });

  it("should be defined", () => {
    expect(service.getClient()).toBeDefined();
  });

  it("should properly use mocked database", () => {
    expect(service.getDatabaseUrl()).toEqual(connectionUri);
  });
});
