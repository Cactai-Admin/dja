'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FolderKanban, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, Sparkles, Plus, FileCheck2, Send, Heart, Stars } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { WORKFLOW_STAGES, getCurrentWorkflowStage } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import type { Job } from '@/types';
import { BrandMark } from './sidebar';

const APP_LINKS = [
  { href: '/dashboard', label: 'All Jobs', icon: LayoutDashboard },
  { href: '/jobs/new', label: 'Add Job', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const PIPELINE_LINKS = [
  { href: '/pipeline/applied', label: 'Applied', icon: Send, caption: 'application_submitted' },
  { href: '/pipeline/ready', label: 'Ready', icon: FileCheck2, caption: 'packet_complete' },
  { href: '/pipeline/interested', label: 'Interested', icon: Heart, caption: 'selected' },
  { href: '/pipeline/recommended', label: 'Recommended', icon: Stars, caption: 'recommended' },
];

function TrayLink({ href, label, icon: Icon, active, caption }: { href: string; label: string; icon: React.ElementType; active?: boolean; caption?: string }) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          'flex items-start gap-3 rounded-2xl border px-3 py-3 transition-all',
          active ? 'border-primary/30 bg-primary/10 text-foreground shadow-sm shadow-primary/10' : 'border-border/70 bg-card/60 text-foreground hover:border-primary/20 hover:bg-card'
        )}
      >
        <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{label}</p>
          {caption ? <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p> : null}
        </div>
      </Link>
    </SheetClose>
  );
}

export function MobileWorkspaceTray({ job }: { job?: Job | null }) {
  const pathname = usePathname();
  const currentWorkflow = job ? getCurrentWorkflowStage(job.application_stage) : null;

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open workspace map"
            className="fixed bottom-4 left-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-card/95 text-foreground shadow-xl shadow-black/15 backdrop-blur supports-[backdrop-filter]:bg-card/85"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" hideDefaultClose className="w-[88vw] max-w-sm border-sidebar-border bg-sidebar p-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-sidebar-border px-4 pb-4 pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <BrandMark />
                <SheetClose asChild>
                  <button type="button" aria-label="Close workspace map" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 text-foreground transition-all hover:border-primary/30 hover:bg-card">
                    <PanelLeftClose className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Workspace Map</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Jump between Jobs views without breaking the application flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
              <section className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">App</p>
                <div className="grid gap-3">
                  {APP_LINKS.map((item) => <TrayLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} />)}
                </div>
              </section>

              <section className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Pipeline</p>
                <div className="grid gap-3">
                  {PIPELINE_LINKS.map((item) => (
                    <TrayLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      active={pathname === item.href}
                      caption={item.caption}
                    />
                  ))}
                </div>
              </section>

              {job ? (
                <>
                  <section className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Current job</p>
                    <div className="grid gap-3">
                      <TrayLink href={`/jobs/${job.id}`} label="Job Journey" icon={Briefcase} active={pathname === `/jobs/${job.id}`} caption={`${job.title} · ${job.company}`} />
                      <TrayLink href={currentWorkflow?.href(job.id) ?? `/jobs/${job.id}`} label="Current Step" icon={FileCheck2} active={pathname === (currentWorkflow?.href(job.id) ?? `/jobs/${job.id}`)} caption={currentWorkflow?.label ?? 'Not started'} />
                    </div>
                  </section>

                  <section className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Application stages</p>
                    <div className="grid gap-3">
                      {WORKFLOW_STAGES.map((stage) => <TrayLink key={stage.key} href={stage.href(job.id)} label={stage.label} icon={FolderKanban} active={pathname === stage.href(job.id)} caption={stage.description} />)}
                    </div>
                  </section>
                </>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
