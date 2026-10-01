"use client";

// Lightswind toast, adapted: theme tokens instead of fixed palettes, no backdrop blur,
// Phosphor icons, a 44px close target, and a fade-only entrance under reduced motion.
import * as React from "react";
import { CheckCircle, WarningCircle, X } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const ToastViewport = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
      className,
    )}
    {...props}
  />
);

const toastVariants = cva(
  "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface py-3 pl-4 pr-12 text-sm shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.35)]",
  {
    variants: {
      variant: {
        error: "border-danger/40",
        success: "border-border",
      },
    },
    defaultVariants: { variant: "error" },
  },
);

export interface ToastProps
  extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "error" | "success";
  onClose: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "error", onClose, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const Icon = variant === "error" ? WarningCircle : CheckCircle;
    return (
      <motion.div
        ref={ref}
        layout={!reduceMotion}
        role={variant === "error" ? "alert" : "status"}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: "spring", damping: 26, stiffness: 380 }}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <Icon
          size={20}
          weight="fill"
          aria-hidden="true"
          className={cn("mt-px shrink-0", variant === "error" ? "text-danger" : "text-success")}
        />
        <div className="min-w-0 flex-1 text-foreground">{children as React.ReactNode}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
        >
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      </motion.div>
    );
  },
);
Toast.displayName = "Toast";

export { Toast, ToastViewport };
