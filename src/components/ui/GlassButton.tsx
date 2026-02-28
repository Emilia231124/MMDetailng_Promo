"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlassButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "red";
  size?: "default" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const GlassButton = forwardRef<HTMLElement, GlassButtonProps>(
  ({ children, href, onClick, variant = "default", size = "default", className, style }, ref) => {
    const baseStyles = cn(
      // Основа
      "relative inline-flex items-center justify-center overflow-hidden",
      "font-mono text-sm uppercase tracking-[0.15em]",
      "transition-all duration-500 ease-out",
      "cursor-pointer select-none",

      // Стекло
      "backdrop-blur-sm",
      "border",

      // Размеры
      size === "default" && "px-8 py-3.5",
      size === "lg" && "px-12 py-5 text-base",

      // Варианты
      variant === "default" && [
        "bg-[rgba(255,255,255,0.03)]",
        "border-[rgba(255,255,255,0.1)]",
        "text-white",
        "hover:border-[rgba(255,255,255,0.25)]",
        "hover:bg-[rgba(255,255,255,0.06)]",
      ],
      variant === "red" && [
        "bg-[rgba(196,30,42,0.08)]",
        "border-[rgba(196,30,42,0.25)]",
        "text-white",
        "hover:border-[rgba(196,30,42,0.5)]",
        "hover:bg-[rgba(196,30,42,0.12)]",
      ],

      className
    );

    const content = (
      <>
        {/* Shine / отражение при hover */}
        <span
          className={cn(
            "absolute inset-0 z-0",
            "translate-x-[-100%] skew-x-[-20deg]",
            "bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.07)] to-transparent",
            "transition-transform duration-700 ease-out",
            "group-hover:translate-x-[100%]"
          )}
        />

        {/* Верхний блик (постоянный, subtle) — имитация стекла */}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />

        {/* Текст */}
        <span className="relative z-10">{children}</span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn("group", baseStyles)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          style={style}
          data-cursor-glass
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={cn("group", baseStyles)}
        ref={ref as React.Ref<HTMLButtonElement>}
        style={style}
        data-cursor-glass
      >
        {content}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
export default GlassButton;
