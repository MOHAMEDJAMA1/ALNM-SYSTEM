import { createClient } from '@/utils/supabase/server'

export async function getFinancialOverview() {
  const supabase = await createClient()

  // We fetch high level historical totals
  const [
    { data: sales },
    { data: payments },
    { data: submissions },
    { data: customers }
  ] = await Promise.all([
    supabase.from('sales').select('total_amount, sale_type'),
    supabase.from('payments').select('amount'),
    supabase.from('cash_submissions').select('submitted_amount, difference_amount'),
    supabase.from('customers').select('debt')
  ])

  let totalCashSales = 0
  let totalCreditSales = 0
  
  sales?.forEach(s => {
    if (s.sale_type === 'cash') totalCashSales += Number(s.total_amount)
    else totalCreditSales += Number(s.total_amount)
  })

  const totalPaymentsReceived = payments?.reduce((a, b) => a + Number(b.amount), 0) || 0
  const totalMoneyCollected = totalPaymentsReceived
  const totalMoneySubmitted = submissions?.reduce((a, b) => a + Number(b.submitted_amount), 0) || 0
  const totalOutstandingBalance = customers?.reduce((a, b) => a + Number(b.debt), 0) || 0
  const totalDifference = totalMoneyCollected - totalMoneySubmitted

  // Also get a brief breakdown of outstanding customer debt limits
  const { data: topDebtors } = await supabase
    .from('customers')
    .select('id, name, debt, phone, staff:users!inner(full_name)')
    .gt('debt', 0)
    .order('debt', { ascending: false })
    .limit(5)

  return {
    totals: {
      totalCashSales,
      totalCreditSales,
      totalPaymentsReceived,
      totalMoneyCollected,
      totalMoneySubmitted,
      totalOutstandingBalance,
      totalDifference
    },
    topDebtors: topDebtors || []
  }
}
