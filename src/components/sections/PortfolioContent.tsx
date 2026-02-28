"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_ITEMS, type PortfolioItem } from "@/lib/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";

const CATEGORIES = ["Все", "Защита", "Восстановление", "Уход", "Стайлинг"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function BeforeAfterCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-left transition-colors hover:border-[var(--accent-red)]"
      aria-label={`Открыть работу: ${item.title}`}
    >
      {/* Before / After */}
      <div className="grid grid-cols-2">
        <div className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]">
          <div
            className="h-full w-full"
            style={{ background: item.gradientBefore }}
          >
            <div className="flex h-full items-end p-2">
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/60">
                До
              </span>
            </div>
          </div>
        </div>
        <div className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]">
          <div
            className="h-full w-full"
            style={{ background: item.gradientAfter }}
          >
            <div className="flex h-full items-end p-2">
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-red)]">
                После
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
          {item.category}
        </span>
        <span className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">
          {item.title}
        </span>
        <span className="mt-3 font-mono text-xs text-[var(--text-secondary)]">
          Нажмите для просмотра →
        </span>
      </div>
    </button>
  );
}

function PortfolioModal({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Before / After large */}
        <div className="grid grid-cols-2">
          <div
            className="aspect-[16/10]"
            style={{ background: item.gradientBefore }}
          >
            <div className="flex h-full items-end p-3">
              <span className="rounded bg-black/50 px-2 py-1 font-mono text-xs uppercase tracking-widest text-white/60">
                До
              </span>
            </div>
          </div>
          <div
            className="aspect-[16/10]"
            style={{ background: item.gradientAfter }}
          >
            <div className="flex h-full items-end p-3">
              <span className="rounded bg-black/50 px-2 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
                После
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
            {item.category}
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">
            {item.title}
          </h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-[var(--text-secondary)]">
            {item.description}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <Link
              href={`/services/${item.serviceSlug}`}
              className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)] underline underline-offset-4"
              onClick={onClose}
            >
              Подробнее об услуге →
            </Link>
            <button
              onClick={onClose}
              className="rounded-full border border-[var(--border)] px-5 py-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-red)] hover:text-[var(--text-primary)]"
            >
              Закрыть
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Все");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filtered =
    activeCategory === "Все"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <main>
      {/* Hero */}
      <section className="flex h-[50vh] items-end bg-[var(--bg-primary)] pb-12">
        <div
          className="pointer-events-none absolute inset-0 h-[50vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(196,30,42,0.08) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="ГАЛЕРЕЯ РАБОТ"
            title="ПОРТФОЛИО"
            description="Наши лучшие работы — результат говорит сам за себя"
          />
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-[64px] z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative shrink-0 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-[var(--accent-red)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-red)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="portfolio-filter"
                    className="absolute inset-0 rounded-full bg-[var(--accent-red)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[var(--bg-primary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.25 }}
                >
                  <BeforeAfterCard item={item} onClick={() => setSelectedItem(item)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="py-24 text-center font-body text-[var(--text-secondary)]">
              Работ в этой категории пока нет
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
