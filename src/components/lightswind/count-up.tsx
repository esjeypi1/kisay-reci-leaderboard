"use client";

// Lightswind count-up, adapted: renders the final value on the server (no "0" in the
// HTML), counts up once when scrolled into view, and stays static under reduced motion.
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const formatValue = (val: number, precision: number, sep: string): string =>
  val.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export interface CountUpProps {
  value: number;
  /** Seconds. */
  duration?: number;
  decimals?: number;
  separator?: string;
  /** Seconds to wait before counting, so it can follow a row's entrance. */
  delay?: number;
  className?: string;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CountUp({
  value,
  duration = 0.8,
  decimals = 0,
  separator = ",",
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const display = useTransform(count, (latest) => formatValue(latest, decimals, separator));

  useIsoLayoutEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }

    let controls: { stop: () => void } | undefined;
    count.set(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        controls = animate(count, value, {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        });
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      controls?.stop();
      count.set(value);
    };
  }, [value, duration, delay, reduceMotion, count]);

  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)}>
      <motion.span aria-hidden="true">{display}</motion.span>
      <span className="sr-only">{formatValue(value, decimals, separator)}</span>
    </span>
  );
}

export default CountUp;
