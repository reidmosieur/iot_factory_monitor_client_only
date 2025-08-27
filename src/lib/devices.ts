import {
  MachineTelemetry,
  SensorReading,
  Alert,
  SensorType,
  UnitOfMeasure,
  MachineStatus,
  AlertSeverity,
  MachineType,
  Threshold,
} from "@/types/devices";

// Helper function to generate random value within range
const generateRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Sensor ranges and units mapping
const sensorConfigs: Record<
  SensorType,
  { min: number; max: number; unit: UnitOfMeasure }
> = {
  [SensorType.TEMPERATURE]: { min: 20, max: 80, unit: UnitOfMeasure.CELSIUS },
  [SensorType.PRESSURE]: { min: 50, max: 150, unit: UnitOfMeasure.PSI },
  [SensorType.VIBRATION]: { min: 0.5, max: 5, unit: UnitOfMeasure.HZ },
  [SensorType.HUMIDITY]: { min: 30, max: 90, unit: UnitOfMeasure.PERCENT },
  [SensorType.FLOW_RATE]: {
    min: 10,
    max: 100,
    unit: UnitOfMeasure.LITERS_PER_MIN,
  },
  [SensorType.POWER_CONSUMPTION]: { min: 10, max: 50, unit: UnitOfMeasure.KWH },
  [SensorType.RPM]: { min: 1000, max: 3000, unit: UnitOfMeasure.RPM },
  [SensorType.TORQUE]: { min: 50, max: 200, unit: UnitOfMeasure.NM },
  [SensorType.VOLTAGE]: { min: 200, max: 240, unit: UnitOfMeasure.VOLTS },
  [SensorType.CURRENT]: { min: 5, max: 20, unit: UnitOfMeasure.AMPS },
};

export const sensorThresholds: Record<SensorType, Threshold> = {
  [SensorType.TEMPERATURE]: {
    lowMin: 0,
    lowMax: 30,
    normalMin: 30,
    normalMax: 60,
    highMin: 60,
    highMax: 80,
    criticalMax: 120, // Anomalous values from 80–120°C
  },
  [SensorType.PRESSURE]: {
    lowMin: 0,
    lowMax: 70,
    normalMin: 70,
    normalMax: 120,
    highMin: 120,
    highMax: 150,
    criticalMax: 225,
  },
  [SensorType.VIBRATION]: {
    lowMin: 0,
    lowMax: 1,
    normalMin: 1,
    normalMax: 3,
    highMin: 3,
    highMax: 5,
    criticalMax: 7.5,
  },
  [SensorType.HUMIDITY]: {
    lowMin: 0,
    lowMax: 40,
    normalMin: 40,
    normalMax: 70,
    highMin: 70,
    highMax: 90,
    criticalMax: 100,
  },
  [SensorType.FLOW_RATE]: {
    lowMin: 0,
    lowMax: 30,
    normalMin: 30,
    normalMax: 70,
    highMin: 70,
    highMax: 100,
    criticalMax: 150,
  },
  [SensorType.POWER_CONSUMPTION]: {
    lowMin: 0,
    lowMax: 15,
    normalMin: 15,
    normalMax: 35,
    highMin: 35,
    highMax: 50,
    criticalMax: 75,
  },
  [SensorType.RPM]: {
    lowMin: 0,
    lowMax: 1500,
    normalMin: 1500,
    normalMax: 2500,
    highMin: 2500,
    highMax: 3000,
    criticalMax: 4500,
  },
  [SensorType.TORQUE]: {
    lowMin: 0,
    lowMax: 80,
    normalMin: 80,
    normalMax: 150,
    highMin: 150,
    highMax: 200,
    criticalMax: 300,
  },
  [SensorType.VOLTAGE]: {
    lowMin: 0,
    lowMax: 210,
    normalMin: 210,
    normalMax: 230,
    highMin: 230,
    highMax: 240,
    criticalMax: 360,
  },
  [SensorType.CURRENT]: {
    lowMin: 0,
    lowMax: 8,
    normalMin: 8,
    normalMax: 15,
    highMin: 15,
    highMax: 20,
    criticalMax: 30,
  },
};

export function getThresholdStatus(
  value: number,
  threshold: Threshold
): "low" | "normal" | "high" | "critical" {
  if (value <= threshold.lowMax) return "low";
  if (value <= threshold.normalMax) return "normal";
  if (value <= threshold.highMax) return "high";
  return "critical";
}

// Alert messages templates by severity
const alertTemplates: Record<AlertSeverity, string[]> = {
  [AlertSeverity.INFO]: [
    "{machine} operating normally.",
    "{machine} resumed operation.",
  ],
  [AlertSeverity.WARNING]: [
    "{machine} idle for extended period.",
    "{machine} approaching maintenance threshold.",
  ],
  [AlertSeverity.CRITICAL]: [
    "{machine} maintenance overdue.",
    "{machine} high {sensor} detected.",
  ],
  [AlertSeverity.EMERGENCY]: [
    "{machine} fault detected: {issue}.",
    "{machine} emergency shutdown initiated.",
  ],
};

// Types for factory hierarchy
export type Machines = Array<{
  id: string;
  type: MachineType;
  status: MachineStatus;
}>;

export type Lines = Array<{
  id: string;
  machines: Machines;
}>;

export type Factories = Array<{
  id: string;
  lines: Lines;
}>;

// Generated data structure
export interface GeneratedData {
  factoriesData: Factories;
  initialTelemetryData: MachineTelemetry[];
  initialAlerts: Alert[];
}

// Generate initial data for one machine per MachineType
export function generateDemoData(): GeneratedData {
  const factoryId = "FACTORY_001";
  const lineId = "LINE_001";
  const statuses = Object.values(MachineStatus); // Ensure all statuses are used
  let sensorIndex = 1;
  let alertIndex = 1;

  const machines: Machines = [];
  const initialTelemetryData: MachineTelemetry[] = [];
  const initialAlerts: Alert[] = [];

  Object.values(MachineType).forEach((type, index) => {
    const machineId = `${type}_001`;
    const status = statuses[index % statuses.length]; // Cycle through statuses
    const source = `${factoryId}/${lineId}/${machineId}/telemetry`;
    const timestamp = new Date().toISOString();

    // Generate sensors
    const sensors: SensorReading[] = Object.entries(sensorConfigs).map(
      ([sensorType, { min, max, unit }]) => {
        let value: number;
        let isAnomalous = false;

        if (status === MachineStatus.OFFLINE) {
          value = 0;
        } else if (status === MachineStatus.FAULTY) {
          value = generateRandomValue(max, max * 1.5);
          isAnomalous = true;
        } else if (
          status === MachineStatus.MAINTENANCE ||
          status === MachineStatus.IDLE
        ) {
          value = [SensorType.POWER_CONSUMPTION, SensorType.RPM].includes(
            sensorType as SensorType
          )
            ? 0
            : generateRandomValue(min, max);
        } else {
          value = generateRandomValue(min, max);
          isAnomalous = Math.random() < 0.15;
          if (isAnomalous) value = generateRandomValue(max * 1.1, max * 1.2);
        }

        return {
          sensorId: `SENS_${sensorIndex.toString().padStart(4, "0")}`,
          type: sensorType as SensorType,
          value,
          unit,
          timestamp,
          source,
          isAnomalous,
        };
      }
    );
    sensorIndex += sensors.length;

    // Telemetry
    const uptime = [MachineStatus.OPERATIONAL, MachineStatus.IDLE].includes(
      status
    )
      ? generateRandomValue(0, 86400000) // 0-24 hours in milliseconds
      : 0;
    const productionRate =
      status === MachineStatus.OPERATIONAL
        ? generateRandomValue(50, 200)
        : undefined;
    const errorCode = status === MachineStatus.FAULTY ? `ERR_001` : undefined;

    initialTelemetryData.push({
      machineId,
      machineType: type,
      status,
      uptime,
      sensors,
      productionRate,
      errorCode,
      timestamp,
      source,
    });

    // Generate alert (60% chance)
    if (Math.random() < 0.6) {
      const severity =
        Object.values(AlertSeverity)[
          Math.floor(Math.random() * Object.values(AlertSeverity).length)
        ];
      const template =
        alertTemplates[severity][
          Math.floor(Math.random() * alertTemplates[severity].length)
        ];
      const relatedSensor =
        severity === AlertSeverity.CRITICAL ||
        severity === AlertSeverity.EMERGENCY
          ? sensors.find((s) => s.isAnomalous) ||
            sensors[Math.floor(Math.random() * sensors.length)]
          : sensors[Math.floor(Math.random() * sensors.length)];
      const message = template
        .replace("{machine}", `${type} ${machineId}`)
        .replace("{sensor}", relatedSensor.type)
        .replace("{issue}", "critical failure");

      initialAlerts.push({
        alertId: `ALERT_${alertIndex.toString().padStart(3, "0")}`,
        severity,
        message,
        relatedMachineId: machineId,
        relatedSensorId: relatedSensor.sensorId,
        resolved: Math.random() < 0.5,
        resolutionNotes:
          Math.random() < 0.5 ? "Resolved by maintenance team." : undefined,
        timestamp,
        source: `${factoryId}/${lineId}/${machineId}/alerts`,
      });
      alertIndex++;
    }

    machines.push({ id: machineId, type, status });
  });

  const factoriesData: Factories = [
    {
      id: factoryId,
      lines: [{ id: lineId, machines }],
    },
  ];

  return { factoriesData, initialTelemetryData, initialAlerts };
}

// Simulate new telemetry readings with configurable increment in milliseconds
export function simulateTelemetryUpdate(
  telemetry: MachineTelemetry,
  increment: number // Increment in milliseconds
): MachineTelemetry {
  const { machineId, machineType, status, source, sensors } = telemetry;
  const timestamp = new Date().toISOString();

  const newSensors = sensors.map(
    ({ sensorId, type: sensorType, unit, value: prevValue }) => {
      let value: number;
      let isAnomalous = false;
      const { min, max } = sensorConfigs[sensorType];

      if (status === MachineStatus.OFFLINE) {
        value = 0;
      } else if (status === MachineStatus.FAULTY) {
        value = generateRandomValue(max, max * 1.5);
        isAnomalous = true;
      } else if (
        status === MachineStatus.MAINTENANCE ||
        status === MachineStatus.IDLE
      ) {
        value = [SensorType.POWER_CONSUMPTION, SensorType.RPM].includes(
          sensorType
        )
          ? 0
          : prevValue; // Maintain previous value for smooth transitions
      } else {
        // OPERATIONAL: Small incremental change unless anomalous
        isAnomalous = Math.random() < 0.01;
        if (isAnomalous) {
          value = generateRandomValue(max * 1.1, max * 1.2);
        } else {
          // Calculate small increment (±5% of range)
          const range = max - min;
          const maxDelta = range * 0.05; // 5% of range
          const delta = generateRandomValue(-maxDelta, maxDelta);
          value = Math.max(min, Math.min(max, prevValue + delta));
        }
      }

      return {
        sensorId,
        type: sensorType,
        value,
        unit,
        timestamp,
        source,
        isAnomalous,
      };
    }
  );

  const uptime = [MachineStatus.OPERATIONAL, MachineStatus.IDLE].includes(
    status
  )
    ? telemetry.uptime + increment
    : 0;
  const productionRate =
    status === MachineStatus.OPERATIONAL
      ? generateRandomValue(50, 200)
      : undefined;
  const errorCode = status === MachineStatus.FAULTY ? `ERR_001` : undefined;

  return {
    machineId,
    machineType,
    status,
    uptime,
    sensors: newSensors,
    productionRate,
    errorCode,
    timestamp,
    source,
  };
}
