/**
 * Main entry point for the heartbeat monitoring system
 * Exports all public interfaces and classes
 */

// Core types
export * from "./types";

// Main monitoring class
export { HeartbeatMonitor } from "./HeartbeatMonitor";

// Individual components (for advanced usage)
export { EventValidator } from "./validators/EventValidator";
export { EventProcessor } from "./processors/EventProcessor";
export { HeartbeatAnalyzer } from "./analyzers/HeartbeatAnalyzer";
export { FileService } from "./services/FileService";

// Convenience function for simple usage
export { runHeartbeatMonitor } from "./utils/runner";
