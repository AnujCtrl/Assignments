import { HeartbeatEvent, ServiceEventMap } from "../types";
import { EventValidator } from "../validators/EventValidator";

/**
 * Processes and organizes heartbeat events by service
 */
export class EventProcessor {
  /**
   * Groups valid events by service and sorts them chronologically
   * @param rawEvents Array of raw event objects
   * @returns Map of service name to sorted valid events
   */
  static processEvents(rawEvents: any[]): ServiceEventMap {
    const serviceEvents: ServiceEventMap = {};

    // Validate events first
    const { valid: validEvents } = EventValidator.validateEvents(rawEvents);

    // Group events by service
    for (const event of validEvents) {
      if (!serviceEvents[event.service]) {
        serviceEvents[event.service] = [];
      }
      serviceEvents[event.service].push(event);
    }

    // Sort events by timestamp for each service
    for (const serviceName in serviceEvents) {
      serviceEvents[serviceName].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    return serviceEvents;
  }

  /**
   * Gets all unique service names from events
   * @param serviceEvents Map of service events
   * @returns Array of service names
   */
  static getServiceNames(serviceEvents: ServiceEventMap): string[] {
    return Object.keys(serviceEvents);
  }

  /**
   * Gets events for a specific service
   * @param serviceEvents Map of service events
   * @param serviceName Name of the service
   * @returns Array of events for the service, or empty array if not found
   */
  static getEventsForService(
    serviceEvents: ServiceEventMap,
    serviceName: string
  ): HeartbeatEvent[] {
    return serviceEvents[serviceName] || [];
  }
}
