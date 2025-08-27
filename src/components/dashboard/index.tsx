"use client";

import { GeneratedData } from "@/lib/devices";
import { AlertCircle, LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MachineReadout } from "./machine-readout";

export function Dashboard({ data }: { data: GeneratedData }) {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  // optional: simulate delay for heavy builder
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="relative w-full h-full hover:cursor-progress">
        <LoaderCircle className="size-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      </div>
    );
  }

  const alerts = data.initialAlerts;

  function constructAlert(machineId: string) {
    const alert = alerts.find((alert) => alert.relatedMachineId === machineId);

    return alert
      ? {
          title: alert.severity,
          description: alert.message,
          icon: AlertCircle,
          variant: alert.severity.toLowerCase() as
            | "info"
            | "warning"
            | "critical"
            | "emergency",
        }
      : undefined;
  }

  return (
    <div className="space-y-8 divide-y">
      <div className="flex justify-between items-center gap-8 pb-4">
        <div>
          <h1>Line A-001</h1>
          <small className="text-muted-foreground">
            Updating every 2 seconds
          </small>
        </div>
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={() => setPaused((prev) => !prev)}
        >
          {paused ? (
            <>
              <Play /> Resume
            </>
          ) : (
            <>
              <Pause />
              Pause
            </>
          )}
        </Button>
      </div>
      {data.initialTelemetryData.map((telemetry) => (
        <MachineReadout
          key={telemetry.machineId}
          paused={paused}
          alert={constructAlert(telemetry.machineId)}
          {...telemetry}
        />
      ))}
    </div>
  );
}
