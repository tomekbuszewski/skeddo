import { Injectable } from "@nestjs/common";
import { DbService } from "../../db/db.service";
import { type EventDto, eventSchema, type NewEventDto } from "./event.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class EventRepository {
  constructor(private readonly db: DbService) {}

  public async createEvent(payload: NewEventDto): Promise<EventDto> {
    const [event] = await this.db.getClient().insert(eventSchema).values(payload).returning();
    return event;
  }

  public async getEventById(id: string): Promise<EventDto> {
    const [event] = await this.db
      .getClient()
      .select()
      .from(eventSchema)
      .where(eq(eventSchema.id, id));

    if (!event) {
      throw new Error("Not found");
    }

    return event;
  }
}
