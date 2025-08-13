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
exports.FileService = void 0;
const fs = __importStar(require("fs"));
/**
 * Handles file operations for the heartbeat monitoring system
 */
class FileService {
    /**
     * Reads and parses a JSON file containing events
     * @param filePath Path to the JSON file
     * @returns Parsed JSON data
     * @throws Error if file cannot be read or parsed
     */
    static readEventsFile(filePath) {
        try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(fileContent);
            if (!Array.isArray(data)) {
                throw new Error("Events file must contain an array of events");
            }
            return data;
        }
        catch (error) {
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
    static fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        }
        catch {
            return false;
        }
    }
    /**
     * Writes data to a JSON file
     * @param filePath Path to write to
     * @param data Data to write
     * @throws Error if file cannot be written
     */
    static writeJsonFile(filePath, data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonString, "utf-8");
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to write file: ${error.message}`);
            }
            throw new Error("Failed to write file: Unknown error");
        }
    }
}
exports.FileService = FileService;
//# sourceMappingURL=FileService.js.map