import { Threshold } from "@/types/devices";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function BarReadout({
  label,
  value,
  threshold,
}: {
  label: string;
  value: number;
  threshold: Threshold;
}) {
  const bg =
    value <= threshold.lowMax
      ? "yellow-500" // Yellow for low
      : value <= threshold.normalMax
      ? "bg-green-500" // Green for normal
      : value <= threshold.highMax
      ? "bg-orange-500"
      : "bg-red-500";
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3.5")}>
      <label>{label}</label>
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-muted relative h-2 w-full overflow-hidden rounded-full"
        )}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn("h-full w-full flex-1 transition-all", bg)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
