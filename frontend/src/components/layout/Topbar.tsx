'use client';

import { Search, HelpCircle, Bell } from 'lucide-react';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-[#e2e5ed] flex items-center px-6 gap-6 flex-shrink-0 z-10 shadow-sm">
      {/* Title */}
      <h1 className="text-base font-bold text-[#0d1117] flex-1 tracking-tight">{title}</h1>

      {/* Global Search Bar */}
      <div className="flex items-center gap-2 bg-[#f7f8fa] border border-[#e2e5ed] rounded-lg px-3 py-2 w-64 focus-within:border-[#1a4fcc] focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
        <Search size={14} className="text-[#6b7280]" />
        <input
          type="text"
          placeholder="Search reports or queries..."
          className="flex-1 bg-transparent text-xs text-[#0d1117] placeholder:text-[#9ca3af] outline-none"
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-[#9ca3af] font-mono border border-[#e2e5ed] bg-white rounded px-1.5 py-0.5 shadow-2xs">
          ⌘K
        </kbd>
      </div>

      {/* Help Icon */}
      <button 
        aria-label="Help & Documentation"
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f0f2f7] text-[#6b7280] hover:text-[#0d1117] transition-all cursor-pointer"
      >
        <HelpCircle size={18} />
      </button>

      {/* Notifications */}
      <button 
        aria-label="View notifications"
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f0f2f7] text-[#6b7280] hover:text-[#0d1117] transition-all relative cursor-pointer"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-[#1a4fcc] rounded-full border border-white ring-1 ring-blue-100" />
      </button>

      {/* User profile avatar */}
      <div className="flex items-center gap-2 border-l border-[#e2e5ed] pl-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a4fcc] to-[#0ea5e9] flex items-center justify-center text-white font-semibold text-xs shadow-inner">
          AK
        </div>
      </div>
    </header>
  );
}
