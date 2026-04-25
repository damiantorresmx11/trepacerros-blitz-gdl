"use client";

import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1b1c]">
      <Sidebar />
      <TopNav />
      <div className="md:ml-60">
        <main className="w-full max-w-[480px] mx-auto md:max-w-6xl pt-20 md:pt-8 pb-28 md:pb-8 px-5 md:px-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
