import { Header } from '@/components/layout/header'
import { getCustomerById } from '@/app/dashboard/staff/customers/actions'
import { redirect } from 'next/navigation'
import EditCustomerForm from './edit-form'

export default async function EditCustomerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const customerId = params.id
  
  const customer = await getCustomerById(customerId)

  if (!customer) {
    redirect('/dashboard/staff/customers')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#f8fafc]">
      <Header title="" />
      <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="w-full max-w-[800px] mx-auto">
          
          <div className="mb-8">
            <h2 className="text-[28px] font-black text-[#0f172a] mb-1 tracking-tight">Edit Customer</h2>
            <p className="text-[15px] font-medium text-[#64748b]">Update profile information for {customer.name}.</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] shadow-sm rounded-[20px] p-8">
            <EditCustomerForm customer={customer} />
          </div>
        </div>
      </main>
    </div>
  )
}
