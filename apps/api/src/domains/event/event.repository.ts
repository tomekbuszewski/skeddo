import { Injectable } from "@nestjs/common";
import { DbService } from "../../db/db.service";
import { type EventDto, eventSchema, type NewEventDto, UpdateEventDto } from "./event.schema";
import { eq, inArray } from "drizzle-orm";

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

  public async getEventsById(ids: string[]): Promise<EventDto[]> {
    return await this.db.getClient().select().from(eventSchema).where(inArray(eventSchema.id, ids));
  }

  public async editEventById(id: string, payload: UpdateEventDto): Promise<EventDto> {
    const [event] = await this.db
      .getClient()
      .update(eventSchema)
      .set(payload)
      .where(eq(eventSchema.id, id))
      .returning();

    if (!event) {
      throw new Error("Not found");
    }

    return event;
  }

  public async deleteEventById(id: string) {
    try {
      await this.db.getClient().delete(eventSchema).where(eq(eventSchema.id, id));
    } catch {
      throw new Error("Not found");
    }
  }
}
