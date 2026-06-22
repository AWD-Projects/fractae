"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "@/components/admin/icon-picker";
import { useToast } from "@/components/admin/toaster";
import { beneficioSchema, type BeneficioFormValues } from "./beneficio-schema";
import {
  createBeneficioAction,
  updateBeneficioAction,
  updateBeneficioTraduccionAction,
} from "./actions";

type EditLocale = "es" | "en" | "fr";

type TraduccionData = {
  titulo?: string;
  descripcion?: string;
};

interface BeneficioFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
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

function buildDefaults(
  locale: EditLocale,
  initialData: BeneficioFormProps["initialData"]
): BeneficioFormValues {
  if (locale === "es") {
    return {
      titulo: initialData?.titulo ?? "",
      descripcion: initialData?.descripcion ?? "",
      icono: initialData?.icono ?? "",
      visible: initialData?.visible ?? true,
    };
  }
  const t = initialData?.traducciones?.[locale] ?? {};
  return {
    titulo: t.titulo ?? "",
    descripcion: t.descripcion ?? "",
    icono: initialData?.icono ?? "",
    visible: initialData?.visible ?? true,
  };
}

function isDraftComplete(draft: BeneficioFormValues, key: EditLocale): boolean {
  return !!(
    draft.titulo.trim() &&
    draft.descripcion.trim() &&
    (key !== "es" || draft.icono)
  );
}

export function BeneficioForm({ mode, initialData }: BeneficioFormProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const listPath = `/${params.locale}/admin/beneficios`;
  const { loading, update, error: toastError } = useToast();

  const [selectedLocale, setSelectedLocale] = useState<EditLocale>("es");
  const isTranslation = selectedLocale !== "es";

  const drafts = useRef<Record<EditLocale, BeneficioFormValues>>({
    es: buildDefaults("es", initialData),
    en: buildDefaults("en", initialData),
    fr: buildDefaults("fr", initialData),
  });

  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm<BeneficioFormValues>({
    resolver: zodResolver(beneficioSchema),
    defaultValues: drafts.current.es,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedTitulo = watch("titulo");
  const watchedDescripcion = watch("descripcion");
  const watchedIcono = watch("icono");

  function currentDraftComplete(): boolean {
    return isDraftComplete(
      { titulo: watchedTitulo, descripcion: watchedDescripcion, icono: watchedIcono, visible: true },
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

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "create") {
      drafts.current[selectedLocale] = getValues();

      const firstIncomplete = LOCALES.find(({ key }) =>
        !isDraftComplete(drafts.current[key], key)
      );

      if (firstIncomplete && firstIncomplete.key !== selectedLocale) {
        handleLocaleSwitch(firstIncomplete.key);
        return;
      }
    }

    handleSubmit(onSubmit)(e);
  }

  async function onSubmit(values: BeneficioFormValues) {
    drafts.current[selectedLocale] = values;

    if (mode === "create") {
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
        const traducciones = {
          en: { titulo: en.titulo.trim(), descripcion: en.descripcion.trim() },
          fr: { titulo: fr.titulo.trim(), descripcion: fr.descripcion.trim() },
        };

        await createBeneficioAction({
          titulo: es.titulo.trim(),
          descripcion: es.descripcion.trim(),
          icono: es.icono,
          visible: true,
          traducciones,
        });

        update(toastId, "Beneficio creado", "success");
        router.push(listPath);
        router.refresh();
      } else if (initialData) {
        if (isTranslation) {
          await updateBeneficioTraduccionAction(
            initialData.id,
            selectedLocale as "en" | "fr",
            {
              titulo: values.titulo.trim(),
              descripcion: values.descripcion.trim(),
            }
          );
        } else {
          await updateBeneficioAction(initialData.id, {
            titulo: es.titulo.trim(),
            descripcion: es.descripcion.trim(),
            icono: es.icono,
          });
        }

        update(
          toastId,
          isTranslation ? `Traducción ${selectedLocale.toUpperCase()} guardada` : "Cambios guardados",
          "success"
        );
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
            Beneficios
          </button>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 12, color: "#b3b3b3" }}>›</span>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: 12, fontWeight: 500, color: "#434652" }}>
            {mode === "create" ? "Nuevo beneficio" : initialData?.titulo ?? "Editar beneficio"}
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
          {mode === "create" ? "Nuevo beneficio" : "Editar beneficio"}
        </h1>
      </div>

      {/* Form card */}
      <div
        className="p-4 sm:p-8"
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
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
              ? "Ícono se comparte con ES"
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
            placeholder="Menos carga administrativa"
            error={errors.titulo?.message}
            {...register("titulo")}
          />

          {/* Descripción */}
          <Textarea
            id="descripcion"
            label="Descripción"
            placeholder="Automatiza tareas repetitivas y evita depender de archivos dispersos."
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

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3" style={{ paddingTop: 8 }}>
            <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => router.push(listPath)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              disabled={saving || (mode === "create" && !allComplete)}
              title={mode === "create" && !allComplete ? "Completa los 3 idiomas para guardar" : undefined}
            >
              {saving
                ? "Guardando..."
                : mode === "create"
                ? "Crear beneficio"
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
