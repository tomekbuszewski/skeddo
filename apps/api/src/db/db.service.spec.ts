import { type TestingModule } from "@nestjs/testing";
import { DbService } from "./db.service";
import { createTestingModule } from "@skeddo/testing";
import { ConfigModule } from "@nestjs/config";

describe("DbService", () => {
  let service: DbService;
  let module: TestingModule;
  let cleanup: () => Promise<void>;
  let connectionUri = "not the value you want";

  beforeAll(async () => {
    const testing = await createTestingModule<DbService>(DbService, (uri: string) => ({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: uri })],
        }),
      ],
    }));

    service = testing.service;
    module = testing.module;
    cleanup = testing.cleanup;
    connectionUri = testing.uri;
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
