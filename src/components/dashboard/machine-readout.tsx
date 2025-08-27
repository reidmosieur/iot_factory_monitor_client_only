"use client";

import { sensorThresholds, simulateTelemetryUpdate } from "@/lib/devices";
import { MachineTelemetry, SensorType } from "@/types/devices";
import { useEffect, useState } from "react";
import { LineReadout } from "./line-readout";
import { SensorDisplay } from "./sensor-display";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { LucideIcon, Terminal } from "lucide-react";

const barTypes = ["VIBRATION", "POWER_CONSUMPTION"];
const excludedStatuses = ["OFFLINE"];

export function MachineReadout({
  paused,
  alert,
  ...machine
}: MachineTelemetry & {
  paused?: boolean;
  alert?: {
    variant: "info" | "warning" | "critical" | "emergency";
    icon: LucideIcon;
    title: string;
    description: string;
  };
}) {
  const [currentTelemetryData, setCurrentTelemetryData] = useState(machine);
  const [historicalSensorData, setHistoricalSensorData] = useState<
    Record<SensorType, { timestamp: string; value: number }[]>
  >(
    machine.sensors.reduce(
      (acc, { type, timestamp, value }) => ({
        ...acc,
        [type]: [
          { timestamp: new Date(timestamp).toLocaleTimeString(), value },
        ],
      }),
      {} as Record<SensorType, { timestamp: string; value: number }[]>
    )
  );

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      // Pass currentTelemetryData as an array to simulateTelemetryUpdate
      const newData = simulateTelemetryUpdate(currentTelemetryData, 2000);

      // Update current telemetry
      setCurrentTelemetryData(newData);

      // Append new sensor readings to historical data
      setHistoricalSensorData((prev) => {
        const newHistoricalData = { ...prev };
        newData.sensors.forEach(({ type, timestamp, value }) => {
          newHistoricalData[type] = [
            ...(newHistoricalData[type] || []),
            {
              timestamp: new Date(timestamp).toLocaleTimeString(),
              value,
            },
          ];
        });
        return newHistoricalData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [paused]); // Empty dependency array to prevent restarting interval

  const { machineId, sensors, status } = currentTelemetryData;

  const style =
    status === "OPERATIONAL"
      ? "bg-operational/10 text-operational"
      : status === "IDLE"
      ? "bg-idle/10 text-idle"
      : status === "MAINTENANCE"
      ? "bg-maintenance/10 text-maintenance"
      : status === "FAULTY"
      ? "bg-faulty/10 text-faulty"
      : status === "OFFLINE"
      ? "bg-offline/10 text-offline"
      : "bg-muted text-muted-foreground";

  return (
    <div className="pb-8 last:pb-0 space-y-4">
      <div className="flex justify-between gap-4">
        <div className="flex gap-3.5 items-center">
          <h2>{machineId}</h2>
          <small className={cn("px-1.5 py-.5 rounded", style)}>{status}</small>
        </div>
      </div>
      {excludedStatuses.includes(status) ? null : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 xl:col-span-1 gap-8">
            {alert && (
              <Alert
                className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-3"
                variant={alert.variant}
              >
                {<alert.icon />}
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            )}
            {sensors
              .filter(({ type }) => !barTypes.includes(type))
              .map((reading, sensorIndex) => (
                <SensorDisplay
                  key={`${machineId}_${sensorIndex}_${reading.sensorId}`}
                  reading={reading}
                />
              ))}
            <div className="col-span-2 lg:col-span-4 xl:col-span-2 grid lg:grid-cols-2 xl:grid-cols-1 gap-4">
              {sensors
                .filter(({ type }) => barTypes.includes(type))
                .map((reading, sensorIndex) => (
                  <SensorDisplay
                    key={`${machineId}_${sensorIndex}_${reading.sensorId}`}
                    reading={reading}
                  />
                ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:col-span-2 gap-4 grow">
            {Object.entries(historicalSensorData).map(
              ([type, data], sensorIndex) => (
                <LineReadout
                  key={`${machineId}_${sensorIndex}_${type}`}
                  label={type}
                  chartData={data}
                  threshold={sensorThresholds[type as SensorType]}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
