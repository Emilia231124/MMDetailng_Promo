"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import SectionHeading from "@/components/ui/SectionHeading";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Service {
  slug: string;
  category: string;
  title: string;
  desc: string;
  priceFrom: number;
}

const SERVICES: Service[] = [
  { slug: "ppf", category: "Защита", title: "Защитная плёнка (PPF)", desc: "Невидимая защита кузова от сколов и царапин", priceFrom: 15000 },
  { slug: "ceramic", category: "Защита", title: "Керамическое покрытие", desc: "Нанокерамика с гидрофобным эффектом на годы", priceFrom: 12000 },
  { slug: "polishing", category: "Восстановление", title: "Полировка кузова", desc: "Удаление царапин и восстановление блеска", priceFrom: 8000 },
  { slug: "interior", category: "Уход", title: "Химчистка салона", desc: "Глубокая чистка интерьера до заводского состояния", priceFrom: 5000 },
  { slug: "tinting", category: "Стайлинг", title: "Тонировка стёкол", desc: "Премиальные плёнки с гарантией", priceFrom: 4000 },
  { slug: "wash", category: "Уход", title: "Детейлинг-мойка", desc: "Бережная ручная мойка по технологии двух вёдер", priceFrom: 2000 },
];

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = headingRef.current;
      const grid = gridRef.current;
      if (!heading || !grid) return;

      // Heading reveal
      gsap.fromTo(
        heading,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: heading, start: "top 85%" },
        }
      );

      // Cards stagger
      const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: grid, start: "top 80%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--bg-primary)] py-32 md:py-40 lg:py-48"
      aria-label="Наши услуги"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div ref={headingRef} className="mb-16 md:mb-24">
          <SectionHeading
            label="УСЛУГИ"
            title="ЧТО МЫ ДЕЛАЕМ"
            description="Полный спектр детейлинг-услуг для вашего автомобиля"
          />
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              data-card
              className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-colors duration-300 hover:border-[var(--accent-red)]"
            >
              {/* Image placeholder (aspect-[16/10]) */}
              {/* TODO: Replace with:
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]">
                <div className="absolute inset-0 bg-[var(--mirror-gradient)] transition-transform duration-500 group-hover:scale-105" />
                <span
                  className="absolute bottom-2 right-3 font-display text-5xl font-bold uppercase leading-none"
                  style={{ color: "rgba(255,255,255,0.07)" }}
                >
                  {service.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-8">
                <span className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {service.category}
                </span>

                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {service.title}
                </h3>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-lg text-[var(--accent-red)]">
                    от {formatPrice(service.priceFrom)} ₽
                  </span>
                  {/* Arrow */}
                  <span
                    className="font-mono text-lg text-[var(--accent-red)] transition-transform duration-300 group-hover:translate-x-2"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
