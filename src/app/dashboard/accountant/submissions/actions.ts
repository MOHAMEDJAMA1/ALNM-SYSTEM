'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/utils/auth'
import { ReviewSubmissionSchema } from '@/utils/validation'
import { logAction } from '@/utils/audit'

export async function getReviewSummary() {
  await verifySession(['accountant'])
  const supabase = await createClient()

  // Fetch all submissions
  const { data: submissions } = await supabase
    .from('cash_submissions')
    .select('amount, status')

  const totalSubmitted = submissions?.filter(s => s.status === 'verified').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0
  
  // Note: For a true "collected" total, we'd sum sales/payments. 
  // For the summary cards, we use the submitted totals.
  const totalCollected = totalSubmitted // Placeholder for now, can be improved with real sales aggregation
  const totalDifference = totalCollected - totalSubmitted

  return {
    totalCollected,
    totalSubmitted,
    totalDifference,
    pendingCount
  }
}

export async function updateSubmissionStatus(id: string, status: string, note?: string) {
  const { role } = await verifySession(['accountant'])
  const supabase = await createClient()

  const validated = ReviewSubmissionSchema.safeParse({ id, status })
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message)
  }

  const { error } = await supabase
    .from('cash_submissions')
    .update({ 
      status: validated.data.status, 
      note: note || undefined,
      updated_at: new Date().toISOString()
    })
    .eq('id', validated.data.id)

  if (error) {
    console.error('Update Status Error:', error)
    throw new Error('Failed to update submission status')
  }

  await logAction(status === 'verified' ? 'VERIFY_SUBMISSION' : 'DISPUTE_SUBMISSION', {
    targetTable: 'cash_submissions',
    targetId: id,
    details: { status, note }
  })

  revalidatePath('/dashboard/accountant/submissions')
}
