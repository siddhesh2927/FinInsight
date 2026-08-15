'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Database, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Upload
} from 'lucide-react';
import { Screen } from '../../types/chat';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'New Query', path: '/dashboard/chat', icon: MessageSquare },
    { id: 'documents', label: 'Documents', path: '/dashboard/documents', icon: FileText },
    { id: 'datasets', label: 'Datasets', path: '/dashboard/datasets', icon: Database },
    { id: 'history', label: 'Query History', path: '/dashboard/history', icon: History },
    { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  // Helper to check if a navigation item is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      style={{ width: collapsed ? 64 : 260 }}
      className="flex-shrink-0 h-screen bg-white border-r border-[#e2e5ed] flex flex-col overflow-hidden transition-all duration-300 shadow-sm"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#e2e5ed] flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#1a4fcc] flex items-center justify-center shadow-md shadow-blue-200">
              <span className="text-white text-sm font-bold font-mono tracking-wider">FI</span>
            </div>
            <span className="font-bold text-[#0d1117] tracking-tight text-lg">FinInsight</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#1a4fcc] flex items-center justify-center shadow-md mx-auto">
            <span className="text-white text-xs font-bold font-mono">FI</span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label="Toggle Sidebar"
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f0f2f7] text-[#6b7280] transition-colors ml-auto cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-2">Workspace</p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                ${active
                  ? 'bg-[#f0f4ff] text-[#1a4fcc] font-semibold shadow-sm'
                  : 'text-[#4b5563] hover:bg-[#f7f8fa] hover:text-[#0d1117]'
                }`}
            >
              <Icon 
                size={18} 
                className={`flex-shrink-0 transition-colors ${active ? 'text-[#1a4fcc]' : 'text-[#6b7280] group-hover:text-[#0d1117]'}`} 
              />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a4fcc]" />
              )}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="mt-8 pt-6 border-t border-[#e2e5ed]/60 px-3 space-y-2">
            <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-1">Data Sources</p>
            <Link href="/dashboard/documents" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4b5563] hover:bg-[#f7f8fa] hover:text-[#1a4fcc] transition-colors border border-dashed border-[#e2e5ed]">
              <Upload size={14} className="text-[#6b7280]" />
              <span>Upload PDF</span>
            </Link>
            <Link href="/dashboard/datasets" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4b5563] hover:bg-[#f7f8fa] hover:text-[#1a4fcc] transition-colors border border-dashed border-[#e2e5ed]">
              <Upload size={14} className="text-[#6b7280]" />
              <span>Upload CSV</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User menu */}
      <div className="border-t border-[#e2e5ed] p-4 bg-white flex-shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a4fcc] to-[#0ea5e9] flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
            <span className="text-white text-xs font-semibold">AK</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0d1117] truncate leading-none mb-1">Alex Kim</p>
              <p className="text-[10px] text-[#6b7280] truncate leading-none">alex@fincorp.io</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
