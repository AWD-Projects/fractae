import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { FuncionalidadesList } from './funcionalidades-list'

export default async function FuncionalidadesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data } = await supabase
    .from('funcionalidades')
    .select('*')
    .order('orden', { ascending: true })

  return <FuncionalidadesList initialData={data ?? []} />
}
