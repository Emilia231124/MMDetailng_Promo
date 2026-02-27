"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";

const VALUES = [
  {
    icon: "◆",
    title: "Качество",
    description:
      "Используем только сертифицированные материалы ведущих мировых брендов. Каждая работа проходит многоэтапный контроль.",
  },
  {
    icon: "◇",
    title: "Честность",
    description:
      "Прозрачные цены без скрытых доплат. Рассказываем о каждом этапе работы и отвечаем на все вопросы.",
  },
  {
    icon: "●",
    title: "Результат",
    description:
      "Гарантируем результат на каждую услугу. Если что-то не так — бесплатно исправим.",
  },
];

const TEAM = [
  { name: "Мурад", role: "Основатель & Мастер PPF", gradient: "linear-gradient(135deg, #1a0d2e 0%, #3a1a5e 100%)" },
  { name: "Алибек", role: "Мастер полировки", gradient: "linear-gradient(135deg, #2a1800 0%, #4a2d00 100%)" },
  { name: "Руслан", role: "Мастер детейлинга", gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 100%)" },
];

const STATS = [
  { value: "500+", label: "Автомобилей" },
  { value: "4", label: "Года работы" },
  { value: "100%", label: "Гарантия" },
  { value: "5★", label: "Средняя оценка" },
];

export default function AboutContent() {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = statsRef.current?.querySelectorAll<HTMLElement>("[data-stat]");
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );
    },
    { scope: statsRef }
  );

  return (
    <main>
      {/* Hero */}
      <section
        ref={heroRef}
        className="flex h-[50vh] items-end bg-[var(--bg-primary)] pb-12"
      >
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
            label="О НАС"
            title="БОЛЬШЕ ЧЕМ ДЕТЕЙЛИНГ"
            description="Страсть к идеальному автомобилю с 2021 года"
          />
        </div>
      </section>

      {/* История */}
      <section className="bg-[var(--bg-primary)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
                Наша история
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-tight text-[var(--text-primary)] md:text-5xl">
                MM Detailing — это...
              </h2>
              <div className="mt-6 space-y-4">
                <p className="font-body text-base leading-relaxed text-[var(--text-secondary)]">
                  MM Detailing был основан в 2021 году с одной целью — привнести
                  в Дагестан культуру настоящего премиального ухода за автомобилем.
                  Когда в регионе не было профессионального детейлинга, мы первыми
                  стали работать с PPF, керамикой и профессиональной полировкой.
                </p>
                <p className="font-body text-base leading-relaxed text-[var(--text-secondary)]">
                  За четыре года мы обработали более 500 автомобилей — от
                  повседневных машин до суперкаров стоимостью в десятки миллионов.
                  Каждый проект — это вызов, каждый результат — это наша гордость.
                </p>
                <p className="font-body text-base leading-relaxed text-[var(--text-secondary)]">
                  Мы постоянно учимся: проходим сертификацию у мировых брендов,
                  изучаем новые технологии и привозим в Дагестан лучшее, что есть
                  в индустрии детейлинга.
                </p>
              </div>
            </ScrollReveal>

            {/* Photo placeholder */}
            <ScrollReveal delay={0.15}>
              <div
                className="aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #0d1b2a 100%)",
                }}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <span
                    className="font-display text-8xl font-bold uppercase"
                    style={{ color: "rgba(200,169,126,0.15)" }}
                  >
                    MM
                  </span>
                  <span className="font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    Detailing Studio
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="bg-[var(--bg-secondary)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <SectionHeading
              label="Принципы"
              title="НАШИ ЦЕННОСТИ"
              align="center"
            />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center">
                  <span className="font-mono text-3xl text-[var(--accent-primary)]">
                    {value.icon}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
                    {value.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-[var(--text-secondary)]">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="bg-[var(--bg-primary)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <SectionHeading label="Люди" title="НАША КОМАНДА" />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                  <div
                    className="aspect-[4/3]"
                    style={{ background: member.gradient }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className="font-display text-5xl font-bold"
                        style={{ color: "rgba(255,255,255,0.08)" }}
                      >
                        {member.name[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
                      {member.role}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="bg-[var(--bg-secondary)] py-20">
        <div ref={statsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                data-stat
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center"
              >
                <div className="font-mono text-4xl font-bold text-[var(--accent-primary)]">
                  {stat.value}
                </div>
                <div className="mt-2 font-body text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-primary)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-10 text-center">
            <h2 className="font-display text-3xl font-bold uppercase text-[var(--text-primary)]">
              Приезжайте к нам
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-body text-[var(--text-secondary)]">
              Посмотрите студию, познакомьтесь с командой и получите бесплатную
              консультацию по уходу за вашим автомобилем
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              Как нас найти
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
