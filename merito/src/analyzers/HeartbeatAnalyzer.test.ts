import { HeartbeatAnalyzer } from "./HeartbeatAnalyzer";
import { Config, HeartbeatEvent } from "../types";

describe("HeartbeatAnalyzer", () => {
  let analyzer: HeartbeatAnalyzer;
  let config: Config;

  beforeEach(() => {
    config = {
      expected_interval_seconds: 60,
      allowed_misses: 3,
    };
    analyzer = new HeartbeatAnalyzer(config);
  });

  describe("analyzeServiceHeartbeats", () => {
    test("should detect missed heartbeats and generate alert", () => {
      const events: HeartbeatEvent[] = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "email", timestamp: "2025-08-04T10:01:00Z" },
        { service: "email", timestamp: "2025-08-04T10:02:00Z" },
        // Missing 3 heartbeats at 10:03, 10:04, 10:05
        { service: "email", timestamp: "2025-08-04T10:06:00Z" },
      ];

      const alerts = analyzer.analyzeServiceHeartbeats(events);

      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toEqual({
        service: "email",
        alert_at: "2025-08-04T10:05:00.000Z",
      });
    });

    test("should not generate alert for acceptable gaps", () => {
      const events: HeartbeatEvent[] = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "email", timestamp: "2025-08-04T10:01:00Z" },
        // Missing 2 heartbeats (within allowed_misses=3)
        { service: "email", timestamp: "2025-08-04T10:04:00Z" },
      ];

      const alerts = analyzer.analyzeServiceHeartbeats(events);

      expect(alerts).toHaveLength(0);
    });

    test("should handle empty events array", () => {
      const events: HeartbeatEvent[] = [];

      const alerts = analyzer.analyzeServiceHeartbeats(events);

      expect(alerts).toHaveLength(0);
    });

    test("should handle single event", () => {
      const events: HeartbeatEvent[] = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
      ];

      const alerts = analyzer.analyzeServiceHeartbeats(events);

      expect(alerts).toHaveLength(0);
    });

    test("should work with different interval configurations", () => {
      const customConfig: Config = {
        expected_interval_seconds: 30,
        allowed_misses: 2,
      };
      const customAnalyzer = new HeartbeatAnalyzer(customConfig);

      const events: HeartbeatEvent[] = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "email", timestamp: "2025-08-04T10:00:30Z" },
        // Missing 2 heartbeats at 10:01:00, 10:01:30 with 30s interval
        { service: "email", timestamp: "2025-08-04T10:02:00Z" },
      ];

      const alerts = customAnalyzer.analyzeServiceHeartbeats(events);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].alert_at).toBe("2025-08-04T10:01:30.000Z");
    });
  });

  describe("analyzeAllServices", () => {
    test("should analyze multiple services", () => {
      const serviceEvents = {
        email: [
          { service: "email", timestamp: "2025-08-04T10:00:00Z" },
          { service: "email", timestamp: "2025-08-04T10:05:00Z" }, // Gap of 4 minutes
        ],
        sms: [
          { service: "sms", timestamp: "2025-08-04T10:00:00Z" },
          { service: "sms", timestamp: "2025-08-04T10:02:00Z" }, // Gap of 1 minute (OK)
        ],
      };

      const alerts = analyzer.analyzeAllServices(serviceEvents);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].service).toBe("email");
    });

    test("should sort alerts by time", () => {
      const serviceEvents = {
        sms: [
          { service: "sms", timestamp: "2025-08-04T10:02:00Z" },
          { service: "sms", timestamp: "2025-08-04T10:08:00Z" }, // Alert at 10:05:00
        ],
        email: [
          { service: "email", timestamp: "2025-08-04T10:00:00Z" },
          { service: "email", timestamp: "2025-08-04T10:06:00Z" }, // Alert at 10:03:00
        ],
      };

      const alerts = analyzer.analyzeAllServices(serviceEvents);

      expect(alerts).toHaveLength(2);
      expect(alerts[0].service).toBe("email"); // Earlier alert
      expect(alerts[1].service).toBe("sms"); // Later alert
    });
  });

  describe("configuration management", () => {
    test("should update configuration", () => {
      const newConfig: Config = {
        expected_interval_seconds: 30,
        allowed_misses: 2,
      };

      analyzer.updateConfig(newConfig);

      expect(analyzer.getConfig()).toEqual(newConfig);
    });

    test("should return current configuration", () => {
      const currentConfig = analyzer.getConfig();

      expect(currentConfig).toEqual(config);
    });

    test("should not affect original config when returning copy", () => {
      const returnedConfig = analyzer.getConfig();
      returnedConfig.allowed_misses = 999;

      expect(analyzer.getConfig().allowed_misses).toBe(3);
    });
  });
});
