"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { Threshold } from "@/types/devices";
import { Expand } from "lucide-react";

const slice = -30;

export function LineReadout({
  label,
  chartData,
  threshold,
}: {
  label: string;
  chartData: Array<{ timestamp: string; value: number }>;
  threshold: Threshold;
}) {
  // Calculate the maximum value in chartData
  const maxValue = useMemo(() => {
    return Math.max(...chartData.slice(slice).map((data) => data.value), 0);
  }, [chartData]);

  // Set Y-axis domain to add 11.11% padding above max value (90% of max height)
  const yDomain = useMemo(() => {
    const paddedMax = maxValue * (1 / 0.8); // 1/0.9 ≈ 1.111
    return [0, paddedMax];
  }, [maxValue]);

  const chartConfig = {
    value: {
      label,
      color:
        maxValue <= threshold.lowMax
          ? "oklch(0.80 0.16 86)" // Yellow for low
          : maxValue <= threshold.normalMax
          ? "oklch(0.72 0.19 150)" // Green for normal
          : maxValue <= threshold.highMax
          ? "oklch(0.70 0.19 48)"
          : "oklch(0.64 0.21 25)", // Orange for high
    },
  } satisfies ChartConfig;

  return (
    <div className="h-full relative group pb-5">
      <ChartContainer
        className="w-full max-w-[250px] h-full"
        config={chartConfig}
        onDoubleClick={() => console.log("double clicks")}
      >
        <LineChart
          accessibilityLayer
          data={chartData.slice(slice)}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid strokeDasharray={"3 3"} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            width={40}
            tickFormatter={(value: number) => value.toFixed(1)}
          />
          <Line
            dataKey="value"
            type="linear"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            // animationDuration={20}
          />
        </LineChart>
      </ChartContainer>
      <p className="text-center h-[24px]">
        <span className="hidden group-hover:block text-sm text-muted-foreground">
          Double click to expand <Expand />
        </span>
      </p>
      <h3 className="absolute top-1 right-1 bg-popover px-1.5 py-.5 rounded text-sm">
        {label}
      </h3>
    </div>
  );
}
