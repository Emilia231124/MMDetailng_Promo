"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";

// Кастомный курсор — только для desktop.
// На touch-устройствах возвращает null, чтобы не тратить ресурсы.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery(breakpoints.lg);

  useEffect(() => {
    if (!isDesktop) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    gsap.set([dot, circle], { opacity: 0 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.set(dot, { opacity: 1, x: e.clientX - 4, y: e.clientY - 4 });
      gsap.to(circle, {
        opacity: 1,
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    // Обычный hover — курсор увеличивается
    const onEnter = () =>
      gsap.to(circle, { scale: 1.5, duration: 0.3, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(circle, { scale: 1, borderColor: "var(--accent-red)", duration: 0.3, ease: "power2.out" });

    // GlassButton / BorderTraceButton hover — курсор уменьшается, border красный
    const onGlassEnter = () =>
      gsap.to(circle, {
        scale: 0.5,
        borderColor: "var(--accent-red)",
        duration: 0.3,
        ease: "power2.out",
      });
    const onGlassLeave = () =>
      gsap.to(circle, {
        scale: 1,
        borderColor: "var(--accent-red)",
        duration: 0.3,
        ease: "power2.out",
      });

    const onMouseDown = () =>
      gsap.to([dot, circle], { scale: 0.8, duration: 0.1 });
    const onMouseUp = () =>
      gsap.to([dot, circle], { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)" });

    const onDocMouseLeave = () =>
      gsap.to([dot, circle], { opacity: 0, duration: 0.3 });
    const onDocMouseEnter = () =>
      gsap.to([dot, circle], { opacity: 1, duration: 0.3 });

    const bindInteractive = () => {
      const regular = document.querySelectorAll(
        "a:not([data-cursor-glass]), button:not([data-cursor-glass]), [data-cursor-hover]"
      );
      const glass = document.querySelectorAll<Element>("[data-cursor-glass]");

      regular.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      glass.forEach((el) => {
        el.addEventListener("mouseenter", onGlassEnter);
        el.addEventListener("mouseleave", onGlassLeave);
      });

      return { regular, glass };
    };

    let bound = bindInteractive();

    const observer = new MutationObserver(() => {
      bound.regular.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      bound.glass.forEach((el) => {
        el.removeEventListener("mouseenter", onGlassEnter);
        el.removeEventListener("mouseleave", onGlassLeave);
      });
      bound = bindInteractive();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.documentElement.addEventListener("mouseenter", onDocMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onDocMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onDocMouseEnter);
      bound.regular.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      bound.glass.forEach((el) => {
        el.removeEventListener("mouseenter", onGlassEnter);
        el.removeEventListener("mouseleave", onGlassLeave);
      });
      observer.disconnect();
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Маленькая точка — следует мгновенно */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[var(--accent-red)]"
        style={{ willChange: "transform" }}
      />
      {/* Большой круг — следует с lag */}
      <div
        ref={circleRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-[var(--accent-red)]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
