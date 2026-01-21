import { cn } from "@/lib/utils";

type DifficultyBadgeProps = {
  difficulty: string;
  className?: string;
};

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const colorClass =
    difficulty === "EASY"
      ? "status-success"
      : difficulty === "MEDIUM"
        ? "status-warning"
        : "status-error";

  return (
    <span
      className={cn(
        "text-[0.625rem] font-mono uppercase tracking-widest px-2 py-0.5 rounded shrink-0",
        colorClass,
        className,
      )}
    >
      {difficulty.toLowerCase()}
    </span>
  );
}
