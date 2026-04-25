"use client";

import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1b1c]">
      <Sidebar />
      <TopNav />
      <main className="w-full max-w-[480px] md:max-w-none md:ml-60 mx-auto md:mx-0 pt-20 md:pt-6 pb-28 md:pb-6 px-5 md:px-8 lg:px-12">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
