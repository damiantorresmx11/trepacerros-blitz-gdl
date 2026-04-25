"use client";

import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1b1c]">
      <TopNav />
      <main className="w-full max-w-[480px] mx-auto pt-20 pb-28 px-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
