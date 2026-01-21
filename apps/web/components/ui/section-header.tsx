import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  viewAllHref,
  viewAllLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        {label && <p className="font-mono-label mb-1">{label}</p>}
        <h2 className="text-sm font-medium text-primary">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          prefetch={false}
          href={viewAllHref}
          className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 group"
        >
          {viewAllLabel}
          <ArrowRight
            size={10}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}
