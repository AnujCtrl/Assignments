"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatAnalyzer = void 0;
/**
 * Analyzes heartbeat patterns and detects missed heartbeats
 */
class HeartbeatAnalyzer {
    constructor(config) {
        this.config = config;
    }
    /**
     * Analyzes heartbeats for a single service and detects missed heartbeats
     * @param events Sorted array of events for a service
     * @returns Array of alerts for this service
     */
    analyzeServiceHeartbeats(events) {
        if (events.length === 0) {
            return [];
        }
        const alerts = [];
        const intervalMs = this.config.expected_interval_seconds * 1000;
        // Process each consecutive pair of events to find gaps
        for (let i = 0; i < events.length - 1; i++) {
            const currentEvent = new Date(events[i].timestamp);
            const nextEvent = new Date(events[i + 1].timestamp);
            // Calculate how many heartbeats we expected between current and next event
            const timeDiff = nextEvent.getTime() - currentEvent.getTime();
            const expectedHeartbeats = Math.floor(timeDiff / intervalMs);
            // If we missed heartbeats (gap is larger than allowed misses * interval)
            if (expectedHeartbeats > this.config.allowed_misses) {
                // Alert at the time when the Nth consecutive heartbeat was expected
                const alertTime = new Date(currentEvent.getTime() + this.config.allowed_misses * intervalMs);
                alerts.push({
                    service: events[i].service,
                    alert_at: alertTime.toISOString(),
                });
            }
        }
        return alerts;
    }
    /**
     * Analyzes all services and generates alerts
     * @param serviceEvents Map of service name to events
     * @returns Array of all alerts sorted by alert time
     */
    analyzeAllServices(serviceEvents) {
        const allAlerts = [];
        // Analyze each service for missed heartbeats
        for (const serviceName in serviceEvents) {
            const events = serviceEvents[serviceName];
            const serviceAlerts = this.analyzeServiceHeartbeats(events);
            allAlerts.push(...serviceAlerts);
        }
        // Sort alerts by alert time
        allAlerts.sort((a, b) => new Date(a.alert_at).getTime() - new Date(b.alert_at).getTime());
        return allAlerts;
    }
    /**
     * Updates the configuration
     * @param newConfig New configuration object
     */
    updateConfig(newConfig) {
        this.config = { ...newConfig };
    }
    /**
     * Gets the current configuration
     * @returns Current configuration object
     */
    getConfig() {
        return { ...this.config };
    }
}
exports.HeartbeatAnalyzer = HeartbeatAnalyzer;
//# sourceMappingURL=HeartbeatAnalyzer.js.map