/**
 * Skip Links - Liens de navigation pour l'accessibilité
 * Permet aux utilisateurs de clavier de sauter directement au contenu principal
 */

import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Aller au contenu principal' },
  { href: '#navigation', label: 'Aller à la navigation' },
  { href: '#footer', label: 'Aller au pied de page' },
];

export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  return (
    <div className={cn('skip-links', className)}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            // Base styles
            'fixed top-4 left-4 z-[10000]',
            'px-6 py-3 rounded-lg',
            'bg-primary text-primary-foreground',
            'font-semibold text-sm',
            'shadow-glow',
            // Accessibility: hidden by default, visible on focus
            'opacity-0 -translate-y-20 pointer-events-none',
            'focus:opacity-100 focus:translate-y-0 focus:pointer-events-auto',
            // Transitions
            'transition-all duration-300',
            // Focus ring
            'focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-4 focus:ring-offset-background'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

