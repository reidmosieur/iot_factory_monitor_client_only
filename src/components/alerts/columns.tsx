"use client";

import { cn } from "@/lib/utils";
import { Alert, AlertSeverity } from "@/types/devices";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const columns: Array<ColumnDef<Alert>> = [
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity") as AlertSeverity;
      const background =
        severity === "INFO"
          ? "bg-info"
          : severity === "WARNING"
          ? "bg-warning"
          : severity === "CRITICAL"
          ? "bg-critical"
          : severity === "EMERGENCY"
          ? "bg-emergency"
          : null;

      return (
        <div className="grid gap-1.5">
          <div className="flex gap-1 items-center">
            <span className={cn("w-3.5 h-3.5 rounded", background)} />
            <span>{severity}</span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Resolution",
    cell: ({ row }) => {
      const { resolutionNotes, resolved } = row.original;
      return (
        <p
          className={cn(resolved ? "text-green-600" : "text-muted-foreground")}
        >
          {resolutionNotes}
        </p>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    header: "Details",
    cell: ({ row }) => {
      const { relatedMachineId, relatedSensorId } = row.original;
      return (
        <div className="grid">
          <span>{relatedMachineId}</span>
          <span>{relatedSensorId}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => {
      const { timestamp } = row.original;
      return new Date(timestamp).toLocaleString();
    },
  },
];
