import Link from "next/link";
import { CodeBlock } from "@phosphor-icons/react/dist/ssr";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh w-full flex bg-background flex-col lg:flex-row">
      <Link
        href="/"
        prefetch={false}
        className="z-20 flex lg:absolute top-6 left-6 items-center gap-2 w-fit cursor-pointer p-6 lg:p-0"
      >
        <div className="flex size-5 items-center justify-center rounded bg-primary">
          <CodeBlock
            size={10}
            className="text-primary-foreground"
            weight="bold"
          />
        </div>
        <span className="text-sm font-medium tracking-tight text-primary">
          CodeArena
        </span>
      </Link>

      <div className="hidden lg:flex flex-col lg:w-2/5 relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30" />

        <div className="max-w-md my-auto z-20">
          <p className="font-mono-label mb-4">CODE ARENA</p>
          <h1 className="text-display text-4xl tracking-tighter leading-[0.95] mb-5">
            Master algorithms,
            <br />
            build your future
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            Join thousands of developers building the skills that top companies
            look for. Practice daily, compete weekly, and track your growth.
          </p>

          <div className="flex items-center gap-8 mt-12">
            {[
              { value: "2,500+", label: "PROBLEMS" },
              { value: "150K+", label: "DEVELOPERS" },
              { value: "WEEKLY", label: "CONTESTS" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-display text-2xl tracking-tight tabular-nums">
                  {stat.value}
                </p>
                <p className="font-mono-label mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-secondary mt-auto">
          &copy; {new Date().getFullYear()} CodeArena
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center pt-0 p-6 lg:pt-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
