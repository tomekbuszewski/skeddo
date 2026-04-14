import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DrizzleClient } from "@skeddo/db";

@Injectable()
export class DbService {
  private client: DrizzleClient;

  constructor(private configService: ConfigService) {
    const dbUrl = this.configService.getOrThrow<string>("DATABASE_URL");
    this.client = new DrizzleClient({ dbUrl });
  }

  public getClient() {
    return this.client.getClient();
  }

  public getDatabaseUrl() {
    return this.configService.getOrThrow("DATABASE_URL");
  }
}
