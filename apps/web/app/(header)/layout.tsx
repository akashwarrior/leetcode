import { Header } from "@/components/header";
import { PageWrapper } from "@/components/page-wrapper";

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 overflow-hidden">
        <PageWrapper>
          {children}
        </PageWrapper>
      </main>
    </>
  );
}
