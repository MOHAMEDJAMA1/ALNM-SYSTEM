'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/utils/auth'
import { getReportsSummary } from './reports/actions'

export async function getAccountantOverview() {
  await verifySession(['accountant'])
  const supabase = await createClient()

  // 1. Fetch Core Metrics via Analytics Engine
  const metrics = await getReportsSummary({})
  
  const today = new Date().toISOString().split('T')[0]
  const { totalDistributed, totalSold, remainingTanks: totalRemaining, totalCollected, totalSubmitted, totalDifference, outstandingBalance } = metrics

  // 2. Fetch specific "Today" stats for the dashboard
  const { data: todayDist } = await supabase.from('distributions')
    .select('quantity')
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lte('created_at', `${today}T23:59:59.999Z`)
  const distributedToday = todayDist?.reduce((acc, curr) => acc + curr.quantity, 0) || 0

  const { data: todaySales } = await supabase.from('sale_items')
    .select('quantity, sales!inner(created_at)')
    .gte('sales.created_at', `${today}T00:00:00.000Z`)
    .lte('sales.created_at', `${today}T23:59:59.999Z`)
  const soldToday = todaySales?.reduce((acc, curr) => acc + curr.quantity, 0) || 0

  // 3. Fetch submissions for recent activity
  const { data: submissionsData } = await supabase.from('cash_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const pendingCount = submissionsData?.filter(s => s.status === 'pending').length || 0
  const flaggedDiscrepancies = submissionsData?.filter(s => s.status === 'disputed') || []

  // 4. Fetch recent sales and distributions for activity feed
  const { data: recentDist } = await supabase.from('distributions').select('*').order('created_at', { ascending: false }).limit(5)
  const { data: recentSales } = await supabase.from('sales').select('*').order('created_at', { ascending: false }).limit(5)

  const recentActivity = [
    ...(recentDist?.map(d => ({ type: 'distribution', amount: d.quantity, date: d.created_at, label: 'Tanks Distributed' })) || []),
    ...(recentSales?.map(s => ({ type: 'sale', amount: Number(s.total_amount), date: s.created_at, label: `Sale (${s.sale_type})` })) || []),
    ...(submissionsData?.slice(0, 5).map(s => ({ type: 'submission', amount: Number(s.amount), date: s.created_at, label: 'Cash Submission' })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  // 5. Staff Performance (Top 5 by Sales)
  const { data: staffPerformance } = await supabase
    .from('users')
    .select(`
      id,
      full_name,
      sales:sales(total_amount)
    `)
    .eq('role', 'staff')

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
