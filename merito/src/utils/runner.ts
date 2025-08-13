import { Alert, Config } from "../types";
import { HeartbeatMonitor } from "../HeartbeatMonitor";

/**
 * Convenience function to run heartbeat monitoring with simple parameters
 * @param eventsFile Path to events JSON file
 * @param expectedIntervalSeconds Expected interval between heartbeats (default: 60)
 * @param allowedMisses Number of consecutive misses before alert (default: 3)
 * @returns Array of alerts
 */
export function runHeartbeatMonitor(
  eventsFile: string,
  expectedIntervalSeconds: number = 60,
  allowedMisses: number = 3
): Alert[] {
  const config: Config = {
    expected_interval_seconds: expectedIntervalSeconds,
    allowed_misses: allowedMisses,
  };

  const monitor = new HeartbeatMonitor(config);
  return monitor.analyzeHeartbeats(eventsFile);
}
