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
  gradient: string;
}

const SERVICES: Service[] = [
  {
    slug: "ppf",
    category: "Защита",
    title: "Защитная плёнка (PPF)",
    desc: "Невидимая защита кузова от сколов и царапин",
    priceFrom: 15000,
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)",
  },
  {
    slug: "ceramic",
    category: "Защита",
    title: "Керамическое покрытие",
    desc: "Нанокерамика с гидрофобным эффектом на годы",
    priceFrom: 12000,
    gradient: "linear-gradient(135deg, #1a0d2e 0%, #3a1a5e 100%)",
  },
  {
    slug: "polishing",
    category: "Восстановление",
    title: "Полировка кузова",
    desc: "Удаление царапин и восстановление блеска",
    priceFrom: 8000,
    gradient: "linear-gradient(135deg, #2a1800 0%, #4a2d00 100%)",
  },
  {
    slug: "interior",
    category: "Уход",
    title: "Химчистка салона",
    desc: "Глубокая чистка интерьера до заводского состояния",
    priceFrom: 5000,
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 100%)",
  },
  {
    slug: "tinting",
    category: "Стайлинг",
    title: "Тонировка стёкол",
    desc: "Премиальные плёнки с гарантией",
    priceFrom: 4000,
    gradient: "linear-gradient(135deg, #0d0d1a 0%, #1a1a3a 100%)",
  },
  {
    slug: "wash",
    category: "Уход",
    title: "Детейлинг-мойка",
    desc: "Бережная ручная мойка по технологии двух вёдер",
    priceFrom: 2000,
    gradient: "linear-gradient(135deg, #1a1000 0%, #2a1800 100%)",
  },
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
      className="bg-[var(--bg-primary)] py-28 md:py-36"
      aria-label="Наши услуги"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div ref={headingRef} className="mb-16">
          <SectionHeading
            label="УСЛУГИ"
            title="ЧТО МЫ ДЕЛАЕМ"
            description="Полный спектр детейлинг-услуг для вашего автомобиля"
          />
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              data-card
              className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-colors duration-300 hover:border-[var(--accent-primary)]"
            >
              {/* Image placeholder (aspect-[16/10]) */}
              {/* TODO: Replace with:
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              */}
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
                {/* Watermark category text */}
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
                    от {formatPrice(service.priceFrom)} ₽
                  </span>
                  {/* Arrow */}
                  <span
                    className="font-mono text-lg text-[var(--accent-primary)] transition-transform duration-300 group-hover:translate-x-2"
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
