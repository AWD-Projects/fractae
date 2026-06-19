"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { Toaster } from "./toaster";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Toaster>
      <div className="min-h-screen flex" style={{ background: "#f4f6f9" }}>
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
        <main
          className="flex-1 min-w-0 transition-all duration-300"
          style={{ marginLeft: collapsed ? 64 : 260 }}
        >
          {children}
        </main>
      </div>
    </Toaster>
  );
}
