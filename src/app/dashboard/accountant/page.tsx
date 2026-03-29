import { Header } from '@/components/layout/header'
import { getAccountantOverview } from './actions'
import { StaffPerformanceTable } from '@/components/accountant/staff-performance-table'
import Link from 'next/link'
import { Truck, Tag, ClipboardList, Banknote, TrendingUp, Building2, AlertCircle, ShoppingCart, Wallet, Clock, ShieldAlert, Users, ChevronRight, ArrowUpRight, Activity, Download } from 'lucide-react'

import { Suspense } from 'react'
import { AccountantDashboardContent } from '@/components/accountant/dashboard-content'
import { AccountantDashboardSkeleton } from '@/components/accountant/dashboard-skeleton'

export default async function AccountantDashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#f8fafc]">
      <Header title={
        <div className="flex items-center gap-3">
          <span className="shrink-0 flex items-center leading-none">Accountant Overview</span>
          <span className="px-2 py-0.5 rounded-full bg-white text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest border border-[#bfdbfe] shadow-sm shrink-0 inline-flex items-center justify-center leading-none">Live Updates</span>
        </div>
      } />
      
      <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="w-full max-w-[1200px]">
          
          <div className="mb-8">
            <h2 className="text-[20px] font-black text-[#0f172a] mb-1 tracking-tight">Daily Distribution Overview</h2>
            <p className="text-[14px] font-medium text-[#64748b]">Real-time tracking of water tanks and daily collections.</p>
          </div>

          <Suspense fallback={<AccountantDashboardSkeleton />}>
             <AccountantDashboardContent />
          </Suspense>

        </div>
      </main>
    </div>
  )
}
