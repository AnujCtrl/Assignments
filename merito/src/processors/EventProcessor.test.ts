import { EventProcessor } from "./EventProcessor";

describe("EventProcessor", () => {
  describe("processEvents", () => {
    test("should group and sort events by service", () => {
      const rawEvents = [
        { service: "email", timestamp: "2025-08-04T10:02:00Z" },
        { service: "sms", timestamp: "2025-08-04T10:01:00Z" },
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "sms", timestamp: "2025-08-04T10:00:00Z" },
      ];

      const result = EventProcessor.processEvents(rawEvents);

      expect(result["email"]).toHaveLength(2);
      expect(result["sms"]).toHaveLength(2);

      // Check sorting
      expect(result["email"][0].timestamp).toBe("2025-08-04T10:00:00Z");
      expect(result["email"][1].timestamp).toBe("2025-08-04T10:02:00Z");

      expect(result["sms"][0].timestamp).toBe("2025-08-04T10:00:00Z");
      expect(result["sms"][1].timestamp).toBe("2025-08-04T10:01:00Z");
    });

    test("should filter out invalid events", () => {
      const rawEvents = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "email" }, // Invalid
        { timestamp: "2025-08-04T10:01:00Z" }, // Invalid
        { service: "email", timestamp: "2025-08-04T10:02:00Z" },
      ];

      const result = EventProcessor.processEvents(rawEvents);

      expect(result["email"]).toHaveLength(2);
      expect(result["email"][0].timestamp).toBe("2025-08-04T10:00:00Z");
      expect(result["email"][1].timestamp).toBe("2025-08-04T10:02:00Z");
    });

    test("should handle empty events", () => {
      const rawEvents: any[] = [];

      const result = EventProcessor.processEvents(rawEvents);

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe("getServiceNames", () => {
    test("should return all service names", () => {
      const serviceEvents = {
        email: [{ service: "email", timestamp: "2025-08-04T10:00:00Z" }],
        sms: [{ service: "sms", timestamp: "2025-08-04T10:00:00Z" }],
        push: [{ service: "push", timestamp: "2025-08-04T10:00:00Z" }],
      };

      const result = EventProcessor.getServiceNames(serviceEvents);

      expect(result).toHaveLength(3);
      expect(result).toContain("email");
      expect(result).toContain("sms");
      expect(result).toContain("push");
    });
  });

  describe("getEventsForService", () => {
    test("should return events for specified service", () => {
      const serviceEvents = {
        email: [
          { service: "email", timestamp: "2025-08-04T10:00:00Z" },
          { service: "email", timestamp: "2025-08-04T10:01:00Z" },
        ],
        sms: [{ service: "sms", timestamp: "2025-08-04T10:00:00Z" }],
      };

      const result = EventProcessor.getEventsForService(serviceEvents, "email");

      expect(result).toHaveLength(2);
      expect(result[0].service).toBe("email");
    });

    test("should return empty array for non-existent service", () => {
      const serviceEvents = {
        email: [{ service: "email", timestamp: "2025-08-04T10:00:00Z" }],
      };

      const result = EventProcessor.getEventsForService(
        serviceEvents,
        "nonexistent"
      );

      expect(result).toHaveLength(0);
    });
  });
});
