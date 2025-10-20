"use client";

import {
  motion,
  useAnimation,
  type MotionProps,
  useInView,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  delay = 0,
  className,
  ...motionProps
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      }}
      {...motionProps}
    >
      {children}
    </motion.section>
  );
}
