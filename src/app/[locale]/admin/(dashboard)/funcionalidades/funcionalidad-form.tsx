"use client";

import { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "@/components/admin/icon-picker";
import { useToast } from "@/components/admin/toaster";
import { funcionalidadSchema, type FuncionalidadFormValues } from "./funcionalidad-schema";
import {
  createFuncionalidadAction,
  updateFuncionalidadAction,
  updateFuncionalidadTraduccionAction,
  uploadFeatureImageAction,
} from "./actions";

type EditLocale = "es" | "en" | "fr";

type TraduccionData = {
  titulo?: string;
  descripcion?: string;
  bullets?: string[];
};

interface FuncionalidadFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    bullets: string[];
    imagen_url: string | null;
    imagen_path: string | null;
    visible: boolean;
    traducciones: Record<string, TraduccionData>;
  };
}

const LOCALES: { key: EditLocale; label: string }[] = [
  { key: "es", label: "ES" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
];

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontSize: 12,
  color: "#DC2626",
  marginTop: 2,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#434652",
};

function buildDefaults(
  locale: EditLocale,
  initialData: FuncionalidadFormProps["initialData"]
): FuncionalidadFormValues {
  if (locale === "es") {
    return {
      titulo: initialData?.titulo ?? "",
      descripcion: initialData?.descripcion ?? "",
      icono: initialData?.icono ?? "",
      bullets: (initialData?.bullets ?? []).map((v) => ({ value: v })),
      visible: initialData?.visible ?? true,
    };
  }
  const t = initialData?.traducciones?.[locale] ?? {};
  return {
    titulo: t.titulo ?? "",
    descripcion: t.descripcion ?? "",
    icono: initialData?.icono ?? "",
    bullets: (t.bullets ?? []).map((v) => ({ value: v })),
    visible: initialData?.visible ?? true,
  };
}

function buildBulletStrings(values: FuncionalidadFormValues) {
  return values.bullets.map((b) => b.value.trim()).filter(Boolean);
}

function isDraftComplete(draft: FuncionalidadFormValues, key: EditLocale): boolean {
  return !!(
    draft.titulo.trim() &&
    draft.descripcion.trim() &&
    (key !== "es" || draft.icono)
  );
}

export function FuncionalidadForm({ mode, initialData }: FuncionalidadFormProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const listPath = `/${params.locale}/admin/funcionalidades`;
  const { loading, update, error: toastError } = useToast();

  const [selectedLocale, setSelectedLocale] = useState<EditLocale>("es");
  const isTranslation = selectedLocale !== "es";

  const drafts = useRef<Record<EditLocale, FuncionalidadFormValues>>({
    es: buildDefaults("es", initialData),
    en: buildDefaults("en", initialData),
    fr: buildDefaults("fr", initialData),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imagen_url ?? null
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm<FuncionalidadFormValues>({
    resolver: zodResolver(funcionalidadSchema),
    defaultValues: drafts.current.es,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "bullets" });

  // Live watch for tab completion indicators on the current tab
  const watchedTitulo = watch("titulo");
  const watchedDescripcion = watch("descripcion");
  const watchedIcono = watch("icono");

  function currentDraftComplete(): boolean {
    return isDraftComplete(
      { titulo: watchedTitulo, descripcion: watchedDescripcion, icono: watchedIcono, bullets: [], visible: true },
      selectedLocale
    );
  }

  function isLocaleComplete(key: EditLocale): boolean {
    if (key === selectedLocale) return currentDraftComplete();
    return isDraftComplete(drafts.current[key], key);
  }

  function handleLocaleSwitch(next: EditLocale) {
    if (next === selectedLocale) return;
    drafts.current[selectedLocale] = getValues();
    const nextDraft = drafts.current[next];
    reset({
      ...nextDraft,
      icono: drafts.current.es.icono,
    });
    setSelectedLocale(next);
  }

  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ["image/png", "image/jpeg"];

  function validateImage(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) return "Solo se permiten imágenes PNG o JPG.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `La imagen no puede superar ${MAX_SIZE_MB} MB.`;
    return null;
  }

  // Pre-handleSubmit: check other locales and switch if needed (before Zod runs)
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "create") {
      // Flush current tab so we can inspect all drafts
      drafts.current[selectedLocale] = getValues();

      const firstIncomplete = LOCALES.find(({ key }) =>
        !isDraftComplete(drafts.current[key], key)
      );

      if (firstIncomplete && firstIncomplete.key !== selectedLocale) {
        // Switch to the incomplete tab so the user can fill it in
        handleLocaleSwitch(firstIncomplete.key);
        return;
      }
    }

    handleSubmit(onSubmit)(e);
  }

  async function onSubmit(values: FuncionalidadFormValues) {
    // Flush current tab into drafts
    drafts.current[selectedLocale] = values;

    if (mode === "create") {
      // Final guard: all 3 must be complete
      const firstIncomplete = LOCALES.find(({ key }) =>
        !isDraftComplete(drafts.current[key], key)
      );
      if (firstIncomplete) {
        toastError(`Completa los campos en ${firstIncomplete.label} antes de guardar`);
        handleLocaleSwitch(firstIncomplete.key);
        return;
      }
    }

    setSaving(true);
    const toastId = loading("Guardando...");
    try {
      const es = drafts.current.es;
      const en = drafts.current.en;
      const fr = drafts.current.fr;

      if (mode === "create") {
        const traducciones: Record<string, TraduccionData> = {
          en: {
            titulo: en.titulo.trim(),
            descripcion: en.descripcion.trim(),
            bullets: buildBulletStrings(en),
          },
          fr: {
            titulo: fr.titulo.trim(),
            descripcion: fr.descripcion.trim(),
            bullets: buildBulletStrings(fr),
          },
        };

        const created = await createFuncionalidadAction({
          titulo: es.titulo.trim(),
          descripcion: es.descripcion.trim(),
          icono: es.icono,
          bullets: buildBulletStrings(es),
          visible: true,
          traducciones,
        });
        if (imageFile && created) {
          const fd = new FormData();
          fd.append("file", imageFile);
          await uploadFeatureImageAction(created.id, fd);
        }

        update(toastId, "Funcionalidad creada", "success");
        router.push(listPath);
        router.refresh();
      } else if (initialData) {
        if (isTranslation) {
          await updateFuncionalidadTraduccionAction(
            initialData.id,
            selectedLocale as "en" | "fr",
            {
              titulo: values.titulo.trim(),
              descripcion: values.descripcion.trim(),
              bullets: buildBulletStrings(values),
            }
          );
        } else {
          await updateFuncionalidadAction(initialData.id, {
            titulo: es.titulo.trim(),
            descripcion: es.descripcion.trim(),
            icono: es.icono,
            bullets: buildBulletStrings(es),
          });
          if (imageFile) {
            const fd = new FormData();
            fd.append("file", imageFile);
            await uploadFeatureImageAction(initialData.id, fd);
          }
        }

        update(
          toastId,
          isTranslation ? `Traducción ${selectedLocale.toUpperCase()} guardada` : "Cambios guardados",
          "success"
        );
        // Stay on edit page
      }
    } catch {
      update(toastId, "Error al guardar. Intenta de nuevo.", "error");
    } finally {
      setSaving(false);
    }
  }

  const allComplete = mode === "create" && LOCALES.every(({ key }) => isLocaleComplete(key));

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      {/* Breadcrumb + title */}
      <div className="flex flex-col" style={{ gap: 6 }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={() => router.push(listPath)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#b3b3b3",
            }}
          >
            Funcionalidades
          </button>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 12, color: "#b3b3b3" }}>›</span>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 12, fontWeight: 500, color: "#434652" }}>
            {mode === "create" ? "Nueva funcionalidad" : initialData?.titulo ?? "Editar funcionalidad"}
          </span>
        </nav>
        <h1
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "#00256d",
            lineHeight: 1.25,
          }}
        >
          {mode === "create" ? "Nueva funcionalidad" : "Editar funcionalidad"}
        </h1>
      </div>

      {/* Form card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Language switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {LOCALES.map(({ key, label }) => {
            const active = selectedLocale === key;
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

          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 11,
              color: "#b3b3b3",
              marginLeft: 4,
            }}
          >
            {mode === "create"
              ? "Los 3 idiomas son obligatorios para guardar"
              : isTranslation
              ? "Ícono e imagen se comparten con ES"
              : ""}
          </span>
        </div>

        <form
          onSubmit={handleFormSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Título */}
          <Input
            id="titulo"
            label="Título"
            placeholder="Control de accesos"
            error={errors.titulo?.message}
            {...register("titulo")}
          />

          {/* Descripción */}
          <Textarea
            id="descripcion"
            label="Descripción"
            placeholder="Gestiona quién entra y sale con total seguridad..."
            rows={3}
            error={errors.descripcion?.message}
            {...register("descripcion")}
          />

          {/* Ícono — ES only */}
          {!isTranslation && (
            <div className="flex flex-col" style={{ gap: 4 }}>
              <Controller
                name="icono"
                control={control}
                render={({ field }) => (
                  <IconPicker
                    value={field.value}
                    onChange={(name) =>
                      setValue("icono", name, { shouldValidate: true, shouldDirty: true })
                    }
                  />
                )}
              />
              {errors.icono && <p style={errorStyle}>{errors.icono.message}</p>}
            </div>
          )}

          {/* Imagen — ES only */}
          {!isTranslation && (
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label style={labelStyle}>Imagen</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-primary"
                style={{
                  border: "1.5px dashed #d9d9d9",
                  borderRadius: 8,
                  padding: 16,
                  background: "#fafafa",
                  minHeight: 80,
                }}
              >
                {imagePreview ? (
                  <div className="relative rounded overflow-hidden" style={{ width: 120, height: 75 }}>
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <Upload size={22} color="#b3b3b3" />
                    <span style={{ fontSize: 12, color: "#b3b3b3", fontFamily: "var(--font-montserrat), sans-serif" }}>
                      Click para subir imagen
                    </span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const err = validateImage(file);
                    if (err) { setImageError(err); e.target.value = ""; return; }
                    setImageError(null);
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  style={{
                    alignSelf: "flex-start",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: 12,
                    color: "#DC2626",
                    padding: 0,
                  }}
                >
                  Quitar imagen
                </button>
              )}
              {imageError && <p style={errorStyle}>{imageError}</p>}
            </div>
          )}

          {/* Bullets */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <label style={labelStyle}>
              Bullets <span style={{ color: "#b3b3b3", fontSize: 11 }}>(opcional)</span>
            </label>
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input
                  placeholder={`Punto ${i + 1}`}
                  className="flex-1 outline-none transition-colors duration-200 focus:border-primary focus:border-[1.5px]"
                  style={{
                    borderRadius: 6,
                    border: "1px solid #d9d9d9",
                    padding: "10px 14px",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: 14,
                    color: "#062244",
                    background: "#fff",
                  }}
                  {...register(`bullets.${i}.value`)}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#b3b3b3", lineHeight: 0, flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ value: "" })}
              style={{
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#00399d",
              }}
            >
              + Agregar punto
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end" style={{ paddingTop: 8 }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => router.push(listPath)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={saving || (mode === "create" && !allComplete)}
              title={mode === "create" && !allComplete ? "Completa los 3 idiomas para guardar" : undefined}
            >
              {saving
                ? "Guardando..."
                : mode === "create"
                ? "Crear funcionalidad"
                : isTranslation
                ? `Guardar ${selectedLocale.toUpperCase()}`
                : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
