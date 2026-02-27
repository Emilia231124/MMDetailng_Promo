"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastScrollY.current && y > 100);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-20 transition-colors duration-300",
          scrolled
            ? "backdrop-blur-md bg-[var(--glass)] border-b border-[var(--border)]"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold text-[var(--accent-primary)]">
              MM
            </span>
            <span className="font-body text-[10px] tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              Detailing
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Основная навигация">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative font-body text-sm uppercase tracking-wider transition-colors duration-200",
                    isActive
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--accent-primary)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Book button (desktop) */}
          <Link
            href="/booking"
            className="hidden lg:inline-flex items-center px-5 py-2.5 font-body text-sm font-medium uppercase tracking-wider bg-[var(--accent-primary)] text-black rounded-sm transition-transform duration-200 hover:scale-105"
          >
            Записаться
          </Link>

          {/* Burger (mobile) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={cn(
                "block h-[1.5px] w-6 bg-[var(--text-primary)] transition-transform duration-300",
                mobileOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-6 bg-[var(--text-primary)] transition-opacity duration-300",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-6 bg-[var(--text-primary)] transition-transform duration-300",
                mobileOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
              className="absolute right-6 top-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Nav links */}
            <nav className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-display text-4xl font-bold uppercase transition-colors duration-200",
                      pathname === link.href
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.4 }}
              >
                <Link
                  href="/booking"
                  className="mt-4 inline-flex items-center px-8 py-3 font-body text-sm font-medium uppercase tracking-wider bg-[var(--accent-primary)] text-black rounded-sm"
                >
                  Записаться
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
