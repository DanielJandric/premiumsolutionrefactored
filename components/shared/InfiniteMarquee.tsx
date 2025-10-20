"use client";

import { ReactNode } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMarquee({
  children,
  speed = "normal",
  pauseOnHover = true,
  className = "",
}: InfiniteMarqueeProps) {
  const speeds = {
    slow: "60s",
    normal: "40s",
    fast: "20s",
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex w-max gap-8 hover:pause-animation"
        style={{
          animation: `marquee ${speeds[speed]} linear infinite`,
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "running";
          }
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
