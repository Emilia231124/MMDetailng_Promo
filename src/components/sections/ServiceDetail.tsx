"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { formatPrice, getRelatedServices, type ServiceData } from "@/lib/data/services";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface ServiceDetailProps {
  service: ServiceData;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const related = getRelatedServices(service.slug);

  // Parallax на hero-фоне
  useGSAP(
    () => {
      const bg = heroRef.current?.querySelector<HTMLElement>("[data-parallax-bg]");
      if (!bg) return;

      gsap.to(bg, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroRef }
  );

  return (
    <main>
      {/* Hero */}
      <div ref={heroRef} className="relative h-[60vh] overflow-hidden">
        {/* Background */}
        <div
          data-parallax-bg
          className="absolute inset-0 scale-110"
          style={{ background: service.gradient }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(196,30,42,0.12) 0%, transparent 60%)",
            }}
          />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)",
          }}
        />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
              {service.category}
            </span>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl">
              {service.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="bg-[var(--bg-primary)] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            {service.fullDescription.map((para, i) => (
              <p
                key={i}
                className="mb-5 font-body text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
              >
                {para}
              </p>
            ))}
          </ScrollReveal>

          {/* Features checklist */}
          <ScrollReveal delay={0.1} className="mt-10">
            <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
              Что включено
            </h2>
            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-mono text-[var(--accent-red)]">✓</span>
                  <span className="font-body text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[var(--bg-secondary)] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="mb-10 font-display text-3xl font-bold uppercase text-[var(--text-primary)]">
              Стоимость
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* New car */}
              <div className="relative rounded-xl border border-[var(--accent-red)] bg-[var(--bg-elevated)] p-6">
                <div className="absolute right-4 top-4 rounded-full bg-[var(--accent-red)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--bg-primary)]">
                  Выгоднее
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
                  Новый автомобиль
                </span>
                <div className="mt-2 font-mono text-4xl font-bold text-[var(--text-primary)]">
                  {formatPrice(service.priceNew)}{" "}
                  <span className="text-2xl text-[var(--text-secondary)]">₽</span>
                </div>
                <p className="mt-2 font-body text-xs text-[var(--text-muted)]">
                  для авто без пробега
                </p>
              </div>

              {/* Used car */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  Автомобиль с пробегом
                </span>
                <div className="mt-2 font-mono text-4xl font-bold text-[var(--text-primary)]">
                  {formatPrice(service.priceUsed)}{" "}
                  <span className="text-2xl text-[var(--text-secondary)]">₽</span>
                </div>
                <p className="mt-2 font-body text-xs text-[var(--text-muted)]">
                  б/у автомобиль
                </p>
              </div>
            </div>

            <p className="mt-4 font-mono text-sm text-[var(--text-secondary)]">
              ⏱ Примерное время: {service.duration}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-primary)] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center">
            <h2 className="font-display text-3xl font-bold uppercase text-[var(--text-primary)]">
              Записаться на эту услугу
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-[var(--text-secondary)]">
              Оставьте заявку и мы свяжемся с вами в течение 30 минут
            </p>
            <Link
              href={`/booking?service=${service.slug}`}
              className="mt-6 inline-block rounded-full bg-[var(--accent-red)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              Записаться
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="bg-[var(--bg-secondary)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="mb-10 font-display text-3xl font-bold uppercase text-[var(--text-primary)]">
                Похожие услуги
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, i) => (
                <ScrollReveal key={rel.slug} delay={i * 0.08}>
                  <Link
                    href={`/services/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent-red)]"
                  >
                    <div
                      className="aspect-[16/9] transition-transform duration-500 group-hover:scale-105"
                      style={{ background: rel.gradient }}
                    />
                    <div className="p-5">
                      <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-red)]">
                        {rel.category}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">
                        {rel.title}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-[var(--accent-red)]">
                        от {formatPrice(rel.priceNew)} ₽
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
