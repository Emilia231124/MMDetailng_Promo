"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  getServicesByCategory,
  formatPrice,
  type ServiceCategoryFilter,
} from "@/lib/data/services";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ServicesPageContent() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryFilter>("Все");

  const filtered = getServicesByCategory(activeCategory);

  return (
    <main>
      {/* Hero */}
      <section className="flex h-[50vh] items-end bg-[var(--bg-primary)] pb-12">
        <div
          className="pointer-events-none absolute inset-0 h-[50vh]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 h-[50vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,169,126,0.08) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="КАТАЛОГ"
            title="НАШИ УСЛУГИ"
            description="Полный спектр премиум детейлинга для вашего автомобиля"
          />
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-[64px] z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative shrink-0 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="filter-indicator"
                    className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-[var(--bg-primary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((service) => (
                <motion.div
                  key={service.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-300 hover:border-[var(--accent-primary)]"
                  >
                    {/* Image placeholder */}
                    <div
                      className="relative aspect-[16/10] overflow-hidden"
                      style={{ background: service.gradient }}
                    >
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)",
                          }}
                        />
                      </div>
                      <span
                        className="absolute bottom-2 right-3 font-display text-5xl font-bold uppercase leading-none"
                        style={{ color: "rgba(255,255,255,0.07)" }}
                      >
                        {service.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
                        {service.category}
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                        {service.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--text-secondary)]">
                        {service.desc}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono text-sm text-[var(--accent-primary)]">
                          от {formatPrice(service.priceNew)} ₽
                        </span>
                        <span
                          className="font-mono text-lg text-[var(--accent-primary)] transition-transform duration-300 group-hover:translate-x-2"
                          aria-hidden
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="py-24 text-center font-body text-[var(--text-secondary)]">
              Услуги в этой категории не найдены
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
