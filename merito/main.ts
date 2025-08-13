/**
 * Main entry point for the heartbeat monitoring system CLI
 */

import { runHeartbeatMonitor } from "./src/utils/runner";

// Re-export main components for backward compatibility
export { HeartbeatMonitor } from "./src/HeartbeatMonitor";
export { runHeartbeatMonitor } from "./src/utils/runner";
export * from "./src/types";

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(
      "Usage: npm run start <events_file> [interval_seconds] [allowed_misses]"
    );
    console.log("Example: npm run start events.json 60 3");
    process.exit(1);
  }

  const eventsFile = args[0];
  const intervalSeconds = args[1] ? parseInt(args[1]) : 60;
  const allowedMisses = args[2] ? parseInt(args[2]) : 3;

  try {
    const alerts = runHeartbeatMonitor(
      eventsFile,
      intervalSeconds,
      allowedMisses
    );
    console.log("Alerts generated:");
    console.log(JSON.stringify(alerts, null, 2));
  } catch (error) {
    console.error("Failed to run heartbeat monitor:", error);
    process.exit(1);
  }
}
