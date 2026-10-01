"use client";

// Lightswind sheet, adapted: dialog semantics (role, aria-modal, labelled title),
// focus moves in and is restored on close, Tab stays inside, Escape and backdrop
// close it, page scroll is locked, Phosphor close icon, and reduced motion fades only.
import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used inside <Sheet>");
  return ctx;
}

interface SheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  const titleId = React.useId();
  const descriptionId = React.useId();
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange, titleId, descriptionId }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet();
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        {...props}
      />
    );
  },
);
SheetClose.displayName = "SheetClose";

const sideVariants = {
  bottom: { initial: { y: "100%" }, animate: { y: "0%" }, exit: { y: "100%" } },
  right: { initial: { x: "100%" }, animate: { x: "0%" }, exit: { x: "100%" } },
};

const subscribeNoop = () => () => {};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: keyof typeof sideVariants;
  /** Element to focus when the sheet opens; defaults to the first focusable element. */
  initialFocus?: React.RefObject<HTMLElement | null>;
}

const SheetContent = ({ side = "bottom", className, children, initialFocus, ...props }: SheetContentProps) => {
  const { open, setOpen, titleId, descriptionId } = useSheet();
  const reduceMotion = useReducedMotion();
  const panelRef = React.useRef<HTMLDivElement>(null);
  // Portals need document.body, which only exists after hydration.
  const mounted = React.useSyncExternalStore(subscribeNoop, () => true, () => false);

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, setOpen, initialFocus]);

  if (!mounted) return null;

  const variants = sideVariants[side];
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[hsl(var(--shadow-color)/0.45)]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            key="sheet-content"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={reduceMotion ? { opacity: 0 } : variants.initial}
            animate={reduceMotion ? { opacity: 1 } : variants.animate}
            exit={reduceMotion ? { opacity: 0 } : variants.exit}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", damping: 32, stiffness: 380 }}
            className={cn(
              "fixed z-50 bg-surface text-foreground shadow-[0_-12px_40px_-12px_hsl(var(--shadow-color)/0.35)]",
              side === "bottom" &&
                "inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-2xl border-t border-border pb-[max(1.25rem,env(safe-area-inset-bottom))]",
              side === "right" && "inset-y-0 right-0 h-full w-full max-w-md overflow-y-auto border-l border-border",
              className,
            )}
            {...(props as React.ComponentProps<typeof motion.div>)}
          >
            {children}
            <SheetClose
              aria-label="Close"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </SheetClose>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId } = useSheet();
  return <h2 id={titleId} className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
};

const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descriptionId } = useSheet();
  return <p id={descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
};

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle };
