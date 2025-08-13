import { HeartbeatEvent, ServiceEventMap } from "../types";
/**
 * Processes and organizes heartbeat events by service
 */
export declare class EventProcessor {
    /**
     * Groups valid events by service and sorts them chronologically
     * @param rawEvents Array of raw event objects
     * @returns Map of service name to sorted valid events
     */
    static processEvents(rawEvents: any[]): ServiceEventMap;
    /**
     * Gets all unique service names from events
     * @param serviceEvents Map of service events
     * @returns Array of service names
     */
    static getServiceNames(serviceEvents: ServiceEventMap): string[];
    /**
     * Gets events for a specific service
     * @param serviceEvents Map of service events
     * @param serviceName Name of the service
     * @returns Array of events for the service, or empty array if not found
     */
    static getEventsForService(serviceEvents: ServiceEventMap, serviceName: string): HeartbeatEvent[];
}
//# sourceMappingURL=EventProcessor.d.ts.map