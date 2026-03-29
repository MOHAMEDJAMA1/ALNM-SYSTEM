import { Header } from '@/components/layout/header'
import { createClient } from '@/utils/supabase/server'
import { Mail, Shield, CheckCircle2 } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const role = (user.user_metadata?.role || user.app_metadata?.role || 'staff').toUpperCase()
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#f8fafc]">
      <Header title="My Profile" />
      <main className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="w-full max-w-[800px] mx-auto text-[#0f172a]">
          <div className="mb-8">
            <h2 className="text-[28px] font-black tracking-tight mb-1">Identity Management</h2>
            <p className="text-[15px] font-medium text-[#64748b]">View your current system identity and assigned role.</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] shadow-sm rounded-[24px] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 transform rotate-3">
                <span className="text-[48px] font-black uppercase transform -rotate-3">{name.charAt(0)}</span>
              </div>

              <div className="flex flex-col items-center md:items-start flex-1 w-full mt-2">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[32px] font-black text-[#0f172a] tracking-tight leading-none">{name}</h3>
                  <div className="px-3 py-1 bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 rounded-full flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 size={12} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mt-6 w-full">
                  <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#94a3b8]">
                        <Mail size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1">Email Address</span>
                        <span className="text-[15px] font-bold text-[#0f172a] leading-none">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3b82f6]">
                        <Shield size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1">System Role</span>
                        <span className="text-[15px] font-bold text-[#0f172a] leading-none uppercase tracking-wide">{role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
