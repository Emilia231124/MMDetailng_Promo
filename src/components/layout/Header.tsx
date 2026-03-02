"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import GlassCapsuleButton from "@/components/ui/GlassCapsuleButton";

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-20 transition-colors duration-300",
          scrolled
            ? "backdrop-blur-xl bg-[rgba(5,5,5,0.8)] border-b border-[var(--border)]"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="page-container flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 leading-none shrink-0">
            <span className="font-display text-2xl font-bold text-[var(--text-primary)]">MM</span>
            <span className="font-display text-2xl font-bold text-[var(--accent-red)]">✕</span>
            <span className="font-body text-[10px] tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              Detailing
            </span>
          </Link>

          {/* Desktop nav — по центру */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Основная навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm uppercase tracking-[0.15em] font-medium text-white/70 transition-colors duration-300 hover:text-white',
                  isActive(link.href) && 'text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA — справа */}
          <GlassCapsuleButton
            as="link"
            href="/booking"
            size="md"
            className="hidden lg:inline-flex"
          >
            Записаться
          </GlassCapsuleButton>

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
            <nav className="flex flex-col items-center gap-4 w-full px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="w-full max-w-xs"
                >
                  <GlassCapsuleButton
                    as="link"
                    href={link.href}
                    size="md"
                    className={cn(
                      "w-full justify-center",
                      isActive(link.href) ? "border-white/40 bg-white/5" : ""
                    )}
                  >
                    {link.label}
                  </GlassCapsuleButton>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.4 }}
                className="w-full max-w-xs mt-2"
              >
                <GlassCapsuleButton
                  as="link"
                  href="/booking"
                  size="md"
                  className="w-full justify-center border-white/30"
                >
                  Записаться
                </GlassCapsuleButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
