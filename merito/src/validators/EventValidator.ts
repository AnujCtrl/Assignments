import { HeartbeatEvent } from "../types";

/**
 * Validates heartbeat events for proper structure and data integrity
 */
export class EventValidator {
  /**
   * Validates and parses a single heartbeat event
   * @param event Raw event object
   * @returns Parsed event or null if invalid
   */
  static validateEvent(event: any): HeartbeatEvent | null {
    // Check required fields
    if (!event.service || typeof event.service !== "string") {
      return null;
    }

    if (!event.timestamp || typeof event.timestamp !== "string") {
      return null;
    }

    // Validate timestamp format
    try {
      const date = new Date(event.timestamp);
      if (isNaN(date.getTime())) {
        return null;
      }
    } catch {
      return null;
    }

    return {
      service: event.service,
      timestamp: event.timestamp,
    };
  }

  /**
   * Validates an array of events and returns valid ones
   * @param rawEvents Array of raw event objects
   * @returns Object containing valid events and count of invalid ones
   */
  static validateEvents(rawEvents: any[]): {
    valid: HeartbeatEvent[];
    invalid: number;
  } {
    const validEvents: HeartbeatEvent[] = [];
    let invalidCount = 0;

    for (const rawEvent of rawEvents) {
      const validEvent = EventValidator.validateEvent(rawEvent);
      if (validEvent) {
        validEvents.push(validEvent);
      } else {
        invalidCount++;
      }
    }

    return {
      valid: validEvents,
      invalid: invalidCount,
    };
  }
}
