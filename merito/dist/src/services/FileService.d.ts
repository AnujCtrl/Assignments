/**
 * Handles file operations for the heartbeat monitoring system
 */
export declare class FileService {
    /**
     * Reads and parses a JSON file containing events
     * @param filePath Path to the JSON file
     * @returns Parsed JSON data
     * @throws Error if file cannot be read or parsed
     */
    static readEventsFile(filePath: string): any[];
    /**
     * Checks if a file exists
     * @param filePath Path to check
     * @returns True if file exists, false otherwise
     */
    static fileExists(filePath: string): boolean;
    /**
     * Writes data to a JSON file
     * @param filePath Path to write to
     * @param data Data to write
     * @throws Error if file cannot be written
     */
    static writeJsonFile(filePath: string, data: any): void;
}
//# sourceMappingURL=FileService.d.ts.map