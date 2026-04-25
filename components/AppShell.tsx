"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  if (hideNav) {
    return (
      <div className="min-h-screen bg-tc-surface">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tc-surface text-tc-on-surface">
      <Sidebar />
      <div className="md:ml-72">
        <main className="w-full max-w-[480px] mx-auto md:max-w-6xl pt-4 md:pt-8 pb-32 md:pb-8 px-5 md:px-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
