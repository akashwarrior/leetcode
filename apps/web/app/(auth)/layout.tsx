import Link from "next/link";
import { Code2 } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex bg-background flex-col lg:flex-row">
      <Link
        href="/landing"
        prefetch={false}
        className="z-20 flex lg:absolute top-6 left-6 items-center gap-2.5 w-fit group cursor-pointer p-6 lg:p-0"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-accent hover:bg-border transition-transform duration-200 group-hover:scale-105">
          <Code2 size={11} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          CodeArena
        </span>
      </Link>

      <div className="hidden lg:flex flex-col lg:w-2/5 relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--border),transparent_50%)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--border),transparent_50%)_1px,transparent_1px)] bg-size-[48px_48px]" />

        <div className="max-w-md my-auto z-20">
          <h1 className="text-4xl font-medium tracking-tighter leading-1.1 mb-5">
            Master algorithms,
            <br />
            build your future
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Join thousands of developers building the skills that top
            companies look for. Practice daily, compete weekly, and track your
            growth.
          </p>

          <div className="flex items-center gap-8 mt-12">
            {[
              { value: "2,500+", label: "Problems" },
              { value: "150K+", label: "Users" },
              { value: "Weekly", label: "Contests" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-medium tracking-tight tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-auto">
          © {new Date().getFullYear()} CodeArena
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center pt-0 p-6 lg:pt-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
