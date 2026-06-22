'use server'

import { updateLead, deleteLead } from '@/lib/supabase/mutations'
import type { LeadUpdate } from '@/types'

export async function updateLeadAction(id: string, data: LeadUpdate) {
  return updateLead(id, data)
}

export async function deleteLeadAction(id: string) {
  return deleteLead(id)
}
