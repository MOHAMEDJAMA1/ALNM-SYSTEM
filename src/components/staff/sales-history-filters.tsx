'use client'

import { Search, Filter, Calendar } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function SalesHistoryFilters({ initialQ, initialType }: { initialQ?: string, initialType?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [q, setQ] = useState(initialQ || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type !== 'all') params.set('type', type)
    else params.delete('type')
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="p-8 border-b border-[#f1f5f9] bg-[#f8fafc]/50">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white border border-[#e2e8f0] px-4 py-3 rounded-[16px] shadow-inner w-full md:w-[400px] focus-within:border-[#3b82f6] transition-all">
          <Search size={18} className={`${isPending ? 'text-[#3b82f6] animate-pulse' : 'text-[#94a3b8]'}`} />
          <input 
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID or Customer..."
            className="bg-transparent border-none outline-none text-[14px] font-bold text-[#0f172a] placeholder-[#94a3b8] w-full"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] px-4 py-3 rounded-[16px]">
            <Filter size={18} className="text-[#3b82f6]" />
            <select 
              className="bg-transparent border-none outline-none text-[13px] font-black uppercase text-[#0f172a] cursor-pointer"
              defaultValue={initialType || 'all'}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="all">Global Types</option>
              <option value="cash">Cash Sales</option>
              <option value="credit">Credit Sales</option>
            </select>
          </div>
          <button className="w-[48px] h-[48px] bg-white border border-[#e2e8f0] rounded-[16px] flex items-center justify-center text-[#64748b] hover:text-[#3b82f6] transition-colors">
            <Calendar size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
