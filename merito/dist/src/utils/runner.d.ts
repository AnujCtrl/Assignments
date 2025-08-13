import { Alert } from "../types";
/**
 * Convenience function to run heartbeat monitoring with simple parameters
 * @param eventsFile Path to events JSON file
 * @param expectedIntervalSeconds Expected interval between heartbeats (default: 60)
 * @param allowedMisses Number of consecutive misses before alert (default: 3)
 * @returns Array of alerts
 */
export declare function runHeartbeatMonitor(eventsFile: string, expectedIntervalSeconds?: number, allowedMisses?: number): Alert[];
//# sourceMappingURL=runner.d.ts.map