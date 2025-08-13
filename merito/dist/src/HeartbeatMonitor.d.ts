import { Alert, Config } from "./types";
/**
 * Main heartbeat monitoring class that orchestrates the monitoring process
 */
export declare class HeartbeatMonitor {
    private analyzer;
    constructor(config: Config);
    /**
     * Main method to analyze heartbeat events and generate alerts
     * @param eventsFile Path to the JSON file containing events
     * @returns Array of alerts
     */
    analyzeHeartbeats(eventsFile: string): Alert[];
    /**
     * Updates the monitoring configuration
     * @param config New configuration
     */
    updateConfig(config: Config): void;
    /**
     * Gets the current configuration
     * @returns Current configuration
     */
    getConfig(): Config;
    /**
     * Analyzes events from raw data (useful for testing)
     * @param rawEvents Array of raw event objects
     * @returns Array of alerts
     */
    analyzeRawEvents(rawEvents: any[]): Alert[];
}
//# sourceMappingURL=HeartbeatMonitor.d.ts.map