import { HeartbeatEvent, Alert, Config } from "../types";
/**
 * Analyzes heartbeat patterns and detects missed heartbeats
 */
export declare class HeartbeatAnalyzer {
    private config;
    constructor(config: Config);
    /**
     * Analyzes heartbeats for a single service and detects missed heartbeats
     * @param events Sorted array of events for a service
     * @returns Array of alerts for this service
     */
    analyzeServiceHeartbeats(events: HeartbeatEvent[]): Alert[];
    /**
     * Analyzes all services and generates alerts
     * @param serviceEvents Map of service name to events
     * @returns Array of all alerts sorted by alert time
     */
    analyzeAllServices(serviceEvents: {
        [key: string]: HeartbeatEvent[];
    }): Alert[];
    /**
     * Updates the configuration
     * @param newConfig New configuration object
     */
    updateConfig(newConfig: Config): void;
    /**
     * Gets the current configuration
     * @returns Current configuration object
     */
    getConfig(): Config;
}
//# sourceMappingURL=HeartbeatAnalyzer.d.ts.map