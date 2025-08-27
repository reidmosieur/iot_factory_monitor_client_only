import { sensorThresholds } from "@/lib/devices";
import { cn } from "@/lib/utils";
import { SensorReading, SensorType } from "@/types/devices";
import { ComponentProps } from "react";
import { BarReadout } from "./bar-readout";
import { RadialReadout } from "./radial-readout";

interface SensorDisplayProps {
  reading: SensorReading;
  containerProps?: ComponentProps<"div">;
}

export function SensorDisplay({ reading, containerProps }: SensorDisplayProps) {
  const threshold = sensorThresholds[reading.type];
  const isGaugeSensor = [
    SensorType.TEMPERATURE,
    SensorType.PRESSURE,
    SensorType.HUMIDITY,
    SensorType.FLOW_RATE,
    SensorType.RPM,
    SensorType.TORQUE,
    SensorType.VOLTAGE,
    SensorType.CURRENT,
  ].includes(reading.type);

  return (
    <div
      {...containerProps}
      className={cn("relative", containerProps?.className)}
    >
      {isGaugeSensor ? (
        <RadialReadout
          value={reading.value}
          threshold={threshold}
          label={reading.type}
          unitsLabel={reading.unit
            .replace("CELSIUS", "C")
            .replace("PERCENT", "%")
            .replace("LITERS_PER_MIN", "LPM")}
          type={reading.type}
        />
      ) : (
        <BarReadout
          label={`${reading.type.replaceAll(
            "_",
            " "
          )}: ${reading.value.toLocaleString()} ${reading.unit
            .replace("CELSIUS", "C")
            .replace("PERCENT", "%")
            .replace("LITERS_PER_MIN", "LPM")}`}
          value={(reading.value / threshold.highMax) * 100}
          threshold={threshold}
        />
      )}
    </div>
  );
}
