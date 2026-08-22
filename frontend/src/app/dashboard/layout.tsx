'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

const screenTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/chat': 'AI Query Workspace',
  '/dashboard/documents': 'Documents Repository',
  '/dashboard/datasets': 'Datasets connected',
  '/dashboard/history': 'Query History',
  '/dashboard/settings': 'Settings',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Find matching screen title or default to 'Workspace'
  const currentTitle = screenTitles[pathname] || 'AI Workspace';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7f8fa]">
      {/* Persistent left sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Topbar header */}
        <Topbar title={currentTitle} />
        
        {/* Active Screen contents */}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
