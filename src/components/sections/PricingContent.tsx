"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { SERVICES, formatPrice, type ServiceCategory } from "@/lib/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCapsuleButton from "@/components/ui/GlassCapsuleButton";

type CarType = "new" | "used";

const CATEGORY_ORDER: ServiceCategory[] = ["Защита", "Восстановление", "Уход", "Стайлинг"];

export default function PricingContent() {
  const [carType, setCarType] = useState<CarType>("new");
  const tableRef = useRef<HTMLDivElement>(null);
  const highlightRefs = useRef<Map<string, HTMLElement>>(new Map());

  const searchParams = useSearchParams();
  const highlightedService = searchParams.get("service");

  // Scroll to and highlight the targeted service on mount
  useEffect(() => {
    if (!highlightedService) return;
    const el = highlightRefs.current.get(highlightedService);
    if (!el) return;

    // Small delay to let page settle
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 600);

    return () => clearTimeout(timer);
  }, [highlightedService]);

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
      <section className="relative flex h-[50vh] items-end bg-[var(--bg-primary)] pb-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(196,30,42,0.08) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="page-container relative">
          <SectionHeading
            label="ПРАЙС-ЛИСТ"
            title="ЦЕНЫ"
            description="Прозрачные цены без скрытых платежей"
          />
        </div>
      </section>

      {/* Toggle */}
      <section className="sticky top-[64px] z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="page-container">
          <div className="flex items-center gap-2 py-4">
            {(["new", "used"] as CarType[]).map((type) => (
              <GlassCapsuleButton
                key={type}
                size="sm"
                onClick={() => setCarType(type)}
                className={`font-mono tracking-widest ${
                  carType === type ? "border-white/40 bg-white/5" : ""
                }`}
              >
                {type === "new" ? "Новый авто" : "С пробегом"}
              </GlassCapsuleButton>
            ))}
          </div>
        </div>
      </section>

      {/* Price table */}
      <section ref={tableRef} className="bg-[var(--bg-primary)] py-16 md:py-24">
        <div className="page-container">
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
                    {categoryServices.map((service, idx) => {
                      const isHighlighted = highlightedService === service.slug;

                      return (
                        <div
                          key={service.slug}
                          ref={(el) => {
                            if (el) highlightRefs.current.set(service.slug, el);
                            else highlightRefs.current.delete(service.slug);
                          }}
                          style={{ position: "relative" }}
                          className={
                            idx !== categoryServices.length - 1
                              ? "border-b border-[var(--border)]"
                              : ""
                          }
                        >
                          {/* Animated white border outline on highlight */}
                          <AnimatePresence>
                            {isHighlighted && (
                              <motion.div
                                aria-hidden
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  border: "1.5px solid rgba(255,255,255,0.85)",
                                  pointerEvents: "none",
                                  zIndex: 2,
                                }}
                                initial={{ opacity: 0, scaleX: 0.96, scaleY: 0.85 }}
                                animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                              />
                            )}
                          </AnimatePresence>

                          <Link
                            href={`/services/${service.slug}`}
                            data-row
                            className={`group relative flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--bg-elevated)] ${
                              isHighlighted ? "bg-[var(--bg-elevated)]" : ""
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span
                                className={`font-body transition-colors group-hover:text-[var(--accent-red)] ${
                                  isHighlighted
                                    ? "text-white"
                                    : "text-[var(--text-primary)]"
                                }`}
                              >
                                {service.title}
                              </span>
                            </div>

                            <div className="hidden shrink-0 px-8 sm:block">
                              <span className="font-mono text-xs text-[var(--text-muted)]">
                                {service.duration}
                              </span>
                            </div>

                            <div className="shrink-0 text-right">
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={`${service.slug}-${carType}`}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                  transition={{ duration: 0.2 }}
                                  className="block font-mono text-xl text-[var(--accent-red)]"
                                >
                                  {formatPrice(
                                    carType === "new" ? service.priceNew : service.priceUsed
                                  )}{" "}
                                  ₽
                                </motion.span>
                              </AnimatePresence>
                            </div>

                            <span
                              className="ml-4 shrink-0 font-mono text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent-red)]"
                              aria-hidden
                            >
                              →
                            </span>
                          </Link>
                        </div>
                      );
                    })}
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
              <GlassCapsuleButton as="link" href="/contact" size="md">
                Написать нам
              </GlassCapsuleButton>
              <GlassCapsuleButton as="link" href="/booking" size="md">
                Записаться
              </GlassCapsuleButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
