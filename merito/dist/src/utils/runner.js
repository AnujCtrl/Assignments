"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHeartbeatMonitor = runHeartbeatMonitor;
const HeartbeatMonitor_1 = require("../HeartbeatMonitor");
/**
 * Convenience function to run heartbeat monitoring with simple parameters
 * @param eventsFile Path to events JSON file
 * @param expectedIntervalSeconds Expected interval between heartbeats (default: 60)
 * @param allowedMisses Number of consecutive misses before alert (default: 3)
 * @returns Array of alerts
 */
function runHeartbeatMonitor(eventsFile, expectedIntervalSeconds = 60, allowedMisses = 3) {
    const config = {
        expected_interval_seconds: expectedIntervalSeconds,
        allowed_misses: allowedMisses,
    };
    const monitor = new HeartbeatMonitor_1.HeartbeatMonitor(config);
    return monitor.analyzeHeartbeats(eventsFile);
}
//# sourceMappingURL=runner.js.map