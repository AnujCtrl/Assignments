/**
 * Core types and interfaces for the heartbeat monitoring system
 */
export interface HeartbeatEvent {
    service: string;
    timestamp: string;
}
export interface Alert {
    service: string;
    alert_at: string;
}
export interface Config {
    expected_interval_seconds: number;
    allowed_misses: number;
}
export interface ValidationResult {
    valid: HeartbeatEvent[];
    invalid: number;
}
export interface ServiceEventMap {
    [serviceName: string]: HeartbeatEvent[];
}
//# sourceMappingURL=index.d.ts.map