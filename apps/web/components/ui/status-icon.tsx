import { CheckCircle, Circle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type StatusIconProps = {
  status?: string;
  size?: number;
  className?: string;
};

export function StatusIcon({ status, size = 14, className }: StatusIconProps) {
  if (status === "SOLVED") {
    return (
      <CheckCircle
        size={size}
        className={cn("status-success shrink-0", className)}
      />
    );
  }
  if (status === "ATTEMPTED") {
    return (
      <Circle
        size={size}
        className={cn("status-warning shrink-0", className)}
      />
    );
  }
  return (
    <Circle size={size} className={cn("text-disabled shrink-0", className)} />
  );
}
