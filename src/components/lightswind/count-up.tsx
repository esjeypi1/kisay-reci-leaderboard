"use client";

// Lightswind count-up, adapted: renders the final value on the server (no "0" in the
// HTML), counts up once when scrolled into view, animates from the old value (with a flash)
// when it changes after a refresh, and stays static under reduced motion.
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

  // The value shown before this render's change; null until the first count.
  const previous = useRef<number | null>(null);

  useIsoLayoutEffect(() => {
    const from = previous.current;
    previous.current = value;

    if (reduceMotion) {
      count.set(value);
      return;
    }

    // Later changes (after a refresh) animate from the old value and flash once.
    if (from !== null) {
      if (from === value) return;
      const controls = animate(count, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      const el = ref.current;
      el?.classList.remove("points-flash");
      void el?.offsetWidth;
      el?.classList.add("points-flash");
      return () => controls.stop();
    }

    // First view: count up from zero once the number scrolls into view.
    let controls: { stop: () => void } | undefined;
    let started = false;
    count.set(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        started = true;
        controls = animate(count, value, { duration, delay, ease: [0.16, 1, 0.3, 1] });
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      controls?.stop();
      count.set(value);
      // Torn down before it ever counted (e.g. a dev double-run): count again next time.
      if (!started) previous.current = null;
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
