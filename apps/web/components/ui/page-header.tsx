import { cn } from "@/lib/utils";

type PageHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({
  label,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {label && <p className="font-mono-label mb-1">{label}</p>}
      <h1 className="text-display text-3xl tracking-tighter">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-secondary max-w-md">{description}</p>
      )}
    </div>
  );
}
