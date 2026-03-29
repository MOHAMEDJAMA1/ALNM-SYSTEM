import { Header } from '@/components/layout/header'
import { getStaffDetailReport } from './actions'
import { User as UserIcon, Users, Droplet, Tag, Banknote, ChevronLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function StaffDetailReportPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { id } = await params
  const { date } = await searchParams
  const { profile, stats, sales, distributions, submissions } = await getStaffDetailReport(id, date)

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#f8fafc]">
      <Header title="Staff Detail Report" />
      <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="w-full max-w-[1400px]">
          
          <div className="mb-6">
            <Link href="/dashboard/accountant/staff-reports" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#64748b] hover:text-[#0f172a] transition-colors mb-4">
              <ChevronLeft size={16} /> Back to Staff Reports
            </Link>
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[20px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <UserIcon size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-[28px] font-black text-[#0f172a] tracking-tight leading-none mb-1">{profile.full_name}</h2>
                  <div className="flex items-center gap-3 text-[14px] font-medium text-[#64748b]">
                    <span className="uppercase tracking-wider font-extrabold text-[#3b82f6]">Staff Member</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]"></span>
                    <span>Field Operations Active</span>
                  </div>
                </div>
              </div>

              <form className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-[12px] border border-[#e2e8f0] shadow-sm relative">
                  <Calendar size={16} className="text-[#64748b]" />
                  <input 
                    type="date" 
                    name="date"
                    defaultValue={date || ''}
                    className="text-[13px] font-black text-[#0f172a] uppercase focus:outline-none bg-transparent appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer relative"
                  />
                </div>
                <button type="submit" className="bg-[#0f172a] text-white px-4 py-2 rounded-[12px] text-[13px] font-bold shadow-sm hover:bg-[#1e293b] transition-colors">
                  Filter
                </button>
                {date && (
                  <Link href={`/dashboard/accountant/staff-reports/${id}`} className="px-4 py-2 rounded-[12px] text-[13px] font-bold text-[#64748b] bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors shadow-sm">
                    Clear
                  </Link>
                )}
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-[20px] p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#f8fafc] text-[#0f172a] flex items-center justify-center">
                  <Users size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">Total Customers</div>
                <div className="text-[28px] font-black text-[#0f172a] tracking-tighter leading-none">{stats.totalCustomers} <span className="text-[14px] font-medium text-[#94a3b8]">assigned</span></div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Droplet size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">All-Time Received</div>
                <div className="text-[28px] font-black text-[#0f172a] tracking-tighter leading-none">{stats.allTimeReceived} <span className="text-[14px] font-medium text-[#94a3b8]">tanks</span></div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#ecfdf5] text-[#10b981] flex items-center justify-center">
                  <Tag size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">All-Time Sold</div>
                <div className="text-[28px] font-black text-[#0f172a] tracking-tighter leading-none">{stats.allTimeSold} <span className="text-[14px] font-medium text-[#94a3b8]">tanks</span></div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 border border-[#e5e7eb] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#ecfeff] text-[#0ea5e9] flex items-center justify-center">
                  <Banknote size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">Total Revenue Generated</div>
                <div className="text-[28px] font-black text-[#0f172a] tracking-tighter leading-none">${stats.allTimeRevenue.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales History */}
            <div className="bg-white border border-[#e5e7eb] rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-[#f1f5f9]">
                <h3 className="text-[16px] font-bold text-[#0f172a] tracking-tight flex items-center gap-2"><Tag size={18} className="text-[#10b981]" /> Recent Sales</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white shadow-[0_1px_0_#f1f5f9]">
                    <tr>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {sales.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-[#94a3b8] text-[13px]">No sales recorded yet.</td></tr>
                    ) : sales.map((sale: any) => (
                      <tr key={sale.id} className="hover:bg-[#f8fafc]/50">
                        <td className="px-6 py-4 text-[13px] font-medium text-[#475569]">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#94a3b8]"/>
                            {new Date(sale.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold uppercase tracking-wider">
                          <span className={sale.sale_type === 'cash' ? 'text-[#10b981]' : 'text-[#f59e0b]'}>{sale.sale_type}</span>
                        </td>
                        <td className="px-6 py-4 text-[14px] font-black text-[#0f172a] text-right">${Number(sale.total_amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submissions History */}
            <div className="bg-white border border-[#e5e7eb] rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-[#f1f5f9]">
                <h3 className="text-[16px] font-bold text-[#0f172a] tracking-tight flex items-center gap-2"><Banknote size={18} className="text-[#3b82f6]" /> Daily Submissions</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white shadow-[0_1px_0_#f1f5f9]">
                    <tr>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider">Diff</th>
                      <th className="px-6 py-3 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {submissions.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-[#94a3b8] text-[13px]">No submissions recorded yet.</td></tr>
                    ) : submissions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-[#f8fafc]/50">
                        <td className="px-6 py-4 text-[13px] font-bold text-[#0f172a]">{new Date(sub.submission_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-[13px] font-black">
                          <span className={sub.difference_amount === 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                            {sub.difference_amount < 0 ? '-' : ''}${Math.abs(sub.difference_amount).toFixed(0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider ${
                            sub.status === 'pending' ? 'bg-[#fff7ed] text-[#ea580c] border border-[#ea580c]/30' :
                            sub.status === 'verified' ? 'bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/30' :
                            'bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/30'
                          }`}>{sub.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
