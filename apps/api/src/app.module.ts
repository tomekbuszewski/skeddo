import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { EventModule } from './domains/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local.local", ".env.local"],
      isGlobal: true,
    }),
    DbModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
