import { Header } from "@/components/header";

export default function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 overflow-hidden min-h-svh">
        {children}
      </main>
    </>
  );
}
