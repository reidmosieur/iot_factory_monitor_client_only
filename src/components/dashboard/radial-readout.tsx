"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SensorType, Threshold } from "@/types/devices";
import { useMemo } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

export function RadialReadout({
  value,
  label,
  unitsLabel,
  threshold,
  type,
}: {
  value: number;
  label: string;
  unitsLabel: string;
  threshold: Threshold;
  type: SensorType;
}) {
  // Chart configuration with colors based on threshold status
  const chartConfig = {
    normal: {
      label: `${label} (Normal)`,
      color:
        value <= threshold.lowMax
          ? "oklch(0.80 0.16 86)" // Yellow for low
          : value <= threshold.normalMax
          ? "oklch(0.72 0.19 150)" // Green for normal
          : value <= threshold.highMax
          ? "oklch(0.70 0.19 48)"
          : "oklch(0.64 0.21 25)", // Orange for high
    },
    overLimit: {
      label: `${label} (Over Limit)`,
    },
  } satisfies ChartConfig;

  // Calculate percentages for normal and over-limit bars
  const normalValue = Math.min(value, threshold.highMax);
  const overLimitValue =
    value > threshold.highMax ? value - threshold.highMax : 0;

  // Chart data: one entry for normal range, one for over-limit if applicable
  const chartData = useMemo(
    () => [
      {
        units: "normal",
        value: normalValue,
        fill: "var(--color-normal)",
      },
      ...(value > threshold.highMax
        ? [
            {
              units: "overLimit",
              value: overLimitValue,
              fill: "var(--color-normal)",
            },
          ]
        : []),
    ],
    [normalValue, overLimitValue, threshold.highMax, value]
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full max-w-[250px] aspect-square"
    >
      <RadialBarChart
        data={chartData}
        startAngle={180}
        endAngle={
          value > threshold.highMax ? -180 : (value / threshold.highMax) * -180
        }
        innerRadius={45}
        outerRadius={50}
      >
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy || 0}
                      className="fill-foreground text-xs font-bold"
                    >
                      {value.toLocaleString()} {unitsLabel}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="fill-muted-foreground text-xs"
                    >
                      {type.replaceAll("_", " ")}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="value"
          cornerRadius={5}
          fill="var(--color-normal)"
          isAnimationActive={false}
          // animationDuration={20}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
