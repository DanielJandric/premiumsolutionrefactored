/**
 * SVG Patterns - Background decorative patterns
 * Dots, grids, waves pour enrichir le design
 */

import React from 'react';

interface SVGPatternsProps {
  pattern?: 'dots' | 'grid' | 'waves' | 'diagonal' | 'hexagon';
  className?: string;
  opacity?: number;
}

export function SVGPatterns({ pattern = 'dots', className = '', opacity = 0.1 }: SVGPatternsProps) {
  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }}>
            <defs>
              <pattern id="dots-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        );

      case 'grid':
        return (
          <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }}>
            <defs>
              <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        );

      case 'waves':
        return (
          <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }} preserveAspectRatio="none">
            <defs>
              <pattern id="waves-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M0,50 Q25,25 50,50 T100,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves-pattern)" />
          </svg>
        );

      case 'diagonal':
        return (
          <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }}>
            <defs>
              <pattern id="diagonal-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-pattern)" />
          </svg>
        );

      case 'hexagon':
        return (
          <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }}>
            <defs>
              <pattern id="hexagon-pattern" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
          </svg>
        );

      default:
        return null;
    }
  };

  return <>{renderPattern()}</>;
}

// Decorative blobs component
interface BlobProps {
  className?: string;
  animate?: boolean;
  color?: string;
}

export function AnimatedBlob({ className = '', animate = true, color = 'primary' }: BlobProps) {
  return (
    <div
      className={`absolute w-64 h-64 bg-${color}/20 blur-3xl ${animate ? 'blob-animated' : 'blob'} ${className}`}
      aria-hidden="true"
    />
  );
}

// Section divider component
interface SectionDividerProps {
  variant?: 'wave' | 'slant' | 'curve' | 'peaks';
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ variant = 'wave', className = '', flip = false }: SectionDividerProps) {
  const renderDivider = () => {
    const transform = flip ? 'scale(1,-1)' : '';

    switch (variant) {
      case 'wave':
        return (
          <svg
            className={`w-full h-12 ${className}`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ transform }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            />
          </svg>
        );

      case 'slant':
        return (
          <svg
            className={`w-full h-12 ${className}`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ transform }}
          >
            <path d="M0,0 L1200,120 L1200,0 Z" fill="currentColor" />
          </svg>
        );

      case 'curve':
        return (
          <svg
            className={`w-full h-12 ${className}`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ transform }}
          >
            <path d="M0,0 Q600,120 1200,0 L1200,0 Z" fill="currentColor" />
          </svg>
        );

      case 'peaks':
        return (
          <svg
            className={`w-full h-12 ${className}`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ transform }}
          >
            <path d="M0,0 L200,60 L400,0 L600,60 L800,0 L1000,60 L1200,0 L1200,0 Z" fill="currentColor" />
          </svg>
        );

      default:
        return null;
    }
  };

  return <div className="relative">{renderDivider()}</div>;
}
