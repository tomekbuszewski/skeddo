import type { ModuleMetadata, Provider } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { createTestDb } from "./create-test-db";

interface CreateTestingModule<T> {
  service: T;
  module: TestingModule;
}

interface CreateTestingModuleWithDb<T> extends CreateTestingModule<T> {
  uri: string;
  cleanup: () => Promise<void>;
}

export async function createTestingModule<T>(
  baseService: Provider & { name: string },
  metadata?: ModuleMetadata | ((uri: string) => ModuleMetadata),
  withDb?: true,
): Promise<CreateTestingModuleWithDb<T>>;
export async function createTestingModule<T>(
  baseService: Provider & { name: string },
  metadata: ModuleMetadata,
  withDb: false,
): Promise<CreateTestingModule<T>>;
export async function createTestingModule<T>(
  baseService: Provider & { name: string },
  metadata: ModuleMetadata | ((uri: string) => ModuleMetadata) = {},
  withDb = true,
): Promise<CreateTestingModule<T> | CreateTestingModuleWithDb<T>> {
  let resolvedMetadata: ModuleMetadata;
  let db: { connectionUri: string; cleanup: () => Promise<void> } | undefined;

  if (withDb) {
    db = await createTestDb(baseService.name);
    resolvedMetadata = typeof metadata === "function" ? metadata(db.connectionUri) : metadata;
  } else {
    resolvedMetadata = metadata as ModuleMetadata;
  }

  const module = await Test.createTestingModule({
    providers: [baseService],
    ...resolvedMetadata,
  }).compile();

  const service = module.get(baseService as Function) as T;

  if (!withDb || !db) {
    return { service, module };
  }

  return { service, module, cleanup: db.cleanup, uri: db.connectionUri };
}
