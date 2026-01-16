import { Header } from "@/components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SWRConfig } from "swr";

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SWRConfig
      value={{
        fallback: { session },
      }}
    >
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 overflow-hidden min-h-svh">
        {children}
      </main>
    </SWRConfig>
  );
}
