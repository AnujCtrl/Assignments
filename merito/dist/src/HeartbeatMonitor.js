"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatMonitor = void 0;
const EventProcessor_1 = require("./processors/EventProcessor");
const HeartbeatAnalyzer_1 = require("./analyzers/HeartbeatAnalyzer");
const FileService_1 = require("./services/FileService");
/**
 * Main heartbeat monitoring class that orchestrates the monitoring process
 */
class HeartbeatMonitor {
    constructor(config) {
        this.analyzer = new HeartbeatAnalyzer_1.HeartbeatAnalyzer(config);
    }
    /**
     * Main method to analyze heartbeat events and generate alerts
     * @param eventsFile Path to the JSON file containing events
     * @returns Array of alerts
     */
    analyzeHeartbeats(eventsFile) {
        try {
            // Read and parse events file
            const rawEvents = FileService_1.FileService.readEventsFile(eventsFile);
            // Process and validate events
            const serviceEvents = EventProcessor_1.EventProcessor.processEvents(rawEvents);
            // Analyze each service for missed heartbeats
            const alerts = this.analyzer.analyzeAllServices(serviceEvents);
            return alerts;
        }
        catch (error) {
            console.error("Error analyzing heartbeats:", error);
            throw error;
        }
    }
    /**
     * Updates the monitoring configuration
     * @param config New configuration
     */
    updateConfig(config) {
        this.analyzer.updateConfig(config);
    }
    /**
     * Gets the current configuration
     * @returns Current configuration
     */
    getConfig() {
        return this.analyzer.getConfig();
    }
    /**
     * Analyzes events from raw data (useful for testing)
     * @param rawEvents Array of raw event objects
     * @returns Array of alerts
     */
    analyzeRawEvents(rawEvents) {
        try {
            // Process and validate events
            const serviceEvents = EventProcessor_1.EventProcessor.processEvents(rawEvents);
            // Analyze each service for missed heartbeats
            const alerts = this.analyzer.analyzeAllServices(serviceEvents);
            return alerts;
        }
        catch (error) {
            console.error("Error analyzing raw events:", error);
            throw error;
        }
    }
}
exports.HeartbeatMonitor = HeartbeatMonitor;
//# sourceMappingURL=HeartbeatMonitor.js.map