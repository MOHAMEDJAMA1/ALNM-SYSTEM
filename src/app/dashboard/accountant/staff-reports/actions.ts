import { createClient } from '@/utils/supabase/server'

export async function getStaffReportsList(date?: string) {
  const supabase = await createClient()

  const targetDate = date || new Date().toISOString().split('T')[0]
  const startOfDay = `${targetDate}T00:00:00.000Z`
  const endOfDay = `${targetDate}T23:59:59.999Z`

  // 1. Get all staff
  const { data: staffUsers } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('role', 'staff')
    .order('full_name')

  // 2. Get today's distributions
  const { data: distributions } = await supabase
    .from('distributions')
    .select('quantity, staff_id')
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  // 3. Get today's sales
  const { data: sales } = await supabase
    .from('sales')
    .select(`
      id,
      staff_id,
      total_amount,
      sale_type,
      sale_items(quantity)
    `)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  // 4. Get today's payments (using sale relation to find staff)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, sale:sales!inner(staff_id)')
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  // 5. Get today's submissions
  const { data: submissions } = await supabase
    .from('cash_submissions')
    .select('staff_id, submitted_amount')
    .eq('submission_date', targetDate)

  // 6. Get total outstanding debt across all customers per staff
  const { data: customers } = await supabase
    .from('customers')
    .select('staff_id, debt')

  // Aggregate per staff
  const reports = (staffUsers || []).map(staff => {
    // Received
    const received = distributions?.filter(d => d.staff_id === staff.id).reduce((acc, curr) => acc + curr.quantity, 0) || 0
    
    // Sales computation
    let sold = 0
    let cashSales = 0
    let creditSales = 0

    sales?.filter(s => s.staff_id === staff.id).forEach(s => {
      const qty = (s.sale_items as any)?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0
      sold += qty
      if (s.sale_type === 'cash') cashSales += Number(s.total_amount)
      else creditSales += Number(s.total_amount)
    })

    const remaining = Math.max(0, received - sold)

    // Payments received (this includes cash sale payments + debt payments)
    const paymentsReceived = payments?.filter(p => (p.sale as any)?.staff_id === staff.id).reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

    // Money Collected
    const collected = paymentsReceived

    // Money Submitted
    const submitted = submissions?.filter(sub => sub.staff_id === staff.id).reduce((acc, curr) => acc + Number(curr.submitted_amount), 0) || 0

    const difference = collected - submitted
    
    // Outstanding Debt
    const outstandingDebt = customers?.filter(c => c.staff_id === staff.id).reduce((acc, curr) => acc + Number(curr.debt || 0), 0) || 0

    return {
      id: staff.id,
      name: staff.full_name,
      received,
      sold,
      remaining,
      cashSales,
      creditSales,
      paymentsReceived,
      collected,
      submitted,
      difference,
      outstandingDebt
    }
  })

  return reports
}

