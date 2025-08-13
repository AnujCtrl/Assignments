"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventProcessor = void 0;
const EventValidator_1 = require("../validators/EventValidator");
/**
 * Processes and organizes heartbeat events by service
 */
class EventProcessor {
    /**
     * Groups valid events by service and sorts them chronologically
     * @param rawEvents Array of raw event objects
     * @returns Map of service name to sorted valid events
     */
    static processEvents(rawEvents) {
        const serviceEvents = {};
        // Validate events first
        const { valid: validEvents } = EventValidator_1.EventValidator.validateEvents(rawEvents);
        // Group events by service
        for (const event of validEvents) {
            if (!serviceEvents[event.service]) {
                serviceEvents[event.service] = [];
            }
            serviceEvents[event.service].push(event);
        }
        // Sort events by timestamp for each service
        for (const serviceName in serviceEvents) {
            serviceEvents[serviceName].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
        return serviceEvents;
    }
    /**
     * Gets all unique service names from events
     * @param serviceEvents Map of service events
     * @returns Array of service names
     */
    static getServiceNames(serviceEvents) {
        return Object.keys(serviceEvents);
    }
    /**
     * Gets events for a specific service
     * @param serviceEvents Map of service events
     * @param serviceName Name of the service
     * @returns Array of events for the service, or empty array if not found
     */
    static getEventsForService(serviceEvents, serviceName) {
        return serviceEvents[serviceName] || [];
    }
}
exports.EventProcessor = EventProcessor;
//# sourceMappingURL=EventProcessor.js.map