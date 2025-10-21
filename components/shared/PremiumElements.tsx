/**
 * Premium Elements - Badges, ribbons, progress bars premium
 */

import { cn } from '@/lib/utils';

// ========================================
// PREMIUM BADGE
// ========================================

interface PremiumBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'platinum' | 'diamond';
  animated?: boolean;
  className?: string;
}

export function PremiumBadge({
  children,
  variant = 'gold',
  animated = true,
  className,
}: PremiumBadgeProps) {
  const variantClasses = {
    gold: 'bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400 text-gold-900',
    platinum: 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 text-slate-900',
    diamond: 'bg-gradient-to-r from-primary via-secondary to-primary text-white',
  };

  const glowClasses = {
    gold: 'glow-gold',
    platinum: 'shadow-xl shadow-slate-400/30',
    diamond: 'glow',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm',
        variantClasses[variant],
        animated && 'shimmer animate-shimmer',
        animated && glowClasses[variant],
        'border-2 border-white/20',
        className
      )}
    >
      {variant === 'gold' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {children}
    </div>
  );
}

// ========================================
// RIBBON
// ========================================

interface RibbonProps {
  text: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
}

export function Ribbon({
  text,
  position = 'top-right',
  variant = 'primary',
  className,
}: RibbonProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0 -rotate-45 -translate-x-8 translate-y-6',
    'top-right': 'top-0 right-0 rotate-45 translate-x-8 translate-y-6',
    'bottom-left': 'bottom-0 left-0 rotate-45 -translate-x-8 -translate-y-6',
    'bottom-right': 'bottom-0 right-0 -rotate-45 translate-x-8 -translate-y-6',
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-glow',
    secondary: 'bg-secondary text-secondary-foreground',
    gold: 'bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400 text-gold-900 glow-gold',
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={cn(
          'absolute z-10 px-12 py-2 text-center font-semibold text-sm whitespace-nowrap',
          positionClasses[position],
          variantClasses[variant],
          className
        )}
      >
        {text}
      </div>
    </div>
  );
}

// ========================================
// PROGRESS BAR
// ========================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'striped';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary',
    gradient: 'bg-gradient-to-r from-primary via-secondary to-primary',
    striped:
      'bg-gradient-to-r from-primary via-secondary to-primary bg-[length:20px_100%] animate-shimmer',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-primary">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-muted overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// ========================================
// CERTIFICATION BADGE
// ========================================

interface CertificationBadgeProps {
  title: string;
  icon?: React.ReactNode;
  verified?: boolean;
  className?: string;
}

export function CertificationBadge({
  title,
  icon,
  verified = true,
  className,
}: CertificationBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 px-4 py-3 rounded-xl',
        'bg-gradient-to-br from-card to-card/50',
        'border border-primary/20',
        'shadow-sm shadow-primary/10',
        'hover:shadow-md hover:shadow-primary/20',
        'transition-all duration-300',
        'group',
        className
      )}
    >
      {icon || (
        <svg
          className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div>
        <div className="font-semibold text-sm text-foreground">{title}</div>
        {verified && (
          <div className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verifie
          </div>
        )}
      </div>
    </div>
  );
}
