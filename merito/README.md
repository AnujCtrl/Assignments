# Heartbeat Monitor

A simple heartbeat monitoring system that detects missed heartbeats and triggers alerts when services fail to send expected heartbeats.

## Overview

This system analyzes heartbeat events from services and detects when a service misses consecutive heartbeats. When a service misses the configured number of consecutive heartbeats (default: 3), the system generates an alert.

## Features

- ✅ Processes heartbeat events from JSON files
- ✅ Handles unordered input (sorts events chronologically)
- ✅ Gracefully handles malformed events (missing fields, invalid timestamps)
- ✅ Configurable heartbeat interval and allowed misses
- ✅ Generates alerts with precise timestamps
- ✅ Comprehensive test coverage

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### Command Line Interface

Run the heartbeat monitor with an events file:

```bash
npm run start <events_file> [interval_seconds] [allowed_misses]
```

**Examples:**

```bash
# Basic usage with default settings (60 seconds interval, 3 allowed misses)
npm run start events.json

# Custom interval (30 seconds)
npm run start events.json 30

# Custom interval and allowed misses
npm run start events.json 60 2
```

### Parameters

- `events_file`: Path to JSON file containing heartbeat events
- `interval_seconds`: Expected interval between heartbeats in seconds (default: 60)
- `allowed_misses`: Number of consecutive misses before triggering alert (default: 3)

### Input Format

The events file should contain a JSON array of heartbeat events:

```json
[
  {
    "service": "email",
    "timestamp": "2025-08-04T10:00:00Z"
  },
  {
    "service": "sms", 
    "timestamp": "2025-08-04T10:01:00Z"
  }
]
```

**Event Fields:**
- `service`: String identifying the service name
- `timestamp`: ISO 8601 formatted timestamp

### Output Format

The system outputs an array of alerts in JSON format:

```json
[
  {
    "service": "email",
    "alert_at": "2025-08-04T10:06:00.000Z"
  }
]
```

## Development

### Run in Development Mode

```bash
npm run dev events.json
```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage

The test suite includes:

1. **Working Alert Case**: Tests that alerts are generated when services miss 3+ consecutive heartbeats
2. **Near-Miss Case**: Tests that no alerts are generated for only 2 consecutive misses
3. **Unordered Input**: Tests handling of events that arrive out of chronological order
4. **Malformed Events**: Tests graceful handling of events with missing fields or invalid timestamps
5. **Edge Cases**: Tests empty inputs, single events, and different configurations

### Clean Build

```bash
npm run clean
npm run build
```

### Advanced Usage

You can also use individual modules for custom implementations:

```typescript
import { EventValidator, EventProcessor, HeartbeatAnalyzer } from './src';

// Use individual components
const events = EventValidator.validateEvents(rawData);
const serviceEvents = EventProcessor.processEvents(rawData);
const analyzer = new HeartbeatAnalyzer({ expected_interval_seconds: 30, allowed_misses: 2 });
const alerts = analyzer.analyzeAllServices(serviceEvents);
```

## Architecture Overview

The system follows clean code principles with modular separation of concerns:

### Core Modules

- **`src/types/`** - Type definitions and interfaces
- **`src/validators/`** - Event validation logic (`EventValidator`)
- **`src/processors/`** - Event processing and grouping (`EventProcessor`)
- **`src/analyzers/`** - Heartbeat analysis logic (`HeartbeatAnalyzer`)
- **`src/services/`** - File operations (`FileService`)
- **`src/utils/`** - Utility functions (`runner`)

### Processing Flow

1. **Event Validation** (`EventValidator`): Filters out malformed events (missing service/timestamp, invalid timestamp format)
2. **Service Grouping** (`EventProcessor`): Groups valid events by service name
3. **Chronological Sorting** (`EventProcessor`): Sorts events within each service by timestamp
4. **Heartbeat Analysis** (`HeartbeatAnalyzer`): For each service:
   - Tracks expected heartbeat times based on configured interval
   - Counts consecutive missed heartbeats
   - Generates alerts when consecutive misses reach the threshold
5. **Alert Generation**: Returns alerts sorted by alert timestamp

### Benefits of Modular Design

- **No Scope Bleeding**: Each module has clear boundaries and responsibilities
- **Easy Testing**: Individual components can be tested in isolation
- **Maintainability**: Changes to one module don't affect others
- **Reusability**: Components can be used independently or combined differently

## Error Handling

- **Malformed Events**: Skipped gracefully without crashing
- **Missing Files**: Clear error messages
- **Invalid JSON**: Proper error reporting
- **Invalid Timestamps**: Events with unparseable timestamps are filtered out

## License

MIT
