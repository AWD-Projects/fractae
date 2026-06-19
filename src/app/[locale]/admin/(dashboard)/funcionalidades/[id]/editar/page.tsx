import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database";
import { FuncionalidadForm } from "../../funcionalidad-form";

export default async function EditarFuncionalidadPage({
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
    .from("funcionalidades")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    redirect(`/${locale}/admin/funcionalidades`);
  }

  return (
    <FuncionalidadForm
      mode="edit"
      initialData={{
        id: data.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        icono: data.icono ?? "",
        bullets: (data.bullets as string[]) ?? [],
        imagen_url: data.imagen_url,
        imagen_path: data.imagen_path,
        visible: data.visible,
        traducciones: (data.traducciones as Record<string, { titulo?: string; descripcion?: string; bullets?: string[] }>) ?? {},
      }}
    />
  );
}
