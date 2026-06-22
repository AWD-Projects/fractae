"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  GripVertical, Plus, Trash2,
} from "lucide-react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/toaster";
import {
  updateFuncionalidadAction,
  deleteFuncionalidadAction,
  reorderFuncionalidadesAction,
} from "./actions";
import type { Database } from "@/types/database";

type Funcionalidad = Database["public"]["Tables"]["funcionalidades"]["Row"];

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
        transition: "background 0.2s, justify-content 0.2s",
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#fbfbfb" }} />
      </div>
    </button>
  );
}

// ── Sortable row ──────────────────────────────────

function SortableRow({
  item, onEdit, onDelete, onToggle, isPending,
}: {
  item: Funcionalidad;
  onEdit: (item: Funcionalidad) => void;
  onDelete: (item: Funcionalidad) => void;
  onToggle: (id: string, visible: boolean) => void;
  isPending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : undefined,
        borderRadius: 12,
        background: "#fbfbfb",
        border: "1px solid rgba(179,179,179,0.1)",
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
        style={{ color: "#b3b3b3", background: "none", border: "none", padding: 0, lineHeight: 0 }}
        tabIndex={-1}
      >
        <GripVertical size={16} strokeWidth={1.75} />
      </button>

      {/* Thumbnail — hidden on mobile */}
      <div className="hidden sm:flex" style={{
        width: 64, height: 40, borderRadius: 4, flexShrink: 0, overflow: "hidden",
        background: item.visible ? "#eeeeed" : "#f4f3f3",
        border: "1px solid rgba(196,198,213,0.2)",
        alignItems: "center", justifyContent: "center",
      }}>
        {item.imagen_url && (
          <Image src={item.imagen_url} alt={item.titulo} width={64} height={40}
            className="object-cover w-full h-full" />
        )}
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
          fontSize: 12, fontWeight: 500, color: "#434652", lineHeight: 1.333,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2,
        }}>
          {item.descripcion}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center shrink-0" style={{ gap: 12 }}>
        <Toggle checked={item.visible} onChange={(v) => onToggle(item.id, v)} disabled={isPending} />

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
  item: Funcionalidad; onCancel: () => void; onConfirm: () => void; loading: boolean;
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
          Eliminar funcionalidad
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#434652", lineHeight: 1.5 }}>
          ¿Estás seguro de eliminar <strong>{item.titulo}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button type="button" size="sm" onClick={onConfirm} disabled={loading}
            className="bg-error hover:bg-red-700 border-0 text-white">
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────

export function FuncionalidadesList({ initialData }: { initialData: Funcionalidad[] }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const basePath = `/${params.locale}/admin/funcionalidades`;
  const { success, error, loading, update } = useToast();

  const [items, setItems] = useState(initialData);
  const [deleteItem, setDeleteItem] = useState<Funcionalidad | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [isPending, startTransition] = useTransition();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItems(initialData); }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex(i => i.id === active.id);
    const newIdx = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIdx, newIdx);
    setItems(reordered);
    startTransition(async () => {
      try {
        await reorderFuncionalidadesAction(
          reordered.map((item, idx) => ({ id: item.id, orden: idx + 1 }))
        );
        success("Orden guardado");
      } catch {
        error("Error al guardar el orden");
      }
    });
  }

  async function handleToggle(id: string, visible: boolean) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, visible } : i));
    try {
      await updateFuncionalidadAction(id, { visible });
      success(visible ? "Funcionalidad activada" : "Funcionalidad ocultada");
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
      await deleteFuncionalidadAction(deleteItem.id, deleteItem.imagen_path);
      setItems(prev => prev.filter(i => i.id !== deleteItem.id));
      setDeleteItem(null);
      update(toastId, "Funcionalidad eliminada", "success");
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
              Funcionalidades
            </h1>
            <p style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12, fontWeight: 400, color: "#b3b3b3", lineHeight: 1.5,
            }}>
              Estas secciones aparecen en el scroll de funcionalidades de la landing.
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
            <span className="hidden sm:inline">Nueva funcionalidad</span>
          </button>
        </div>

        {/* Sortable list */}
        <DndContext id="funcionalidades-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {items.map(item => (
                <SortableRow
                  key={item.id}
                  item={item}
                  onEdit={(i) => router.push(`${basePath}/${i.id}/editar`)}
                  onDelete={setDeleteItem}
                  onToggle={handleToggle}
                  isPending={isPending}
                />
              ))}
              {items.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "48px 24px",
                  fontFamily: "var(--font-montserrat), sans-serif", fontSize: 13, color: "#b3b3b3",
                }}>
                  No hay funcionalidades aún. Crea la primera.
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

      </div>

      {/* Delete confirm */}
      {deleteItem && (
        <DeleteConfirm item={deleteItem} onCancel={() => setDeleteItem(null)}
          onConfirm={handleDelete} loading={deleting} />
      )}
    </>
  );
}
