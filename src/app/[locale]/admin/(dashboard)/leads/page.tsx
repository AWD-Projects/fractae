import { getLeads } from '@/lib/supabase/queries'
import { LeadsList } from './leads-list'

export default async function LeadsAdminPage() {
  const leads = await getLeads()
  return <LeadsList initialData={leads} />
}
