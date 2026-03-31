'use client';
/* ============================================================
   CopyButton — One-click copy to clipboard with feedback
   ============================================================ */
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function CopyButton({ text, label = 'Copy', className, variant = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseClasses = 'inline-flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-[0_0_18px_hsl(var(--primary)/0.18)]',
    ghost: 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
    outline: 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:shadow-md',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
