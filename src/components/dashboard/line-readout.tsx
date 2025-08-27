"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { Threshold } from "@/types/devices";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export function LineReadout({
  label,
  chartData,
  threshold,
}: {
  label: string;
  chartData: Array<{ timestamp: string; value: number }>;
  threshold: Threshold;
}) {
  // State for dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate the maximum value in chartData
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((data) => data.value), 0);
  }, [chartData]);

  const yDomain = useMemo(() => {
    const paddedMax = maxValue * (1 / 0.6);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="cursor-pointer h-full">
          <ChartContainer className={`w-full h-full`} config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData.slice(-30)}
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
              />
            </LineChart>
          </ChartContainer>
          <div className="absolute top-0 right-0 bg-popover px-1.5 py-.5 rounded text-sm flex items-center gap-2.5">
            <h3 className="text-xs truncate max-w-24">{label}</h3>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="hidden md:block hover:cursor-pointer"
            >
              <Expand className="size-3.5" />
            </button>
          </div>
        </div>
        <DialogContent className="sm:max-w-9/12">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <ChartContainer
            className={`w-full h-full`}
            config={chartConfig}
            onDoubleClick={() => setIsDialogOpen(true)}
          >
            <LineChart
              accessibilityLayer
              data={chartData.slice(-800)}
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
              />
            </LineChart>
          </ChartContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
