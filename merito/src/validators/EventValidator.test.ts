import { EventValidator } from "./EventValidator";

describe("EventValidator", () => {
  describe("validateEvent", () => {
    test("should validate a proper event", () => {
      const event = {
        service: "email",
        timestamp: "2025-08-04T10:00:00Z",
      };

      const result = EventValidator.validateEvent(event);

      expect(result).toEqual({
        service: "email",
        timestamp: "2025-08-04T10:00:00Z",
      });
    });

    test("should return null for event missing service", () => {
      const event = {
        timestamp: "2025-08-04T10:00:00Z",
      };

      const result = EventValidator.validateEvent(event);

      expect(result).toBeNull();
    });

    test("should return null for event missing timestamp", () => {
      const event = {
        service: "email",
      };

      const result = EventValidator.validateEvent(event);

      expect(result).toBeNull();
    });

    test("should return null for invalid timestamp format", () => {
      const event = {
        service: "email",
        timestamp: "invalid-timestamp",
      };

      const result = EventValidator.validateEvent(event);

      expect(result).toBeNull();
    });

    test("should return null for non-string service", () => {
      const event = {
        service: 123,
        timestamp: "2025-08-04T10:00:00Z",
      };

      const result = EventValidator.validateEvent(event);

      expect(result).toBeNull();
    });
  });

  describe("validateEvents", () => {
    test("should validate multiple events", () => {
      const events = [
        { service: "email", timestamp: "2025-08-04T10:00:00Z" },
        { service: "sms", timestamp: "2025-08-04T10:01:00Z" },
        { service: "email" }, // Invalid
        { timestamp: "2025-08-04T10:02:00Z" }, // Invalid
        { service: "push", timestamp: "invalid" }, // Invalid
      ];

      const result = EventValidator.validateEvents(events);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toBe(3);
      expect(result.valid[0]).toEqual({
        service: "email",
        timestamp: "2025-08-04T10:00:00Z",
      });
      expect(result.valid[1]).toEqual({
        service: "sms",
        timestamp: "2025-08-04T10:01:00Z",
      });
    });

    test("should handle empty array", () => {
      const events: any[] = [];

      const result = EventValidator.validateEvents(events);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toBe(0);
    });
  });
});
