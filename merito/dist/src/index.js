"use strict";
/**
 * Main entry point for the heartbeat monitoring system
 * Exports all public interfaces and classes
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
exports.runHeartbeatMonitor = exports.FileService = exports.HeartbeatAnalyzer = exports.EventProcessor = exports.EventValidator = exports.HeartbeatMonitor = void 0;
// Core types
__exportStar(require("./types"), exports);
// Main monitoring class
var HeartbeatMonitor_1 = require("./HeartbeatMonitor");
Object.defineProperty(exports, "HeartbeatMonitor", { enumerable: true, get: function () { return HeartbeatMonitor_1.HeartbeatMonitor; } });
// Individual components (for advanced usage)
var EventValidator_1 = require("./validators/EventValidator");
Object.defineProperty(exports, "EventValidator", { enumerable: true, get: function () { return EventValidator_1.EventValidator; } });
var EventProcessor_1 = require("./processors/EventProcessor");
Object.defineProperty(exports, "EventProcessor", { enumerable: true, get: function () { return EventProcessor_1.EventProcessor; } });
var HeartbeatAnalyzer_1 = require("./analyzers/HeartbeatAnalyzer");
Object.defineProperty(exports, "HeartbeatAnalyzer", { enumerable: true, get: function () { return HeartbeatAnalyzer_1.HeartbeatAnalyzer; } });
var FileService_1 = require("./services/FileService");
Object.defineProperty(exports, "FileService", { enumerable: true, get: function () { return FileService_1.FileService; } });
// Convenience function for simple usage
var runner_1 = require("./utils/runner");
Object.defineProperty(exports, "runHeartbeatMonitor", { enumerable: true, get: function () { return runner_1.runHeartbeatMonitor; } });
//# sourceMappingURL=index.js.map