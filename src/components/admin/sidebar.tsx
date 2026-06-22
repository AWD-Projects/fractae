"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutGrid, Sparkles, CreditCard, Users, LogOut,
  Home, ChevronLeft, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",       href: "",                icon: Home,        exact: true },
  { label: "Leads",           href: "leads",           icon: Users },
  { label: "Funcionalidades", href: "funcionalidades", icon: LayoutGrid },
  { label: "Beneficios",      href: "beneficios",      icon: Sparkles },
  { label: "Planes",          href: "planes",          icon: CreditCard },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <>
      {/* ── Desktop sidebar (md+) ───────────────────── */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-screen flex-col transition-all duration-300 z-40"
        style={{
          width: collapsed ? 64 : 260,
          background: "#062244",
          padding: 16,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between mb-8 overflow-hidden"
          style={{ minHeight: 48 }}
        >
          {!collapsed && (
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fbfbfb",
                  letterSpacing: "-0.24px",
                  lineHeight: 1.333,
                  whiteSpace: "nowrap",
                }}
              >
                FRACTAE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#fbfbfb",
                  lineHeight: 1.333,
                  whiteSpace: "nowrap",
                }}
              >
                Admin Panel
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="flex items-center justify-center rounded-md transition-colors hover:bg-white/10 shrink-0"
            style={{ width: 32, height: 32, color: "#fbfbfb" }}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 flex-1 overflow-hidden">
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const fullPath = `/${locale}/admin${href ? `/${href}` : ""}`;
            const active   = exact ? pathname === fullPath : pathname.startsWith(fullPath);
            return (
              <Link
                key={href || "dashboard"}
                href={fullPath}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg transition-colors",
                  collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
                  active ? "bg-[#00399d]" : "hover:bg-white/10"
                )}
              >
                <Icon size={18} strokeWidth={1.75} color="#fbfbfb" className="shrink-0" />
                {!collapsed && (
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#fbfbfb",
                      lineHeight: 1.333,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className="pt-4 mt-4"
          style={{ borderTop: "1px solid rgba(251,251,251,0.5)" }}
        >
          <button
            onClick={handleLogout}
            title={collapsed ? "Cerrar sesión" : undefined}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg transition-colors hover:bg-white/10",
              collapsed ? "justify-center px-0 py-3" : "px-4 py-3"
            )}
          >
            <LogOut size={18} strokeWidth={1.75} color="#fbfbfb" className="shrink-0" />
            {!collapsed && (
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#fbfbfb",
                  lineHeight: 1.333,
                  whiteSpace: "nowrap",
                }}
              >
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom navbar (<md) ──────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{
          background: "#062244",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          height: 64,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const fullPath = `/${locale}/admin${href ? `/${href}` : ""}`;
          const active   = exact ? pathname === fullPath : pathname.startsWith(fullPath);
          return (
            <Link
              key={href || "dashboard"}
              href={fullPath}
              className="flex-1 flex flex-col items-center justify-center"
              style={{ gap: 3, padding: "8px 4px", textDecoration: "none" }}
            >
              <div
                style={{
                  borderRadius: 10,
                  padding: "5px 10px",
                  background: active ? "rgba(0,57,157,0.55)" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  transition: "background 0.15s",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2 : 1.75}
                  color={active ? "#27b8ff" : "rgba(251,251,251,0.75)"}
                />
                <span
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: 9,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#fbfbfb" : "rgba(251,251,251,0.6)",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label === "Funcionalidades" ? "Features" : label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Logout item */}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center"
          style={{ gap: 3, padding: "8px 4px", background: "none", border: "none", cursor: "pointer" }}
        >
          <div
            style={{
              borderRadius: 10,
              padding: "5px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <LogOut size={20} strokeWidth={1.75} color="rgba(251,251,251,0.6)" />
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 9,
                fontWeight: 500,
                color: "rgba(251,251,251,0.6)",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Salir
            </span>
          </div>
        </button>
      </nav>
    </>
  );
}
