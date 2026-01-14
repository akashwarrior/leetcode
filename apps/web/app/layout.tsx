import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


const inter = Inter({
  subsets: ['latin'],
  weight: "variable",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "CodeArena",
  description: "Practice coding problems and compete for contest rankings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.style)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster
            position="bottom-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
