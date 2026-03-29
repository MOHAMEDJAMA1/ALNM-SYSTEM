'use server'

import { createClient } from '@/utils/supabase/server'

export async function getReportsSummary(filters: {
  startDate?: string;
  endDate?: string;
  staffId?: string;
  customerId?: string;
}) {
  const supabase = await createClient()

  // 1. Get ONLY Active Staff to prevent deleted/fake test users from polluting global metrics.
  const { data: activeStaff } = await supabase.from('users').select('id').eq('role', 'staff')
  const validStaffIds = activeStaff?.map(s => s.id) || []

  let salesQuery = supabase.from('sales').select('id, total_amount, sale_type, created_at')
  let paymentsQuery: any = supabase.from('payments').select('amount, payment_method, created_at, sales!inner(staff_id)')
  let submissionsQuery = supabase.from('cash_submissions').select('amount, status, created_at')
  let distQuery = supabase.from('distributions').select('quantity, created_at')
  let saleItemsQuery = supabase.from('sale_items').select('quantity, sales!inner(created_at, staff_id, customer_id)')

  // Constrain queries globally to valid staff
  if (!filters.staffId) {
    salesQuery = salesQuery.in('staff_id', validStaffIds)
    paymentsQuery = paymentsQuery.in('sales.staff_id', validStaffIds)
    submissionsQuery = submissionsQuery.in('staff_id', validStaffIds)
    distQuery = distQuery.in('staff_id', validStaffIds)
    saleItemsQuery = saleItemsQuery.in('sales.staff_id', validStaffIds)
  }

  // Apply Specific Filters
  if (filters.startDate) {
    const start = `${filters.startDate}T00:00:00.000Z`
    salesQuery = salesQuery.gte('created_at', start)
    paymentsQuery = paymentsQuery.gte('created_at', start)
    submissionsQuery = submissionsQuery.gte('created_at', start)
    distQuery = distQuery.gte('created_at', start)
    saleItemsQuery = saleItemsQuery.gte('sales.created_at', start)
  }
  if (filters.endDate) {
    const end = `${filters.endDate}T23:59:59.999Z`
    salesQuery = salesQuery.lte('created_at', end)
    paymentsQuery = paymentsQuery.lte('created_at', end)
    submissionsQuery = submissionsQuery.lte('created_at', end)
    distQuery = distQuery.lte('created_at', end)
    saleItemsQuery = saleItemsQuery.lte('sales.created_at', end)
  }
  if (filters.staffId) {
    salesQuery = salesQuery.eq('staff_id', filters.staffId)
    submissionsQuery = submissionsQuery.eq('staff_id', filters.staffId)
    paymentsQuery = supabase.from('payments').select('amount, payment_method, created_at, sales!inner(staff_id)').eq('sales.staff_id', filters.staffId)
    distQuery = distQuery.eq('staff_id', filters.staffId)
    saleItemsQuery = saleItemsQuery.eq('sales.staff_id', filters.staffId)
  }
  if (filters.customerId) {
    salesQuery = salesQuery.eq('customer_id', filters.customerId)
    paymentsQuery = supabase.from('payments').select('amount, payment_method, created_at, sales!inner(customer_id)').eq('sales.customer_id', filters.customerId)
    saleItemsQuery = saleItemsQuery.eq('sales.customer_id', filters.customerId)
  }

  const [
    { data: sales },
    { data: payments },
    { data: submissions },
    { data: distributions },
    { data: saleItems }
  ] = await Promise.all([
    salesQuery,
    paymentsQuery,
    submissionsQuery,
    distQuery,
    saleItemsQuery
  ])

  // Calculations
  const totalDistributed = distributions?.reduce((acc, d) => acc + d.quantity, 0) || 0
  const totalSold = saleItems?.reduce((acc, si) => acc + si.quantity, 0) || 0
  const remainingTanks = totalDistributed - totalSold

  // Fix Mathematical Double-Counting
  const creditSalesAmount = sales?.filter(s => s.sale_type === 'credit').reduce((acc: number, s: any) => acc + Number(s.total_amount), 0) || 0
  
  const cashPayments = payments?.filter((p: any) => p.payment_method === 'cash').reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0
  const debtPayments = payments?.filter((p: any) => p.payment_method === 'debt_repayment').reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0

  // Money Collected is strictly the physical money received (Cash Sales + Debt Repayments)
  const totalCollected = cashPayments + debtPayments
  const totalSubmitted = submissions?.filter(s => s.status === 'verified').reduce((acc: number, s: any) => acc + Number(s.amount), 0) || 0
  const totalDifference = totalCollected - totalSubmitted
  
  // Outstanding Debt = (Total Credit Sales) - (Total Debt Payments)
  const outstandingBalance = creditSalesAmount - debtPayments

  return {
    totalDistributed,
    totalSold,
    remainingTanks,
    totalCollected,
    totalSubmitted,
    totalDifference,
    outstandingBalance
  }
}

export async function getDetailedReport(type: string, filters: {
  startDate?: string;
  endDate?: string;
  staffId?: string;
  customerId?: string;
  itemId?: string;
  saleType?: string;
  status?: string;
}) {
  const supabase = await createClient()
  const start = filters.startDate ? `${filters.startDate}T00:00:00.000Z` : null
  const end = filters.endDate ? `${filters.endDate}T23:59:59.999Z` : null

  switch (type) {
    case 'sales': {
      let query = supabase.from('sales').select(`
        id, created_at, total_amount, sale_type, status,
        staff:users!sales_staff_id_fkey(full_name),
        customer:customers(name),
        items:sale_items(quantity, items(name))
      `)
      if (start) query = query.gte('created_at', start)
      if (end) query = query.lte('created_at', end)
      if (filters.staffId) query = query.eq('staff_id', filters.staffId)
      if (filters.customerId) query = query.eq('customer_id', filters.customerId)
      if (filters.saleType) query = query.eq('sale_type', filters.saleType)
      if (filters.status) query = query.eq('status', filters.status)
      const { data } = await query.order('created_at', { ascending: false })
      return data || []
    }

    case 'distribution': {
      let query = supabase.from('distributions').select(`
        id, created_at, quantity, status,
        agent:users!agent_id_fkey(full_name),
        staff:users!staff_id_fkey(full_name),
        item:items(name)
      `)
      if (start) query = query.gte('created_at', start)
      if (end) query = query.lte('created_at', end)
      if (filters.staffId) query = query.eq('staff_id', filters.staffId)
      if (filters.itemId) query = query.eq('item_id', filters.itemId)
      const { data } = await query.order('created_at', { ascending: false })
      return data || []
    }

    case 'debt': {
      // Calculate debt per customer
      const { data: customers } = await supabase.from('customers').select('id, name, users(full_name)')
      const { data: sales } = await supabase.from('sales').select('customer_id, total_amount').eq('sale_type', 'credit')
      const { data: payments } = await supabase.from('payments').select('sale_id, amount, sales!inner(customer_id)')

      return (customers || []).map(c => {
        const totalCredit = sales?.filter(s => s.customer_id === c.id).reduce((acc, s) => acc + Number(s.total_amount), 0) || 0
        const totalPaid = payments?.filter(p => (p.sales as any).customer_id === c.id).reduce((acc, p) => acc + Number(p.amount), 0) || 0
        return {
          customerName: c.name,
          staffName: (c.users as any)?.full_name || 'Unassigned',
          totalCredit,
          totalPaid,
          balance: totalCredit - totalPaid
        }
      }).filter(d => d.balance !== 0)
    }

    case 'payments': {
      let query = supabase.from('payments').select(`
        id, created_at, amount, payment_method,
        sale:sales!inner(staff_id, customer_id, users!sales_staff_id_fkey(full_name), customers(name))
      `)
      if (start) query = query.gte('created_at', start)
      if (end) query = query.lte('created_at', end)
      if (filters.staffId) query = query.eq('sales.staff_id', filters.staffId)
      if (filters.customerId) query = query.eq('sales.customer_id', filters.customerId)
      const { data } = await query.order('created_at', { ascending: false })
      return data || []
    }

    case 'submissions': {
      let query = supabase.from('cash_submissions').select(`
        id, created_at, amount, status,
        staff:users!staff_id_fkey(full_name)
      `)
      if (start) query = query.gte('created_at', start)
      if (end) query = query.lte('created_at', end)
      if (filters.staffId) query = query.eq('staff_id', filters.staffId)
      const { data } = await query.order('created_at', { ascending: false })
      
      // We also need "collected" for each submission day. 
      // This is simpler if we just show the submissions themselves for now.
      return data || []
    }

    case 'performance': {
      const { data: staff } = await supabase.from('users').select('id, full_name').eq('role', 'staff')
      const results = await Promise.all((staff || []).map(async s => {
        const stats = await getReportsSummary({ staffId: s.id, startDate: filters.startDate, endDate: filters.endDate })
        return {
          id: s.id,
          staffName: s.full_name,
          ...stats
        }
      }))
      return results
    }

    default:
      return []
  }
}

export async function getFilterMetadata() {
  const supabase = await createClient()
  const [
    { data: staff },
    { data: customers },
    { data: items }
  ] = await Promise.all([
    supabase.from('users').select('id, full_name, role').in('role', ['staff', 'agent']).order('full_name'),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('items').select('id, name').order('name')
  ])
  return { staff: staff || [], customers: customers || [], items: items || [] }
}
