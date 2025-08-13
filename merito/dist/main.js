"use strict";
/**
 * Main entry point for the heartbeat monitoring system CLI
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHeartbeatMonitor = exports.HeartbeatMonitor = void 0;
const runner_1 = require("./src/utils/runner");
// Re-export main components for backward compatibility
var HeartbeatMonitor_1 = require("./src/HeartbeatMonitor");
Object.defineProperty(exports, "HeartbeatMonitor", { enumerable: true, get: function () { return HeartbeatMonitor_1.HeartbeatMonitor; } });
var runner_2 = require("./src/utils/runner");
Object.defineProperty(exports, "runHeartbeatMonitor", { enumerable: true, get: function () { return runner_2.runHeartbeatMonitor; } });
__exportStar(require("./src/types"), exports);
// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("Usage: npm run start <events_file> [interval_seconds] [allowed_misses]");
        console.log("Example: npm run start events.json 60 3");
        process.exit(1);
    }
    const eventsFile = args[0];
    const intervalSeconds = args[1] ? parseInt(args[1]) : 60;
    const allowedMisses = args[2] ? parseInt(args[2]) : 3;
    try {
        const alerts = (0, runner_1.runHeartbeatMonitor)(eventsFile, intervalSeconds, allowedMisses);
        console.log("Alerts generated:");
        console.log(JSON.stringify(alerts, null, 2));
    }
    catch (error) {
        console.error("Failed to run heartbeat monitor:", error);
        process.exit(1);
    }
}
//# sourceMappingURL=main.js.map