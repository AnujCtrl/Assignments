import { Alert, Config } from "./types";
import { EventProcessor } from "./processors/EventProcessor";
import { HeartbeatAnalyzer } from "./analyzers/HeartbeatAnalyzer";
import { FileService } from "./services/FileService";

/**
 * Main heartbeat monitoring class that orchestrates the monitoring process
 */
export class HeartbeatMonitor {
  private analyzer: HeartbeatAnalyzer;

  constructor(config: Config) {
    this.analyzer = new HeartbeatAnalyzer(config);
  }

  /**
   * Main method to analyze heartbeat events and generate alerts
   * @param eventsFile Path to the JSON file containing events
   * @returns Array of alerts
   */
  analyzeHeartbeats(eventsFile: string): Alert[] {
    try {
      // Read and parse events file
      const rawEvents = FileService.readEventsFile(eventsFile);

      // Process and validate events
      const serviceEvents = EventProcessor.processEvents(rawEvents);

      // Analyze each service for missed heartbeats
      const alerts = this.analyzer.analyzeAllServices(serviceEvents);

      return alerts;
    } catch (error) {
      console.error("Error analyzing heartbeats:", error);
      throw error;
    }
  }

  /**
   * Updates the monitoring configuration
   * @param config New configuration
   */
  updateConfig(config: Config): void {
    this.analyzer.updateConfig(config);
  }

  /**
   * Gets the current configuration
   * @returns Current configuration
   */
  getConfig(): Config {
    return this.analyzer.getConfig();
  }

  /**
   * Analyzes events from raw data (useful for testing)
   * @param rawEvents Array of raw event objects
   * @returns Array of alerts
   */
  analyzeRawEvents(rawEvents: any[]): Alert[] {
    try {
      // Process and validate events
      const serviceEvents = EventProcessor.processEvents(rawEvents);

      // Analyze each service for missed heartbeats
      const alerts = this.analyzer.analyzeAllServices(serviceEvents);

      return alerts;
    } catch (error) {
      console.error("Error analyzing raw events:", error);
      throw error;
    }
  }
}
