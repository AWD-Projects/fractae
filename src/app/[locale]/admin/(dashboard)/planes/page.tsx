import { getAdminPlanesConfig } from '@/lib/supabase/queries'
import { PlanesEditor } from './planes-editor'

export default async function PlanesAdminPage() {
  const config = await getAdminPlanesConfig()
  return <PlanesEditor config={config} />
}
