'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

export function DashboardContainer({ 
  children, 
  sidebar,
  role, 
  userName 
}: { 
  children: React.ReactNode, 
  sidebar: React.ReactNode,
  role: string,
  userName: string
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  // Listen for toggle event from Header
  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev)
    window.addEventListener('toggle-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-sidebar', handleToggle)
  }, [])

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out bg-white lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {sidebar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* We move Header inside the Container to access toggleSidebar */}
        {/* But Header is used individually in pages? No, let's centralize it if possible, 
            OR pass the toggle function down to kids.
            
            Actually, the user said "At the top right of the dashboard (header)".
            If each page has its own Header, I need a way to trigger the sidebar toggle.
        */}
        {children}
      </div>
      
      {/* Floating Mobile Toggle (Alternative if Header is per-page) */}
      {!isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-[#3b82f6] text-white rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
