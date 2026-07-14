import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-60">
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
