"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { SERVICES, SERVICE_CATEGORIES, formatPrice, type ServiceCategory } from "@/lib/data/services";
import SectionHeading from "@/components/ui/SectionHeading";

type CarType = "new" | "used";

const CATEGORY_ORDER: ServiceCategory[] = ["Защита", "Восстановление", "Уход", "Стайлинг"];

export default function PricingContent() {
  const [carType, setCarType] = useState<CarType>("new");
  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = tableRef.current?.querySelectorAll<HTMLElement>("[data-row]");
      if (!rows || rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: tableRef }
  );

  return (
    <main>
      {/* Hero */}
      <section className="flex h-[50vh] items-end bg-[var(--bg-primary)] pb-12">
        <div
          className="pointer-events-none absolute inset-0 h-[50vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,169,126,0.08) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="ПРАЙС-ЛИСТ"
            title="ЦЕНЫ"
            description="Прозрачные цены без скрытых платежей"
          />
        </div>
      </section>

      {/* Toggle */}
      <section className="sticky top-[64px] z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {(["new", "used"] as CarType[]).map((type) => (
              <button
                key={type}
                onClick={() => setCarType(type)}
                className={`relative px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-200 ${
                  carType === type
                    ? "text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {type === "new" ? "Новый авто" : "С пробегом"}
                {carType === type && (
                  <motion.div
                    layoutId="price-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Price table */}
      <section ref={tableRef} className="bg-[var(--bg-primary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {CATEGORY_ORDER.map((category) => {
              const categoryServices = SERVICES.filter((s) => s.category === category);
              if (categoryServices.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
                    {category}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                    {categoryServices.map((service, idx) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        data-row
                        className={`group flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--bg-elevated)] ${
                          idx !== categoryServices.length - 1
                            ? "border-b border-[var(--border)]"
                            : ""
                        }`}
                      >
                        {/* Name */}
                        <div className="min-w-0 flex-1">
                          <span className="font-body text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                            {service.title}
                          </span>
                        </div>

                        {/* Duration */}
                        <div className="hidden shrink-0 px-8 sm:block">
                          <span className="font-mono text-xs text-[var(--text-muted)]">
                            {service.duration}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="shrink-0 text-right">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={`${service.slug}-${carType}`}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.2 }}
                              className="block font-mono text-xl text-[var(--accent-primary)]"
                            >
                              {formatPrice(
                                carType === "new" ? service.priceNew : service.priceUsed
                              )}{" "}
                              ₽
                            </motion.span>
                          </AnimatePresence>
                        </div>

                        {/* Arrow */}
                        <span
                          className="ml-4 shrink-0 font-mono text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent-primary)]"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center">
            <h3 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
              Не знаете что выбрать?
            </h3>
            <p className="mx-auto mt-3 max-w-md font-body text-[var(--text-secondary)]">
              Расскажите о вашем автомобиле — мы подберём оптимальный комплекс услуг
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full border border-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--accent-primary)] transition-colors hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
              >
                Написать нам
              </Link>
              <Link
                href="/booking"
                className="rounded-full bg-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                Записаться
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
