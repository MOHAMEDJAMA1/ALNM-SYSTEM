import { getAccountantOverview } from '@/app/dashboard/accountant/actions'
import Link from 'next/link'
import { Truck, Tag, ClipboardList, Banknote, ShoppingCart, Wallet, Clock, Activity, ArrowUpRight, Download, Users, ChevronRight, ShieldAlert, AlertCircle } from 'lucide-react'

export async function AccountantDashboardContent() {
  const { metrics, todayStats, topStaff, recentActivity, latestSubmissions, flaggedDiscrepancies } = await getAccountantOverview()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* 1. Distributed */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
              <Truck size={24} strokeWidth={2.5} />
            </div>
            <div className="bg-[#ecfdf5] text-[#10b981] px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">System Total</div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Tanks Distributed</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">{metrics.totalDistributed.toLocaleString()}</div>
          </div>
        </div>

        {/* 2. Sold */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#ecfdf5] text-[#10b981] flex items-center justify-center">
              <Tag size={24} strokeWidth={2.5} />
            </div>
            <div className="bg-[#f0f9ff] text-[#0ea5e9] px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{todayStats.soldToday} Today</div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Tanks Sold</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">{metrics.totalSold.toLocaleString()}</div>
          </div>
        </div>

        {/* 3. Remaining */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#fff7ed] text-[#f59e0b] flex items-center justify-center">
              <ClipboardList size={24} strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1.5 p-1 px-2 rounded-full border border-[#e2e8f0] text-[10px] font-black uppercase tracking-widest text-[#64748b]">Inventory</div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Remaining Tanks</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">{metrics.totalRemaining.toLocaleString()}</div>
          </div>
        </div>

        {/* 4. Collected */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#ecfeff] text-[#0891b2] flex items-center justify-center">
              <ShoppingCart size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Money Collected</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">${metrics.totalMoneyCollected.toLocaleString()}</div>
          </div>
        </div>

        {/* 5. Submitted */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
              <Banknote size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Total Money Submitted</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">${metrics.totalMoneySubmitted.toLocaleString()}</div>
          </div>
        </div>

        {/* 6. Difference */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300 relative overflow-hidden">
          {metrics.totalDifference > 0 && <div className="absolute top-0 right-0 w-1 h-full bg-[#ef4444]"></div>}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#fef2f2] text-[#ef4444] flex items-center justify-center">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Total Missing Amount</span>
            <div className={`text-[32px] font-black leading-none tracking-tighter ${metrics.totalDifference > 0 ? 'text-[#ef4444]' : 'text-[#0f172a]'}`}>
              ${metrics.totalDifference.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 7. Balance */}
        <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f0] shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#fefce8] text-[#ca8a04] flex items-center justify-center">
              <Wallet size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest leading-none mb-1.5 block">Outstanding Balance</span>
            <div className="text-[32px] font-black text-[#0f172a] leading-none tracking-tighter">${metrics.outstandingBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* 8. Pending */}
        <Link 
          href="/dashboard/accountant/submissions"
          className="bg-[#0f172a] rounded-[24px] p-6 shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300 text-white group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[16px] bg-white/10 text-white flex items-center justify-center group-hover:bg-[#3b82f6] transition-colors">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <ArrowUpRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-auto">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5 block">Pending Reviews</span>
            <div className="text-[32px] font-black leading-none tracking-tighter flex items-center gap-3">
              {metrics.pendingReviews}
              <span className="text-[14px] font-bold text-[#3b82f6] uppercase tracking-widest">Queue</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-[28px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center">
            <h3 className="text-[16px] font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              <Activity size={18} className="text-[#3b82f6]" strokeWidth={2.5}/> Recent Activity
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-[#f8fafc]">
              {recentActivity.map((act, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      act.type === 'distribution' ? 'bg-[#eff6ff] text-[#3b82f6]' :
                      act.type === 'sale' ? 'bg-[#ecfdf5] text-[#10b981]' :
                      'bg-[#fefce8] text-[#ca8a04]'
                    }`}>
                      {act.type === 'distribution' ? <Truck size={18} /> : 
                       act.type === 'sale' ? <Tag size={18} /> : <Banknote size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-[#0f172a] uppercase tracking-tight">{act.label}</span>
                      <span className="text-[11px] font-medium text-[#94a3b8]">{new Date(act.date).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-[15px] font-black text-[#0f172a]">
                    {act.type === 'distribution' ? `${act.amount} Units` : `$${act.amount.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-[#1e293b] rounded-[28px] p-6 text-white shadow-xl">
              <h3 className="text-[13px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Users size={16} /> Top Staff Performance
              </h3>
              <div className="space-y-4">
                {topStaff.map((staff, i) => (
                  <Link key={staff.id} href={`/dashboard/accountant/staff-reports/${staff.id}`} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-[#3b82f6] w-5">0{i+1}</span>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-white group-hover:text-[#3b82f6] transition-colors">{staff.name}</span>
                        <span className="text-[10px] font-black text-white/30 uppercase">Staff Member</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-black text-[#10b981]">${ staff.revenue.toLocaleString() }</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/dashboard/accountant/staff" className="w-full mt-6 py-3 rounded-[16px] bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                View All Directory <ChevronRight size={14} />
              </Link>
           </div>

           {flaggedDiscrepancies.length > 0 && (
             <Link href="/dashboard/accountant/submissions" className="bg-red-50 rounded-[28px] p-6 border-2 border-red-100 shadow-sm relative overflow-hidden block">
                <div className="flex items-center gap-3 mb-4 text-[#ef4444]">
                  <ShieldAlert size={20} strokeWidth={2.5}/>
                  <h3 className="text-[13px] font-black uppercase tracking-widest leading-none">Flagged Discrepancies</h3>
                </div>
                <p className="text-[13px] font-medium text-red-600/80 leading-snug mb-4">You have {flaggedDiscrepancies.length} submissions flagged for audit intervention.</p>
                <div className="w-full py-3 rounded-[16px] bg-[#ef4444] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#dc2626] transition-all shadow-lg shadow-red-500/20 text-center">
                  Audit Discrepancies
                </div>
             </Link>
           )}

           <div className="bg-white border border-[#e2e8f0] rounded-[28px] p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Quick Operations</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/accountant/reports" className="flex items-center justify-between p-3 rounded-[16px] hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#e2e8f0] font-bold text-[13px] text-[#0f172a]">
                  Download System Reports <Download size={16} className="text-[#3b82f6]" />
                </Link>
                <Link href="/dashboard/accountant/financials" className="flex items-center justify-between p-3 rounded-[16px] hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#e2e8f0] font-bold text-[13px] text-[#0f172a]">
                  View Financial Balances <ArrowUpRight size={16} className="text-[#10b981]" />
                </Link>
              </div>
           </div>
        </div>
      </div>
    </>
  )
}
