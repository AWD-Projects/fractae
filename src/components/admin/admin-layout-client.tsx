"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./sidebar";
import { Toaster } from "./toaster";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMd, setIsMd] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMd(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Toaster>
      <div className="min-h-screen flex" style={{ background: "#f4f6f9" }}>
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
        <main
          className="flex-1 min-w-0 transition-all duration-300 pb-16 md:pb-0"
          style={{ marginLeft: isMd ? (collapsed ? 64 : 260) : 0 }}
        >
          {children}
        </main>
      </div>
    </Toaster>
  );
}
