"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BorderTraceButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  traceColor?: "white" | "red";
  className?: string;
}

const BorderTraceButton = forwardRef<HTMLElement, BorderTraceButtonProps>(
  ({ children, href, onClick, traceColor = "white", className }, ref) => {
    const glowColor =
      traceColor === "red" ? "rgba(196, 30, 42, 0.8)" : "rgba(255, 255, 255, 0.6)";

    const shadowColor =
      traceColor === "red" ? "rgba(196, 30, 42, 0.4)" : "rgba(255, 255, 255, 0.2)";

    const baseStyles = cn(
      "relative inline-flex items-center justify-center",
      "font-mono text-sm uppercase tracking-[0.15em]",
      "px-8 py-3.5",
      "bg-transparent",
      "text-white",
      "cursor-pointer select-none",
      "group",
      className
    );

    const content = (
      <>
        {/* SVG border с анимированной линией */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Статичный border — всегда виден */}
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="0"
            ry="0"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          {/* Анимированный trace — виден при hover */}
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="0"
            ry="0"
            fill="none"
            stroke={glowColor}
            strokeWidth="1.5"
            strokeDasharray="60 500"
            strokeDashoffset="0"
            className={cn(
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300",
              "[animation:border-trace_3s_linear_infinite]",
              "group-hover:[animation-play-state:running]",
              "[animation-play-state:paused]"
            )}
            style={{
              filter: `drop-shadow(0 0 6px ${shadowColor})`,
            }}
          />
        </svg>

        {/* Текст */}
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={baseStyles}
          ref={ref as React.Ref<HTMLAnchorElement>}
          data-cursor-glass
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={baseStyles}
        ref={ref as React.Ref<HTMLButtonElement>}
        data-cursor-glass
      >
        {content}
      </button>
    );
  }
);

BorderTraceButton.displayName = "BorderTraceButton";
export default BorderTraceButton;
