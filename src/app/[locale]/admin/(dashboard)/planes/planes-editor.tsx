"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/admin/toaster";
import { PlansSection } from "@/components/landing/plans-section";
import {
  updatePlanesConfigAction,
  updatePlanesConfigTraduccionAction,
} from "./actions";
import type { Database } from "@/types/database";

type PlanesConfigRow = Database["public"]["Tables"]["planes_config"]["Row"];
type EditLocale = "es" | "en" | "fr";

// ── Schema ───────────────────────────────────────────

const planesSchema = z.object({
  titulo:      z.string().min(1, "Requerido"),
  subtitulo:   z.string().min(1, "Requerido"),
  descripcion: z.string(),
  cta_texto:   z.string().min(1, "Requerido"),
  trust_items: z.array(z.object({ value: z.string() })),
});

type PlanesFormValues = z.infer<typeof planesSchema>;

// ── Constants ────────────────────────────────────────

const LOCALES: { key: EditLocale; label: string }[] = [
  { key: "es", label: "ES" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
];

// ── Helpers ──────────────────────────────────────────

function buildInitial(row: PlanesConfigRow, locale: EditLocale): PlanesFormValues {
  if (locale === "es") {
    return {
      titulo:      row.titulo,
      subtitulo:   row.subtitulo,
      descripcion: row.descripcion ?? "",
      cta_texto:   row.cta_texto,
      trust_items: row.trust_items.map((v) => ({ value: v })),
    };
  }
  const t =
    (row.traducciones as Record<string, Record<string, unknown>> | null)?.[locale] ?? {};
  return {
    titulo:      (t.titulo as string) ?? "",
    subtitulo:   (t.subtitulo as string) ?? "",
    descripcion: (t.descripcion as string) ?? "",
    cta_texto:   (t.cta_texto as string) ?? "",
    trust_items: ((t.trust_items as string[]) ?? []).map((v) => ({ value: v })),
  };
}

function isDraftComplete(draft: PlanesFormValues): boolean {
  return !!(draft.titulo.trim() && draft.subtitulo.trim() && draft.cta_texto.trim());
}

// ── Main component ───────────────────────────────────

export function PlanesEditor({ config }: { config: PlanesConfigRow }) {
  const params = useParams<{ locale: string }>();
  const { loading, update } = useToast();

  const [selectedLocale, setSelectedLocale] = useState<EditLocale>("es");
  const [saving, setSaving] = useState(false);
  const isTranslation = selectedLocale !== "es";

  const drafts = useRef<Record<EditLocale, PlanesFormValues>>({
    es: buildInitial(config, "es"),
    en: buildInitial(config, "en"),
    fr: buildInitial(config, "fr"),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PlanesFormValues>({
    resolver: zodResolver(planesSchema),
    defaultValues: drafts.current.es,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "trust_items" });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watched = watch();

  function isLocaleComplete(key: EditLocale): boolean {
    if (key === selectedLocale) return isDraftComplete({ ...watched });
    return isDraftComplete(drafts.current[key]);
  }

  function handleLocaleSwitch(next: EditLocale) {
    if (next === selectedLocale) return;
    drafts.current[selectedLocale] = getValues();
    reset(drafts.current[next]);
    setSelectedLocale(next);
  }

  async function onSubmit(values: PlanesFormValues) {
    drafts.current[selectedLocale] = values;
    setSaving(true);
    const toastId = loading("Guardando...");
    const trust_items = values.trust_items.map((i) => i.value).filter(Boolean);
    try {
      if (selectedLocale === "es") {
        await updatePlanesConfigAction({
          titulo:      values.titulo.trim(),
          subtitulo:   values.subtitulo.trim(),
          descripcion: values.descripcion.trim() || null,
          cta_texto:   values.cta_texto.trim(),
          trust_items,
        });
      } else {
        await updatePlanesConfigTraduccionAction(selectedLocale, {
          titulo:      values.titulo.trim(),
          subtitulo:   values.subtitulo.trim(),
          descripcion: values.descripcion.trim(),
          cta_texto:   values.cta_texto.trim(),
          trust_items,
        });
      }
      update(
        toastId,
        isTranslation
          ? `Traducción ${selectedLocale.toUpperCase()} guardada`
          : "Cambios guardados",
        "success"
      );
    } catch {
      update(toastId, "Error al guardar. Intenta de nuevo.", "error");
    } finally {
      setSaving(false);
    }
  }

  const previewData = {
    id:           config.id,
    titulo:       watched.titulo ?? "",
    subtitulo:    watched.subtitulo ?? "",
    descripcion:  watched.descripcion?.trim() || null,
    cta_texto:    watched.cta_texto ?? "",
    trust_items:  (watched.trust_items ?? []).map((i) => i.value).filter(Boolean),
    traducciones: config.traducciones,
    updated_at:   config.updated_at,
  };

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>

      {/* Breadcrumb */}
      <nav className="flex items-center" style={{ gap: 6 }}>
        <Link
          href={`/${params.locale}/admin`}
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12, fontWeight: 500, color: "#b3b3b3",
            textDecoration: "none",
          }}
        >
          Admin
        </Link>
        <ChevronRight size={12} color="#b3b3b3" />
        <span style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 12, fontWeight: 600, color: "#062244",
        }}>
          Planes
        </span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col" style={{ gap: 4 }}>
        <h1 style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 24, fontWeight: 800, color: "#00256d", lineHeight: 1.25,
        }}>
          Sección Planes
        </h1>
        <p style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 12, fontWeight: 400, color: "#b3b3b3", lineHeight: 1.5,
        }}>
          Edita el contenido en los 3 idiomas. El preview se actualiza en tiempo real.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row items-start" style={{ gap: 24 }}>

        {/* ── Left: form ─────────────────────────── */}
        <div
          className="w-full md:sticky"
          style={{
            flex: 1,
            minWidth: 0,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            top: 24,
          }}
        >
          {/* Language switcher — same pattern as beneficios/funcionalidades */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {LOCALES.map(({ key, label }) => {
              const active   = selectedLocale === key;
              const complete = isLocaleComplete(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLocaleSwitch(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 14px",
                    borderRadius: 9999,
                    border: active ? "1.5px solid #00399d" : "1.5px solid #e0e0e0",
                    background: active ? "#00399d" : "#fff",
                    color: active ? "#fff" : complete ? "#062244" : "#b3b3b3",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                >
                  {label}
                  {complete && !active && (
                    <CheckCircle2 size={11} color="#16a34a" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
            {isTranslation && (
              <span style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 11,
                color: "#b3b3b3",
                marginLeft: 4,
              }}>
                Guardar cada idioma por separado
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <Input
              id="titulo"
              label="Título"
              placeholder="Ej: Planes diseñados para tu fraccionamiento"
              error={errors.titulo?.message}
              {...register("titulo")}
            />

            <Input
              id="subtitulo"
              label="Subtítulo"
              placeholder="Ej: Desde $999/mes"
              error={errors.subtitulo?.message}
              {...register("subtitulo")}
            />

            <Textarea
              id="descripcion"
              label="Descripción"
              placeholder="Descripción opcional debajo del subtítulo"
              rows={3}
              error={errors.descripcion?.message}
              {...register("descripcion")}
            />

            <Input
              id="cta_texto"
              label="Texto del botón (CTA)"
              placeholder="Ej: Agendar demo"
              error={errors.cta_texto?.message}
              {...register("cta_texto")}
            />

            {/* Trust items */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              <span style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 14, fontWeight: 500, color: "#062244",
              }}>
                Items de confianza
              </span>
              <div className="flex flex-col" style={{ gap: 8 }}>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center" style={{ gap: 8 }}>
                    <div className="flex-1">
                      <Input
                        placeholder={`Item ${index + 1}`}
                        {...register(`trust_items.${index}.value`)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      style={{
                        background: "none", border: "none",
                        cursor: "pointer", padding: 4, lineHeight: 0, flexShrink: 0,
                      }}
                    >
                      <Trash2 size={16} strokeWidth={1.75} color="rgba(186,26,26,0.7)" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="flex items-center transition-opacity hover:opacity-70"
                style={{
                  gap: 6, background: "none", border: "1.5px dashed #b3b3b3",
                  borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12, fontWeight: 600, color: "#b3b3b3",
                  alignSelf: "flex-start",
                }}
              >
                <Plus size={14} strokeWidth={2} />
                Agregar item
              </button>
            </div>

            {/* Save */}
            <div className="flex justify-end" style={{ paddingTop: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 28px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: "#062244",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 12, fontWeight: 600, color: "#fbfbfb",
                  opacity: saving ? 0.7 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {saving
                  ? "Guardando..."
                  : isTranslation
                  ? `Guardar ${selectedLocale.toUpperCase()}`
                  : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right: live preview ─────────────────── */}
        <div className="flex flex-col w-full md:flex-1 min-w-0" style={{ gap: 12 }}>
          <span style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 11, fontWeight: 700, color: "#b3b3b3",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Vista previa
          </span>
          <PlansSection data={previewData} />
        </div>

      </div>
    </div>
  );
}
