'use client'

import { useState } from 'react'
import { SlidersHorizontal, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export type StaffPerformanceData = {
  id: string
  name: string
  received: number
  sold: number
  remaining: number
  collected: number
  submitted: number
  difference: number
}

interface Props {
  data: StaffPerformanceData[]
}

export function StaffPerformanceTable({ data }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const displayedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-white border border-[#f1f5f9] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col transform-gpu">
      <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
        <h3 className="text-[18px] font-black text-[#0f172a] tracking-tight">Staff Performance Today</h3>
        <div className="flex gap-3">
          <button className="appearance-none h-8 px-4 rounded-full bg-white border border-[#e2e8f0] text-[#475569] text-[12px] font-bold flex items-center gap-2 hover:bg-[#f8fafc] transition-colors shadow-sm">
            <SlidersHorizontal size={13} className="text-[#64748b]" />
            Filter
          </button>
          <button className="appearance-none h-8 px-4 rounded-full bg-[#3b82f6] text-white text-[12px] font-bold flex items-center gap-2 hover:bg-[#2563eb] transition-colors shadow-sm shadow-[#3b82f6]/20">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Staff Member</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Received</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Sold</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Remaining</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Collected</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9]">Submitted</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9] text-right">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {displayedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[#94a3b8] text-[14px] font-medium">
                  No staff activity recorded today.
                </td>
              </tr>
            ) : displayedData.map((staff) => (
              <tr key={staff.id} className="hover:bg-[#f8fafc]/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#3b82f6] font-bold text-[13px] flex items-center justify-center">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[14px] font-bold text-[#0f172a]">{staff.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14px] font-bold text-[#475569]">{staff.received}</td>
                <td className="px-6 py-5 text-[14px] font-bold text-[#10b981]">{staff.sold}</td>
                <td className="px-6 py-5 text-[14px] font-bold text-[#475569]">{staff.remaining}</td>
                <td className="px-6 py-5 text-[14px] font-black text-[#0f172a]">${Math.round(staff.collected)}</td>
                <td className="px-6 py-5 text-[14px] font-black text-[#0f172a]">${Math.round(staff.submitted)}</td>
                <td className="px-6 py-5 text-right">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-[6px] text-[12px] font-black tracking-wide ${
                    staff.difference === 0 
                      ? 'bg-[#ecfdf5] text-[#10b981]' 
                      : 'bg-[#fef2f2] text-[#ef4444]'
                  }`}>
                    {staff.difference < 0 ? '-' : ''}${Math.abs(staff.difference).toFixed(0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]/50 mt-auto">
        <span className="text-[13px] font-medium text-[#64748b]">
          Showing {displayedData.length} staff members
        </span>
        <div className="flex gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="appearance-none w-7 h-7 rounded-[6px] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-white disabled:opacity-50 transition-colors bg-white shadow-sm"
          >
            <ChevronLeft size={14} />
          </button>
          <button className="appearance-none w-7 h-7 rounded-[6px] bg-[#3b82f6] flex items-center justify-center text-white font-bold text-[12px] shadow-[#3b82f6]/20">
            1
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="appearance-none w-7 h-7 rounded-[6px] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-white disabled:opacity-50 transition-colors bg-white shadow-sm"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
