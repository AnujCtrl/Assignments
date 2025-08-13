import { HeartbeatEvent } from "../types";
/**
 * Validates heartbeat events for proper structure and data integrity
 */
export declare class EventValidator {
    /**
     * Validates and parses a single heartbeat event
     * @param event Raw event object
     * @returns Parsed event or null if invalid
     */
    static validateEvent(event: any): HeartbeatEvent | null;
    /**
     * Validates an array of events and returns valid ones
     * @param rawEvents Array of raw event objects
     * @returns Object containing valid events and count of invalid ones
     */
    static validateEvents(rawEvents: any[]): {
        valid: HeartbeatEvent[];
        invalid: number;
    };
}
//# sourceMappingURL=EventValidator.d.ts.map