'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/utils/auth'
import { getReportsSummary } from './reports/actions'

export async function getAccountantOverview() {
  await verifySession(['accountant'])
  const supabase = await createClient()

  // 1. Fetch Core Metrics via Analytics Engine
  const metricsPromise = getReportsSummary({})
  
  const today = new Date().toISOString().split('T')[0]

  const [
    metrics,
    { data: todayDist },
    { data: todaySales },
    { data: submissionsData },
    { data: recentDist },
    { data: recentSales },
    { data: staffPerformance }
  ] = await Promise.all([
    metricsPromise,
    supabase.from('distributions').select('quantity').gte('created_at', `${today}T00:00:00.000Z`).lte('created_at', `${today}T23:59:59.999Z`),
    supabase.from('sale_items').select('quantity, sales!inner(created_at)').gte('sales.created_at', `${today}T00:00:00.000Z`).lte('sales.created_at', `${today}T23:59:59.999Z`),
    supabase.from('cash_submissions').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('distributions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('sales').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('users').select('id, full_name, sales:sales(total_amount)').eq('role', 'staff')
  ])

  const { totalDistributed, totalSold, remainingTanks: totalRemaining, totalCollected, totalSubmitted, totalDifference, outstandingBalance } = metrics

  const distributedToday = todayDist?.reduce((acc, curr) => acc + curr.quantity, 0) || 0
  const soldToday = todaySales?.reduce((acc, curr) => acc + curr.quantity, 0) || 0

  const pendingCount = submissionsData?.filter(s => s.status === 'pending').length || 0
  const flaggedDiscrepancies = submissionsData?.filter(s => s.status === 'disputed') || []

  const recentActivity = [
    ...(recentDist?.map(d => ({ type: 'distribution', amount: d.quantity, date: d.created_at, label: 'Tanks Distributed' })) || []),
    ...(recentSales?.map(s => ({ type: 'sale', amount: Number(s.total_amount), date: s.created_at, label: `Sale (${s.sale_type})` })) || []),
    ...(submissionsData?.slice(0, 5).map(s => ({ type: 'submission', amount: Number(s.amount), date: s.created_at, label: 'Cash Submission' })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  const topStaff = (staffPerformance || []).map(staff => {
    const revenue = (staff.sales as any[])?.reduce((acc, s) => acc + Number(s.total_amount), 0) || 0
    return {
      id: staff.id,
      name: staff.full_name,
      revenue
    }
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  return {
    metrics: {
      totalDistributed,
      totalSold,
      totalRemaining,
      totalMoneyCollected: totalCollected,
      totalMoneySubmitted: totalSubmitted,
      totalDifference,
      outstandingBalance,
      pendingReviews: pendingCount
    },
    todayStats: {
      distributedToday,
      soldToday
    },
    topStaff,
    recentActivity,
    latestSubmissions: submissionsData?.slice(0, 5) || [],
    flaggedDiscrepancies: flaggedDiscrepancies.slice(0, 5)
  }
}
