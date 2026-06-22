import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { BeneficiosList } from './beneficios-list'

export default async function BeneficiosPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data } = await supabase
    .from('beneficios')
    .select('*')
    .order('orden', { ascending: true })

  return <BeneficiosList initialData={data ?? []} />
}
