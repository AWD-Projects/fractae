"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Shield, type LucideIcon } from "lucide-react";
import { useToast } from "@/components/admin/toaster";
import {
  updateBeneficioAction,
  deleteBeneficioAction,
} from "./actions";
import type { Database } from "@/types/database";

type Beneficio = Database["public"]["Tables"]["beneficios"]["Row"];

function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name];
  if (icon != null && typeof icon !== "string" && typeof icon !== "number" && typeof icon !== "boolean") {
    return icon as LucideIcon;
  }
  return Shield;
}

function BeneficioIcon({ name }: { name: string }) {
  const Icon = resolveIcon(name);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon size={18} strokeWidth={1.75} color="#00399d" />;
}

// ── Toggle ────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 transition-all"
      style={{
        background: "none",
        borderRadius: 4,
        padding: "4px 8px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span style={{
        fontFamily: "var(--font-montserrat), sans-serif",
        fontSize: 10, fontWeight: 700, lineHeight: 1.5, letterSpacing: 0.5,
        color: checked ? "#27b8ff" : "#b3b3b3",
      }}>
        {checked ? "ON" : "OFF"}
      </span>
      <div style={{
        width: 32, height: 16, borderRadius: 9999,
        background: checked ? "#27b8ff" : "#b3b3b3",
        display: "flex", alignItems: "center", padding: 2,
        justifyContent: checked ? "flex-end" : "flex-start",
        transition: "background 0.2s",
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#fbfbfb" }} />
      </div>
    </button>
  );
}

// ── Row ───────────────────────────────────────────

function BeneficioRow({
  item, onEdit, onDelete, onToggle,
}: {
  item: Beneficio;
  onEdit: (item: Beneficio) => void;
  onDelete: (item: Beneficio) => void;
  onToggle: (id: string, visible: boolean) => void;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "#fbfbfb",
        border: "1px solid rgba(179,179,179,0.1)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "#f4f6f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <BeneficioIcon name={item.icono ?? ""} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 14, fontWeight: 600, color: "#1a1c1c", lineHeight: 1.43,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {item.titulo}
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 12, fontWeight: 400, color: "#434652", lineHeight: 1.333,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2,
        }}>
          {item.descripcion}
        </p>
      </div>

      {/* Visibility toggle */}
      <div style={{ flexShrink: 0 }}>
        <Toggle
          checked={item.visible}
          onChange={(v) => onToggle(item.id, v)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center shrink-0" style={{ gap: 16 }}>
        <button
          onClick={() => onEdit(item)}
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 13, fontWeight: 600, color: "#00256d",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(item)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
        >
          <Trash2 size={16} strokeWidth={1.75} color="rgba(186,26,26,0.7)" />
        </button>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────

function DeleteConfirm({ item, onCancel, onConfirm, loading }: {
  item: Beneficio; onCancel: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6"
      style={{ background: "rgba(0,0,0,0.45)" }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400,
        maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        <h2 style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 16, fontWeight: 700, color: "#062244" }}>
          Eliminar beneficio
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#434652", lineHeight: 1.5 }}>
          ¿Estás seguro de eliminar <strong>{item.titulo}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "1.5px solid #e0e0e0",
              background: "#fff", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, fontWeight: 600, color: "#434652",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#BA1A1A", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, fontWeight: 600, color: "#fff",
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

// ── Main export ───────────────────────────────────

export function BeneficiosList({ initialData }: { initialData: Beneficio[] }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const basePath = `/${params.locale}/admin/beneficios`;
  const { success, error, loading, update } = useToast();

  const [items, setItems] = useState(initialData);
  const [deleteItem, setDeleteItem] = useState<Beneficio | null>(null);
  const [deleting, setDeleting] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItems(initialData); }, [initialData]);

  async function handleToggle(id: string, visible: boolean) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, visible } : i));
    try {
      await updateBeneficioAction(id, { visible });
      success(visible ? "Beneficio activado" : "Beneficio ocultado");
    } catch {
      setItems(prev => prev.map(i => i.id === id ? { ...i, visible: !visible } : i));
      error("Error al cambiar visibilidad");
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    const toastId = loading("Eliminando...");
    try {
      await deleteBeneficioAction(deleteItem.id);
      setItems(prev => prev.filter(i => i.id !== deleteItem.id));
      setDeleteItem(null);
      update(toastId, "Beneficio eliminado", "success");
    } catch {
      update(toastId, "Error al eliminar", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col" style={{ gap: 32 }}>

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col" style={{ gap: 4 }}>
            <h1 style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 24, fontWeight: 800, color: "#00256d", lineHeight: 1.25,
            }}>
              Beneficios
            </h1>
            <p style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12, fontWeight: 400, color: "#b3b3b3", lineHeight: 1.5,
            }}>
              Estos beneficios aparecen en la sección de beneficios de la landing.
            </p>
          </div>
          <button
            onClick={() => router.push(`${basePath}/nueva`)}
            className="flex items-center shrink-0 transition-opacity hover:opacity-80"
            style={{
              gap: 8, background: "#062244", color: "#fbfbfb", borderRadius: 9999,
              padding: "10px 16px", fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
            }}
          >
            <Plus size={14} strokeWidth={2} />
            <span className="hidden sm:inline">Nuevo beneficio</span>
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col" style={{ gap: 8 }}>
          {items.map(item => (
            <BeneficioRow
              key={item.id}
              item={item}
              onEdit={(i) => router.push(`${basePath}/${i.id}/editar`)}
              onDelete={setDeleteItem}
              onToggle={handleToggle}
            />
          ))}
          {items.length === 0 && (
            <div style={{
              textAlign: "center", padding: "48px 24px",
              fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#b3b3b3",
            }}>
              No hay beneficios aún. Crea el primero.
            </div>
          )}
        </div>

      </div>

      {/* Delete confirm */}
      {deleteItem && (
        <DeleteConfirm item={deleteItem} onCancel={() => setDeleteItem(null)}
          onConfirm={handleDelete} loading={deleting} />
      )}
    </>
  );
}
