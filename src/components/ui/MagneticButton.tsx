"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap-config";
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** Сила притяжения к курсору (0–1, default 0.3) */
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery(breakpoints.lg);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(buttonRef.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const sharedProps = {
    className: cn("inline-block", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    // tel:, mailto:, http: — нативный <a>, внутренние пути — Next.js Link
    const isExternal = /^(tel:|mailto:|https?:)/.test(href);
    if (isExternal) {
      return (
        <a
          ref={buttonRef as React.Ref<HTMLAnchorElement>}
          href={href}
          {...sharedProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link ref={buttonRef as React.Ref<HTMLAnchorElement>} href={href} {...sharedProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      {...sharedProps}
    >
      {children}
    </button>
  );
}
