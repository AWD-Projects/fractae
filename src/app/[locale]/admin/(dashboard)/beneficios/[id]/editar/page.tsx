import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database";
import { BeneficioForm } from "../../beneficio-form";

export default async function EditarBeneficioPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("beneficios")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    redirect(`/${locale}/admin/beneficios`);
  }

  return (
    <BeneficioForm
      mode="edit"
      initialData={{
        id: data.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        icono: data.icono ?? "",
        visible: data.visible,
        traducciones: (data.traducciones as Record<string, { titulo?: string; descripcion?: string }>) ?? {},
      }}
    />
  );
}
