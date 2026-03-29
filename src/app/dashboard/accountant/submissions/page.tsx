import { Header } from '@/components/layout/header'
import { createClient } from '@/utils/supabase/server'
import { getReviewSummary } from './actions'
import { SubmissionReviewActions } from '@/components/accountant/submission-review-actions'
import { Calculator, Banknote, TrendingUp, AlertCircle, User, Calendar, Hash, CheckCircle2, ShieldAlert, Clock } from 'lucide-react'
import { verifySession } from '@/utils/auth'

export default async function AccountantSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ staff?: string; date?: string }>
}) {
  const { role } = await verifySession(['accountant'])
  const { staff, date } = await searchParams
  const supabase = await createClient()
  const summary = await getReviewSummary()
  
  let query = supabase
    .from('cash_submissions')
    .select(`
      *,
      staff:users!staff_id(full_name)
    `)
    .order('created_at', { ascending: false })

  if (staff) {
    query = query.eq('staff_id', staff)
  }
  
  const selectedDate = date || new Date().toISOString().split('T')[0]
  // Note: Filtering by date on created_at (timestamp)
  query = query.gte('created_at', `${selectedDate}T00:00:00.000Z`)
                .lte('created_at', `${selectedDate}T23:59:59.999Z`)

  const { data: submissions } = await query

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#f8fafc]">
      <Header title="Regional Audit" />
      <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="w-full max-w-[1200px] mx-auto">
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-[32px] font-black text-[#0f172a] mb-1 tracking-tight uppercase leading-none">Financial Submission Audit</h2>
              <p className="text-[15px] font-medium text-[#64748b]">Review and verify end-of-day cash collections from all warehouse staff.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="bg-white border border-[#e2e8f0] px-4 py-2.5 rounded-[12px] flex items-center gap-2 shadow-sm">
                  <Calendar size={16} className="text-[#3b82f6]" />
                  <span className="text-[13px] font-black text-[#0f172a] uppercase">{new Date(selectedDate).toLocaleDateString()}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[24px] border border-[#e5e7eb] shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]">
                <Calculator size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Collected Total</span>
                <span className="text-[24px] font-black text-[#0f172a] leading-none">${summary.totalCollected.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-[#e5e7eb] shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                <Banknote size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Submitted (Cash)</span>
                <span className="text-[24px] font-black text-[#10b981] leading-none">${summary.totalSubmitted.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-[#e5e7eb] shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-[#fff7ed] flex items-center justify-center text-[#f59e0b]">
                <TrendingUp size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Net Discrepancy</span>
                <span className={`text-[24px] font-black leading-none ${summary.totalDifference > 0 ? 'text-orange-500' : 'text-[#64748b]'}`}>
                  ${summary.totalDifference.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-[24px] shadow-lg flex items-center gap-5 text-white">
              <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center text-white">
                <AlertCircle size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5">Pending Review</span>
                <span className="text-[24px] font-black leading-none">{summary.pendingCount} Reports</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] shadow-sm rounded-[28px] overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc]/50">
               <h3 className="text-[14px] font-black text-[#0f172a] uppercase tracking-widest">Active Submission Queue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="py-5 px-8 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Staff Identity</th>
                    <th className="py-5 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Sold</th>
                    <th className="py-5 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Collected</th>
                    <th className="py-5 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Hand-over</th>
                    <th className="py-5 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Difference</th>
                    <th className="py-5 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9]">Status</th>
                    <th className="py-5 pr-8 text-[11px] font-black text-[#94a3b8] uppercase tracking-widest border-b border-[#f1f5f9] text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {submissions?.map(sub => {
                    const diff = Number(sub.difference_amount)
                    const isFlagged = Math.abs(diff) > 0.01

                    return (
                      <tr key={sub.id} className="hover:bg-[#f8fafc]/80 transition-all">
                        <td className="py-6 px-8">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]">
                                 <User size={18} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-[#0f172a] text-[14px] uppercase tracking-tight">{(sub.staff as any)?.full_name}</span>
                                 <span className="text-[10px] font-bold text-[#94a3b8] uppercase">Warehouse Unit</span>
                              </div>
                           </div>
                        </td>
                        <td className="py-6">
                           <span className="px-3 py-1 rounded-full bg-[#1e293b] text-white text-[10px] font-black uppercase tracking-widest">-- Units</span>
                        </td>
                        <td className="py-6">
                           <span className="text-[15px] font-bold text-[#64748b]">${Number(sub.amount).toFixed(2)}</span>
                        </td>
                        <td className="py-6">
                           <span className="text-[17px] font-black text-[#0f172a] tracking-tighter">${Number(sub.amount).toFixed(2)}</span>
                        </td>
                        <td className="py-6">
                           <span className="marker:text-[15px] font-black text-[#64748b]">
                              0.00
                           </span>
                        </td>
                        <td className="py-6">
                           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] border-2 ${
                             sub.status === 'verified' 
                               ? 'bg-[#ecfdf5] text-[#10b981] border-[#10b981]/10' 
                               : sub.status === 'disputed'
                               ? 'bg-red-50 text-red-600 border-red-100'
                               : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
                           }`}>
                             {sub.status === 'verified' ? <CheckCircle2 size={14} /> : sub.status === 'disputed' ? <ShieldAlert size={14} /> : <Clock size={14} />}
                             <span className="text-[10px] font-black uppercase tracking-widest">{sub.status}</span>
                           </div>
                        </td>
                        <td className="py-6 pr-8 text-right">
                           <SubmissionReviewActions submissionId={sub.id} currentStatus={sub.status} />
                        </td>
                      </tr>
                    )
                  })}

                  {submissions?.length === 0 && (
                    <tr>
                       <td colSpan={7} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#cbd5e1]">
                                <AlertCircle size={32} />
                             </div>
                             <p className="text-[14px] font-bold text-[#94a3b8] uppercase tracking-widest">No submissions queued for review</p>
                          </div>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
