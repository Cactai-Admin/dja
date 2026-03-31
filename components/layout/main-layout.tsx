'use client';
/* ============================================================
   Main Layout — Responsive shell with desktop sidebar and mobile tray
   ============================================================ */
import type { Job } from '@/types';
import { MobileWorkspaceTray } from './mobile-workspace-tray';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  currentJob?: Job | null;
}

export function MainLayout({ children, currentJob }: MainLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />
      <MobileWorkspaceTray job={currentJob} />
      <main className="min-w-0 lg:ml-60">
        <div className="page-shell pb-24 lg:pb-0">{children}</div>
      </main>
    </div>
  );
}
