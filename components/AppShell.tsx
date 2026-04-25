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
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* Sidebar — fixed, desktop only. Rendered by Sidebar component. */}
      <Sidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="md:pl-72">
        <main className="w-full max-w-[480px] mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-6xl pt-4 md:pt-8 pb-32 md:pb-8 px-[18px] md:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* BottomNav — mobile only. Rendered by BottomNav component. */}
      <BottomNav />
    </div>
  );
}
