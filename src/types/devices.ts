// Enums for common types to make the interfaces more robust and type-safe
export enum MachineType {
  ASSEMBLY_ROBOT = "ASSEMBLY_ROBOT",
  CNC_MACHINE = "CNC_MACHINE",
  CONVEYOR_BELT = "CONVEYOR_BELT",
  PACKAGING_UNIT = "PACKAGING_UNIT",
  QUALITY_INSPECTOR = "QUALITY_INSPECTOR",
  WELDING_STATION = "WELDING_STATION",
}

export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  PRESSURE = "PRESSURE",
  VIBRATION = "VIBRATION",
  HUMIDITY = "HUMIDITY",
  FLOW_RATE = "FLOW_RATE",
  POWER_CONSUMPTION = "POWER_CONSUMPTION",
  RPM = "RPM",
  TORQUE = "TORQUE",
  VOLTAGE = "VOLTAGE",
  CURRENT = "CURRENT",
}

export enum MachineStatus {
  OPERATIONAL = "OPERATIONAL",
  IDLE = "IDLE",
  MAINTENANCE = "MAINTENANCE",
  FAULTY = "FAULTY",
  OFFLINE = "OFFLINE",
}

export enum AlertSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
  EMERGENCY = "EMERGENCY",
}

export enum UnitOfMeasure {
  CELSIUS = "CELSIUS",
  PSI = "PSI",
  HZ = "HZ",
  PERCENT = "PERCENT",
  LITERS_PER_MIN = "LITERS_PER_MIN",
  KWH = "KWH",
  RPM = "RPM",
  NM = "NM",
  VOLTS = "VOLTS",
  AMPS = "AMPS",
}

export interface Threshold {
  lowMin: number; // Minimum value for low range (e.g., 0 for TEMPERATURE)
  lowMax: number; // Maximum value for low range (e.g., 30 for TEMPERATURE)
  normalMin: number; // Minimum value for normal range (e.g., 30)
  normalMax: number; // Maximum value for normal range (e.g., 60)
  highMin: number; // Minimum value for high range (e.g., 60)
  highMax: number; // Maximum value for high range (e.g., 80)
  criticalMax: number; // Maximum value for critical range (e.g., 120 for anomalous)
}

// Base interface for timestamped data
export interface Timestamped {
  timestamp: string; // ISO 8601 format, e.g., '2025-08-25T12:00:00Z'
  source: string; // MQTT topic or device ID for traceability
}

// Interface for a single sensor reading
export interface SensorReading extends Timestamped {
  sensorId: string;
  type: SensorType;
  value: number;
  unit: UnitOfMeasure;
  isAnomalous?: boolean; // Optional flag for anomaly detection
}

// Interface for alerts generated from telemetry
export interface Alert extends Timestamped {
  alertId: string;
  severity: AlertSeverity;
  message: string;
  relatedMachineId?: string;
  relatedSensorId?: string;
  resolved: boolean;
  resolutionNotes?: string;
}

// Interface for aggregated telemetry from a machine
export interface MachineTelemetry extends Timestamped {
  machineId: string;
  machineType: MachineType;
  status: MachineStatus;
  uptime: number; // In seconds
  sensors: SensorReading[]; // Array of sensor readings
  productionRate?: number; // Optional, e.g., units per hour
  errorCode?: string; // Optional error code if faulty
}

// Interface for machine configuration (static or semi-static data)
export interface MachineConfig {
  machineId: string;
  type: MachineType;
  location: string; // e.g., 'FactoryA/Line2/Station3'
  sensors: Array<{
    id: string;
    type: SensorType;
    thresholds: { min: number; max: number };
  }>;
  maintenanceSchedule: string[]; // Array of ISO dates for scheduled maintenance
}

// Interface for a production line, aggregating multiple machines
export interface ProductionLine {
  lineId: string;
  name: string;
  machines: MachineConfig[]; // Configurations for machines in the line
  overallEfficiency: number; // OEE percentage (Overall Equipment Effectiveness)
  downtimeReasons: Record<string, number>; // e.g., { 'Mechanical Failure': 1200 } in seconds
}

// Interface for a factory, top-level hierarchy
export interface Factory {
  factoryId: string;
  name: string;
  location: { lat: number; lng: number }; // Geolocation for mapping
  productionLines: ProductionLine[];
  totalOutput: number; // Daily output units
}

// Interface for historical data query results (for charts/trends)
export interface HistoricalTelemetry {
  machineId: string;
  sensorType: SensorType;
  dataPoints: Array<{ timestamp: string; value: number }>;
  aggregates: {
    min: number;
    max: number;
    average: number;
    stdDev: number;
  };
}

// Interface for MQTT message payload (generic for pub/sub)
export interface MqttPayload<T> {
  topic: string; // Full MQTT topic, e.g., 'factoryA/line1/machine2/telemetry'
  data: T; // Generic for different payload types
  qos: 0 | 1 | 2; // Quality of Service level
  retain?: boolean;
}

// Example usage: Type for machine telemetry MQTT payload
export type MachineTelemetryPayload = MqttPayload<MachineTelemetry>;

export type Machines = Array<{
  id: string;
  type: MachineType;
  status: MachineStatus;
}>;

export type Lines = Array<{
  id: string;
  machines: Machines;
  totalOperational: number;
  totalIdle: number;
  totalMaintenance: number;
  totalFaulty: number;
  totalOffline: number;
}>;

export type Factories = Array<{
  id: string;
  lines: Lines;
  totalOperational: number;
  totalIdle: number;
  totalMaintenance: number;
  totalFaulty: number;
  totalOffline: number;
}>;

// Interface for dashboard state (client-side)
export interface DashboardState {
  factories: Factory[]; // Hierarchical data
  realTimeTelemetry: Record<string, MachineTelemetry>; // Keyed by machineId
  alerts: Alert[]; // Active alerts
  historicalData: Record<string, HistoricalTelemetry>; // Keyed by machineId_sensorType
  selectedView: "overview" | "line" | "machine" | "alerts" | "trends";
  userPreferences: {
    refreshInterval: number; // MQTT subscription refresh in ms
    alertThresholds: Record<SensorType, { min: number; max: number }>;
  };
}

// Interface for simulated data generator config (for your script/Docker setup)
export interface SimulatorConfig {
  factories: Array<{
    id: string;
    lines: Array<{
      id: string;
      machines: Array<{
        id: string;
        type: MachineType;
        sensors: Array<{
          type: SensorType;
          min: number;
          max: number;
          noise: number;
        }>;
      }>;
    }>;
  }>;
  updateInterval: number; // ms between random updates
  mqttBroker: string; // e.g., 'mqtt://localhost:1883'
  anomalyProbability: number; // 0-1 chance of generating anomalous data
}
