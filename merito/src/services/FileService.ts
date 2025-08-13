import * as fs from "fs";

/**
 * Handles file operations for the heartbeat monitoring system
 */
export class FileService {
  /**
   * Reads and parses a JSON file containing events
   * @param filePath Path to the JSON file
   * @returns Parsed JSON data
   * @throws Error if file cannot be read or parsed
   */
  static readEventsFile(filePath: string): any[] {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);

      if (!Array.isArray(data)) {
        throw new Error("Events file must contain an array of events");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read events file: ${error.message}`);
      }
      throw new Error("Failed to read events file: Unknown error");
    }
  }

  /**
   * Checks if a file exists
   * @param filePath Path to check
   * @returns True if file exists, false otherwise
   */
  static fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  /**
   * Writes data to a JSON file
   * @param filePath Path to write to
   * @param data Data to write
   * @throws Error if file cannot be written
   */
  static writeJsonFile(filePath: string, data: any): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, jsonString, "utf-8");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write file: ${error.message}`);
      }
      throw new Error("Failed to write file: Unknown error");
    }
  }
}
