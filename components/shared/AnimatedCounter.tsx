"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2.5,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  className = "",
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-primary/20 bg-card/80 p-4 shadow-sm shadow-primary/10 backdrop-blur transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 dark:border-primary/30 dark:bg-card/25 card-3d ${className}`}
    >
      <dt className="text-xs font-semibold uppercase tracking-wide text-primary">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-foreground">
        {inView ? (
          <CountUp
            end={end}
            duration={duration}
            suffix={suffix}
            prefix={prefix}
            decimals={decimals}
            useEasing={true}
            easingFn={(t, b, c, d) => {
              // Custom spring easing
              return c * ((t = t / d - 1) * t * t + 1) + b;
            }}
          />
        ) : (
          <span>
            {prefix}0{suffix}
          </span>
        )}
      </dd>
    </div>
  );
}
