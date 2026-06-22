"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Trash2, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/admin/toaster";
import { updateLeadAction, deleteLeadAction } from "./actions";
import type { Database } from "@/types/database";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type LeadEstado = Lead["estado"];

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────

const ESTADO_CONFIG: Record<LeadEstado, { label: string; bg: string; color: string }> = {
  nuevo:       { label: "Nuevo",       bg: "rgba(219,234,254,0.7)", color: "#1d4ed8" },
  en_contacto: { label: "En contacto", bg: "rgba(254,249,195,0.7)", color: "#a16207" },
  cerrado:     { label: "Cerrado",     bg: "rgba(220,252,231,0.7)", color: "#15803d" },
};

const ESTADO_CYCLE: LeadEstado[] = ["nuevo", "en_contacto", "cerrado"];

function nextEstado(current: LeadEstado): LeadEstado {
  const idx = ESTADO_CYCLE.indexOf(current);
  return ESTADO_CYCLE[(idx + 1) % ESTADO_CYCLE.length];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric", month: "short", year: "2-digit",
  });
}

const FONT = "var(--font-montserrat), sans-serif";

// ── Tooltip ───────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1c1c",
            color: "#fbfbfb",
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 500,
            whiteSpace: "nowrap",
            padding: "4px 10px",
            borderRadius: 6,
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {label}
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #1a1c1c",
          }} />
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function buildContactUrl(canal: Lead["canal"], contacto: string, nombre: string): string {
  const msg = `Hola ${nombre}, te escribimos de FRACTAE con respecto a tu interés en conocer nuestra plataforma de gestión residencial. Quedamos a tu disposición para resolver cualquier duda y coordinar una demostración. ¡Saludos!`;
  if (canal === "whatsapp") {
    const phone = contacto.replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
  const subject = encodeURIComponent("Tu solicitud en FRACTAE");
  const body = encodeURIComponent(msg);
  return `mailto:${contacto}?subject=${subject}&body=${body}`;
}

function CanalIcon({ canal, contacto, nombre }: { canal: Lead["canal"]; contacto: string; nombre: string }) {
  const url = buildContactUrl(canal, contacto, nombre);

  if (canal === "email") {
    return (
      <a
        href={url}
        title={`Enviar email a ${contacto}`}
        style={{
          width: 32, height: 32, borderRadius: 9999,
          background: "rgba(179,179,179,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          textDecoration: "none", cursor: "pointer", transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(179,179,179,0.3)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(179,179,179,0.15)")}
      >
        <Mail size={14} strokeWidth={1.75} color="#b3b3b3" />
      </a>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Enviar WhatsApp a ${contacto}`}
      style={{
        width: 32, height: 32, borderRadius: 9999,
        background: "rgba(37,211,102,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        textDecoration: "none", cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(37,211,102,0.25)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(37,211,102,0.12)")}
    >
      <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, color: "#25d366" }}>WA</span>
    </a>
  );
}

function EstadoBadge({ estado, onClick }: { estado: LeadEstado; onClick?: () => void }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <button
      type="button"
      onClick={onClick}
      title="Cambiar estado"
      style={{
        padding: "3px 10px", borderRadius: 9999, border: "none",
        cursor: onClick ? "pointer" : "default",
        background: cfg.bg,
        fontFamily: FONT, fontSize: 11, fontWeight: 700, color: cfg.color,
        letterSpacing: "0.02em", whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </button>
  );
}

// ── Detail/Notes modal ────────────────────────────────

function LeadModal({ lead, onClose, onSaved }: {
  lead: Lead;
  onClose: () => void;
  onSaved: (updated: Lead) => void;
}) {
  const { loading, update } = useToast();
  const [estado, setEstado] = useState<LeadEstado>(lead.estado);
  const [notas, setNotas] = useState(lead.notas ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const toastId = loading("Guardando...");
    try {
      await updateLeadAction(lead.id, { estado, notas: notas || null });
      update(toastId, "Lead actualizado", "success");
      onSaved({ ...lead, estado, notas: notas || null });
      onClose();
    } catch {
      update(toastId, "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32,
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#062244" }}>
            {lead.nombre}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#b3b3b3", marginTop: 2 }}>
            {formatDate(lead.created_at)}
          </p>
        </div>

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Canal", value: lead.canal === "whatsapp" ? "WhatsApp" : "Email" },
            { label: "Contacto", value: lead.contacto },
          ].map(({ label, value }) => (
            <div key={label} className="flex" style={{ gap: 12 }}>
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#b3b3b3", width: 70, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: FONT, fontSize: 12, color: "#434652" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Estado select */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#062244" }}>Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as LeadEstado)}
            style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
              fontFamily: FONT, fontSize: 13, color: "#062244",
              background: "#fff", cursor: "pointer",
            }}
          >
            <option value="nuevo">Nuevo</option>
            <option value="en_contacto">En contacto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        {/* Notas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#062244" }}>Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
            placeholder="Agrega notas sobre este lead..."
            style={{
              padding: "10px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
              fontFamily: FONT, fontSize: 13, color: "#062244",
              resize: "vertical", outline: "none",
            }}
          />
        </div>

        <div className="flex justify-end" style={{ gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px", borderRadius: 8,
              border: "1.5px solid #e0e0e0", background: "#fff",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#434652",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "8px 20px", borderRadius: 8,
              border: "none", background: "#062244",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────

function DeleteConfirm({ nombre, onCancel, onConfirm, loading }: {
  nombre: string; onCancel: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)" }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32,
        width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 20,
      }}>
        <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#062244" }}>
          Eliminar lead
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 13, color: "#434652", lineHeight: 1.5 }}>
          ¿Eliminar a <strong>{nombre}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end" style={{ gap: 10 }}>
          <button
            type="button" onClick={onCancel} disabled={loading}
            style={{
              padding: "8px 20px", borderRadius: 8,
              border: "1.5px solid #e0e0e0", background: "#fff",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#434652",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button" onClick={onConfirm} disabled={loading}
            style={{
              padding: "8px 20px", borderRadius: 8,
              border: "none", background: "#BA1A1A",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Table header ──────────────────────────────────────

const COL_STYLE: React.CSSProperties = {
  padding: "10px 16px",
  fontFamily: FONT, fontSize: 11, fontWeight: 700,
  color: "#b3b3b3", letterSpacing: "0.06em",
  textTransform: "uppercase",
  minWidth: 0, overflow: "hidden",
};

const CELL_STYLE: React.CSSProperties = {
  padding: "14px 16px",
  fontFamily: FONT, fontSize: 13, color: "#434652",
  display: "flex", alignItems: "center",
  minWidth: 0, overflow: "hidden",
};

// ── Main export ───────────────────────────────────────

type FilterTab = "todos" | "nuevo" | "en_contacto" | "cerrado";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "todos",       label: "Todos" },
  { key: "nuevo",       label: "Por atender" },
  { key: "en_contacto", label: "En contacto" },
  { key: "cerrado",     label: "Cerrado" },
];

export function LeadsList({ initialData }: { initialData: Lead[] }) {
  const { loading, update } = useToast();

  const [items, setItems] = useState<Lead[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("todos");
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItems(initialData); }, [initialData]);

  const filtered = useMemo(() => {
    let list = items;
    if (filterTab !== "todos") list = list.filter(l => l.estado === filterTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(l =>
        l.nombre.toLowerCase().includes(q) ||
        l.contacto.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filterTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [filterTab, search]);

  async function handleEstadoToggle(lead: Lead) {
    const newEstado = nextEstado(lead.estado);
    setItems(prev => prev.map(l => l.id === lead.id ? { ...l, estado: newEstado } : l));
    try {
      await updateLeadAction(lead.id, { estado: newEstado });
    } catch {
      setItems(prev => prev.map(l => l.id === lead.id ? { ...l, estado: lead.estado } : l));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const toastId = loading("Eliminando...");
    try {
      await deleteLeadAction(deleteTarget.id);
      setItems(prev => prev.filter(l => l.id !== deleteTarget.id));
      setDeleteTarget(null);
      update(toastId, "Lead eliminado", "success");
    } catch {
      update(toastId, "Error al eliminar", "error");
    } finally {
      setDeleting(false);
    }
  }

  function handleSaved(updated: Lead) {
    setItems(prev => prev.map(l => l.id === updated.id ? updated : l));
  }

  const gridTemplate = "1fr 64px 1.6fr 100px 120px 88px";

  return (
    <>
      <div className="flex flex-col" style={{ gap: 24 }}>

        {/* Header */}
        <div className="flex flex-col" style={{ gap: 4 }}>
          <h1 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: "#00256d", lineHeight: 1.25 }}>
            Solicitudes de demo
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: "#b3b3b3", lineHeight: 1.5 }}>
            Gestiona y haz seguimiento a todas las solicitudes recibidas.
          </p>
        </div>

        {/* Search + filters row */}
        <div className="flex items-center justify-between" style={{ gap: 16, flexWrap: "wrap" }}>
          {/* Search */}
          <div className="flex items-center" style={{
            gap: 8, background: "#fbfbfb",
            borderRadius: 8, border: "1px solid #e0e0e0",
            padding: "8px 14px", flex: 1, maxWidth: 340,
          }}>
            <Search size={14} strokeWidth={1.75} color="#b3b3b3" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca por nombre, email..."
              style={{
                border: "none", outline: "none", background: "transparent",
                fontFamily: FONT, fontSize: 13, color: "#062244",
                width: "100%",
              }}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center" style={{ gap: 6 }}>
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterTab(key)}
                style={{
                  padding: "6px 14px", borderRadius: 9999,
                  border: filterTab === key ? "1.5px solid #00399d" : "1.5px solid #e0e0e0",
                  background: filterTab === key ? "#00399d" : "#fff",
                  fontFamily: FONT, fontSize: 11, fontWeight: 700,
                  color: filterTab === key ? "#fff" : "#b3b3b3",
                  cursor: "pointer", transition: "all 150ms",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "#fbfbfb", borderRadius: 12,
          border: "1px solid #e0e0e0", overflow: "hidden",
        }}>
          {/* Col headers */}
          <div style={{
            display: "grid", gridTemplateColumns: gridTemplate,
            background: "rgba(244,243,243,0.6)",
            borderBottom: "1px solid rgba(179,179,179,0.15)",
          }}>
            {["Nombre", "Canal", "Dato de contacto", "Fecha", "Estado", "Acciones"].map((h, i) => (
              <div key={h} style={{ ...COL_STYLE, ...(i === 1 ? { padding: "10px 8px", textAlign: "center" } : {}) }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: FONT, fontSize: 13, color: "#b3b3b3" }}>
              No hay solicitudes que coincidan.
            </div>
          ) : paginated.map((lead, i) => (
            <div
              key={lead.id}
              style={{
                display: "grid", gridTemplateColumns: gridTemplate,
                borderTop: i > 0 ? "1px solid rgba(179,179,179,0.1)" : undefined,
                alignItems: "center",
              }}
            >
              {/* Nombre */}
              <div style={{ ...CELL_STYLE, fontWeight: 600, color: "#062244" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.nombre}
                </span>
              </div>

              {/* Canal */}
              <div style={{ ...CELL_STYLE, padding: "14px 8px", justifyContent: "center" }}>
                <Tooltip label={lead.canal === "whatsapp" ? "Abrir WhatsApp" : "Enviar email"}>
                  <CanalIcon canal={lead.canal} contacto={lead.contacto} nombre={lead.nombre} />
                </Tooltip>
              </div>

              {/* Contacto */}
              <div style={{ ...CELL_STYLE }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.contacto}
                </span>
              </div>

              {/* Fecha */}
              <div style={{ ...CELL_STYLE, color: "#b3b3b3" }}>
                {formatDate(lead.created_at)}
              </div>

              {/* Estado */}
              <div style={{ ...CELL_STYLE }}>
                <Tooltip label="Clic para cambiar estado">
                  <EstadoBadge estado={lead.estado} onClick={() => handleEstadoToggle(lead)} />
                </Tooltip>
              </div>

              {/* Acciones */}
              <div style={{ ...CELL_STYLE, gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setDetailLead(lead)}
                  title="Ver detalle"
                  style={{
                    width: 32, height: 32, borderRadius: 9999,
                    background: "rgba(22,163,74,0.1)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Eye size={14} strokeWidth={1.75} color="#16a34a" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(lead)}
                  title="Eliminar"
                  style={{
                    width: 32, height: 32, borderRadius: 9999,
                    background: "rgba(186,26,26,0.08)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} strokeWidth={1.75} color="rgba(186,26,26,0.7)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end" style={{ gap: 4 }}>
            <span style={{ fontFamily: FONT, fontSize: 12, color: "#b3b3b3", marginRight: 8 }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: 30, height: 30, borderRadius: 6,
                border: "1px solid #e0e0e0", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={14} strokeWidth={2} color="#062244" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                style={{
                  width: 30, height: 30, borderRadius: 6,
                  border: currentPage === p ? "1.5px solid #00399d" : "1px solid #e0e0e0",
                  background: currentPage === p ? "#00399d" : "#fff",
                  fontFamily: FONT, fontSize: 12, fontWeight: 700,
                  color: currentPage === p ? "#fff" : "#062244",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: 30, height: 30, borderRadius: 6,
                border: "1px solid #e0e0e0", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={14} strokeWidth={2} color="#062244" />
            </button>
          </div>
        )}

      </div>

      {/* Modals */}
      {detailLead && (
        <LeadModal
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          nombre={deleteTarget.nombre}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </>
  );
}
