import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { DbService } from "../../db/db.service";

@Module({
  providers: [EventService, DbService],
  controllers: [EventController],
})
export class EventModule {}
