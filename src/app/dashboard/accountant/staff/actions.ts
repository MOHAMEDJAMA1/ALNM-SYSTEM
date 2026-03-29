import { createClient } from '@/utils/supabase/server'

export async function getStaffList() {
  const supabase = await createClient()

  // Basic staff profile
  const { data: staffList } = await supabase
    .from('users')
    .select('id, full_name, role')
    .eq('role', 'staff')
    .order('full_name')

  // Get customer counts
  const { data: customers } = await supabase
    .from('customers')
    .select('staff_id')

  // Get total historical sales per staff
  const { data: sales } = await supabase
    .from('sales')
    .select('staff_id, total_amount')

  const directory = (staffList || []).map(staff => {
    const assignedCustomers = customers?.filter(c => c.staff_id === staff.id).length || 0
    const totalSales = sales?.filter(s => s.staff_id === staff.id).reduce((a, b) => a + Number(b.total_amount), 0) || 0

    return {
      id: staff.id,
      name: staff.full_name,
      role: staff.role,
      email: 'Field Personnel', 
      phone: 'Active',
      assignedCustomers,
      totalSales
    }
  })

  return directory
}
