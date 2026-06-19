import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { LayoutGrid, Sparkles, Users } from "lucide-react";
import type { Database } from "@/types/database";

async function getDashboardData() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const [funcionalidades, beneficios, leadsCount, recentLeads] = await Promise.all([
    supabase.from("funcionalidades").select("id", { count: "exact", head: true }).eq("visible", true),
    supabase.from("beneficios").select("id", { count: "exact", head: true }).eq("visible", true),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    funcionalidades: funcionalidades.count ?? 0,
    beneficios:      beneficios.count ?? 0,
    leads:           leadsCount.count ?? 0,
    recentLeads:     recentLeads.data ?? [],
  };
}

const estadoBadge: Record<string, { label: string; bg: string; color: string }> = {
  nuevo:        { label: "Nuevo",        bg: "#dbeafe", color: "#1d4ed8" },
  en_contacto:  { label: "En contacto",  bg: "#fef9c3", color: "#a16207" },
  cerrado:      { label: "Cerrado",      bg: "#dcfce7", color: "#15803d" },
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div
      className="flex flex-col justify-between"
      style={{
        height: 120,
        borderRadius: 12,
        background: "#fbfbfb",
        border: "1px solid #b3b3b3",
        padding: "20px 20px 14px 20px",
        boxShadow: "0 1px 3px #0000000d",
      }}
    >
      <div className="flex items-start justify-between">
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "#b3b3b3",
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>
        <Icon size={16} strokeWidth={1.5} color="#062244" style={{ opacity: 0.25 }} />
      </div>
      <span
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 32,
          fontWeight: 800,
          color: "#062244",
          lineHeight: 1.5,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}

export default async function AdminDashboard() {
  const { funcionalidades, beneficios, leads, recentLeads } = await getDashboardData();

  return (
    <div className="flex flex-col gap-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Funcionalidades activas" value={funcionalidades} icon={LayoutGrid} />
        <StatCard label="Beneficios activos"      value={beneficios}      icon={Sparkles} />
        <StatCard label="Leads este mes"           value={leads}           icon={Users} />
      </div>

      {/* Recent leads table */}
      <div
        style={{
          borderRadius: 12,
          background: "#fbfbfb",
          border: "1px solid #b3b3b3",
          boxShadow: "0 1px 3px #0000000d",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(179,179,179,0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#062244",
              lineHeight: 1.5,
            }}
          >
            Solicitudes recientes
          </span>
          <Link
            href="leads"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#062244",
              lineHeight: 1.5,
              textDecoration: "none",
            }}
          >
            Ver todas →
          </Link>
        </div>

        {/* Col headers */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
            background: "rgba(244,243,243,0.3)",
            padding: "0",
          }}
        >
          {["Nombre", "Canal", "Fecha", "Estado", "Acción"].map((h, i) => (
            <div
              key={h}
              style={{
                padding: "16px 24px",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#b3b3b3",
                textAlign: i === 4 ? "right" : "left",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {recentLeads.length === 0 ? (
          <div
            className="text-center"
            style={{
              padding: "40px 24px",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 13,
              color: "#b3b3b3",
            }}
          >
            No hay solicitudes aún.
          </div>
        ) : (
          recentLeads.map((lead, i) => {
            const badge = estadoBadge[lead.estado] ?? estadoBadge.nuevo;
            const fecha = new Date(lead.created_at).toLocaleDateString("es-MX", {
              day: "numeric", month: "short",
            });
            return (
              <div
                key={lead.id}
                className="grid"
                style={{
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
                  borderTop: i > 0 ? "1px solid rgba(179,179,179,0.1)" : undefined,
                  alignItems: "center",
                }}
              >
                <div style={{ padding: "16px 24px", fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, fontWeight: 500, color: "#062244" }}>
                  {lead.nombre}
                </div>
                <div style={{ padding: "16px 24px", fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#b3b3b3" }}>
                  {lead.canal === "whatsapp" ? "WhatsApp" : "Email"}
                </div>
                <div style={{ padding: "16px 24px", fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#b3b3b3" }}>
                  {fecha}
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: badge.bg,
                      color: badge.color,
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
                <div style={{ padding: "16px 24px", textAlign: "right" }}>
                  <Link
                    href="leads"
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#00399d",
                    }}
                  >
                    Contactar
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
