import { type ElementType } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ElementType;
  colorClass?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  colorClass,
  className,
}: StatCardProps) {
  return (
    <div className={cn("nothing-card p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <Icon size={14} className={cn(colorClass || "text-primary")} />
        )}
        {sub && <span className="font-mono-label">{sub}</span>}
      </div>
      <p className="text-display text-xl tabular-nums tracking-tight text-primary">
        {value}
      </p>
      <p className="font-mono-label mt-1">{label}</p>
    </div>
  );
}
