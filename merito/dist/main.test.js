"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const main_1 = require("./main");
describe("HeartbeatMonitor", () => {
    let tempDir;
    beforeEach(() => {
        // Create a temporary directory for test files
        tempDir = fs.mkdtempSync(path.join(__dirname, "test-"));
    });
    afterEach(() => {
        // Clean up temporary files
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
    const createTestFile = (events) => {
        const filePath = path.join(tempDir, "test-events.json");
        fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
        return filePath;
    };
    describe("Working Alert Case", () => {
        test("should generate alert when service misses 3 consecutive heartbeats", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" }, // Start
                { service: "email", timestamp: "2025-08-04T10:01:00Z" }, // +1min
                { service: "email", timestamp: "2025-08-04T10:02:00Z" }, // +2min
                // Missing at 10:03:00, 10:04:00, 10:05:00 - should alert at 10:05:00
                { service: "email", timestamp: "2025-08-04T10:06:00Z" }, // +6min (after gap)
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            expect(alerts).toHaveLength(1);
            expect(alerts[0]).toEqual({
                service: "email",
                alert_at: "2025-08-04T10:05:00.000Z",
            });
        });
        test("should generate multiple alerts for multiple services", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "sms", timestamp: "2025-08-04T10:00:00Z" },
                // Email missing at 10:01, 10:02, 10:03 - alert at 10:03
                { service: "email", timestamp: "2025-08-04T10:04:00Z" },
                // SMS missing at 10:01, 10:02, 10:03 - alert at 10:03
                { service: "sms", timestamp: "2025-08-04T10:04:00Z" },
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            expect(alerts).toHaveLength(2);
            expect(alerts.find((a) => a.service === "email")).toBeDefined();
            expect(alerts.find((a) => a.service === "sms")).toBeDefined();
        });
    });
    describe("Near-Miss Case", () => {
        test("should NOT generate alert when service misses only 2 consecutive heartbeats", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" }, // Start
                { service: "email", timestamp: "2025-08-04T10:01:00Z" }, // +1min
                // Missing at 10:02:00, 10:03:00 (only 2 misses)
                { service: "email", timestamp: "2025-08-04T10:04:00Z" }, // Back on track
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            expect(alerts).toHaveLength(0);
        });
        test("should NOT generate alert with exactly 2 misses then recovery", () => {
            const events = [
                { service: "push", timestamp: "2025-08-04T10:00:00Z" },
                { service: "push", timestamp: "2025-08-04T10:01:00Z" },
                { service: "push", timestamp: "2025-08-04T10:02:00Z" },
                // Missing at 10:03, 10:04 (2 misses)
                { service: "push", timestamp: "2025-08-04T10:05:00Z" }, // Recovery
                { service: "push", timestamp: "2025-08-04T10:06:00Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            expect(alerts).toHaveLength(0);
        });
    });
    describe("Unordered Input Handling", () => {
        test("should handle events that arrive out of chronological order", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:06:00Z" }, // Out of order
                { service: "email", timestamp: "2025-08-04T10:00:00Z" }, // Start
                { service: "email", timestamp: "2025-08-04T10:02:00Z" }, // Out of order
                { service: "email", timestamp: "2025-08-04T10:01:00Z" }, // Out of order
                // Should detect missing at 10:03, 10:04, 10:05 after sorting
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            expect(alerts).toHaveLength(1);
            expect(alerts[0].service).toBe("email");
            expect(alerts[0].alert_at).toBe("2025-08-04T10:05:00.000Z");
        });
        test("should correctly sort multiple services with unordered events", () => {
            const events = [
                { service: "sms", timestamp: "2025-08-04T10:02:00Z" },
                { service: "email", timestamp: "2025-08-04T10:01:00Z" },
                { service: "sms", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email", timestamp: "2025-08-04T10:02:00Z" },
                { service: "sms", timestamp: "2025-08-04T10:01:00Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            // Should be no alerts as all services have proper heartbeats
            expect(alerts).toHaveLength(0);
        });
    });
    describe("Malformed Event Handling", () => {
        test("should gracefully skip events with missing service field", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { timestamp: "2025-08-04T10:01:00Z" }, // Missing service
                { service: "email", timestamp: "2025-08-04T10:02:00Z" },
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            // Should not crash and should process valid events
            expect(alerts).toHaveLength(0);
        });
        test("should gracefully skip events with missing timestamp field", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email" }, // Missing timestamp
                { service: "email", timestamp: "2025-08-04T10:02:00Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            expect(alerts).toHaveLength(0);
        });
        test("should gracefully skip events with invalid timestamp format", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email", timestamp: "not-a-real-timestamp" }, // Invalid timestamp
                { service: "email", timestamp: "2025-08-04T10:01:00Z" },
                { service: "email", timestamp: "invalid-date-format" }, // Invalid timestamp
                { service: "email", timestamp: "2025-08-04T10:02:00Z" },
            ];
            const testFile = createTestFile(events);
            const config = {
                expected_interval_seconds: 60,
                allowed_misses: 3,
            };
            const monitor = new main_1.HeartbeatMonitor(config);
            const alerts = monitor.analyzeHeartbeats(testFile);
            // Should process only valid events (10:00, 10:01, 10:02) - no gaps
            expect(alerts).toHaveLength(0);
        });
        test("should handle mix of valid and malformed events correctly", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email" }, // Missing timestamp
                { timestamp: "2025-08-04T10:01:00Z" }, // Missing service
                { service: "email", timestamp: "invalid-timestamp" }, // Invalid timestamp
                { service: "email", timestamp: "2025-08-04T10:01:00Z" },
                // Missing heartbeats at 10:02, 10:03, 10:04 - should alert
                { service: "email", timestamp: "2025-08-04T10:05:00Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            expect(alerts).toHaveLength(1);
            expect(alerts[0].service).toBe("email");
        });
    });
    describe("Edge Cases", () => {
        test("should handle empty events array", () => {
            const events = [];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            expect(alerts).toHaveLength(0);
        });
        test("should handle single event", () => {
            const events = [{ service: "email", timestamp: "2025-08-04T10:00:00Z" }];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 3);
            expect(alerts).toHaveLength(0);
        });
        test("should handle different interval configurations", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                { service: "email", timestamp: "2025-08-04T10:00:30Z" },
                // Missing at 10:01:00, 10:01:30, 10:02:00 with 30-second intervals
                { service: "email", timestamp: "2025-08-04T10:02:30Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 30, 3); // 30-second interval
            expect(alerts).toHaveLength(1);
        });
        test("should handle different allowed_misses configurations", () => {
            const events = [
                { service: "email", timestamp: "2025-08-04T10:00:00Z" },
                // Missing at 10:01:00, 10:02:00 - should alert with allowed_misses=2
                { service: "email", timestamp: "2025-08-04T10:03:00Z" },
            ];
            const testFile = createTestFile(events);
            const alerts = (0, main_1.runHeartbeatMonitor)(testFile, 60, 2); // Allow only 2 misses
            expect(alerts).toHaveLength(1);
        });
    });
    describe("Integration Tests", () => {
        test("should process the provided events.json file correctly", () => {
            // Test with actual events.json file if it exists
            const eventsJsonPath = path.join(__dirname, "events.json");
            if (fs.existsSync(eventsJsonPath)) {
                const alerts = (0, main_1.runHeartbeatMonitor)(eventsJsonPath, 60, 3);
                // Should return array of alerts (specific assertions depend on actual data)
                expect(Array.isArray(alerts)).toBe(true);
                alerts.forEach((alert) => {
                    expect(alert).toHaveProperty("service");
                    expect(alert).toHaveProperty("alert_at");
                    expect(typeof alert.service).toBe("string");
                    expect(typeof alert.alert_at).toBe("string");
                    // Verify timestamp format
                    expect(new Date(alert.alert_at).toISOString()).toBe(alert.alert_at);
                });
            }
        });
    });
});
//# sourceMappingURL=main.test.js.map