// Lightswind grid background, adapted: the line color comes from the --grid-line theme
// token, so it follows light/dark in CSS with no client JavaScript.
import React from "react";
import { cn } from "@/lib/utils";

export interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  /** Where the fade-out ellipse is centered, e.g. "50% 0%". */
  fadeOrigin?: string;
  children?: React.ReactNode;
}

export const GridBackground = ({
  className,
  children,
  gridSize = 28,
  fadeOrigin = "50% 0%",
  ...props
}: GridBackgroundProps) => {
  const mask = `radial-gradient(ellipse 80% 90% at ${fadeOrigin}, black 30%, transparent 75%)`;
  return (
    <div className={cn("relative isolate w-full", className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      {children}
    </div>
  );
};

export default GridBackground;
