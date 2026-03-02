"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import SectionHeading from "@/components/ui/SectionHeading";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Review {
  id: string;
  author: string;
  car: string;
  rating: number;
  text: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Магомед Алиев",
    car: "BMW X5 2022",
    rating: 5,
    text: "Отдал X5 на полную полировку и керамику. Результат превзошёл все ожидания — машина сияет как новая. Работают аккуратно, всё объясняют. Рекомендую всем.",
  },
  {
    id: "2",
    author: "Руслан Гаджиев",
    car: "Mercedes S-Class 2023",
    rating: 5,
    text: "Установили PPF на весь кузов. Плёнка легла идеально, ни единого пузыря. Мастера профессионалы своего дела, работают с душой. Буду возвращаться.",
  },
  {
    id: "3",
    author: "Залина Исаева",
    car: "Toyota Land Cruiser 300",
    rating: 5,
    text: "Химчистка салона — это отдельный вид искусства в этом месте. Убрали пятна, которые я уже считала несмываемыми. Запах свежести, как будто машина только с завода.",
  },
  {
    id: "4",
    author: "Арсен Мусаев",
    car: "Porsche Cayenne 2023",
    rating: 5,
    text: "Делал полировку перед продажей — покупатель думал, что авто новое. Вот что значит настоящий детейлинг. Цена соответствует качеству, даже дешевле, чем ожидал.",
  },
  {
    id: "5",
    author: "Патимат Хасанова",
    car: "Range Rover Sport 2022",
    rating: 5,
    text: "Тонировка и PPF на фары. Всё сделано аккуратно, за оговорённое время. Приятный персонал, чистый бокс. Советую всем кто ценит своё авто.",
  },
  {
    id: "6",
    author: "Шамиль Кадиев",
    car: "Audi Q8 2023",
    rating: 5,
    text: "Керамическое покрытие нанесли мастерски. Гидрофобный эффект работает даже спустя полгода. Теперь мытьё занимает 10 минут вместо часа. Экономия и красота.",
  },
  {
    id: "7",
    author: "Хабиб Рамазанов",
    car: "BMW 5 Series 2022",
    rating: 5,
    text: "Лучший детейлинг в Дагестане — без преувеличений. Уже третий раз обращаюсь. Профессионализм, скорость, результат — всё на высшем уровне.",
  },
  {
    id: "8",
    author: "Марьям Абдуллаева",
    car: "Mercedes GLE 2021",
    rating: 5,
    text: "Подарила мужу химчистку — остался в восторге. Убрали всё: детские пятна, запах, потёртости на кже. Это лучший подарок для любого автовладельца.",
  },
];

// Stars renderer
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} из 5 звёзд`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-sm"
          style={{ color: i < count ? "var(--accent-red)" : "var(--text-muted)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Single review card
function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      className="flex min-w-[360px] flex-col rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-8 md:min-w-[440px] md:p-10"
      aria-label={`Отзыв от ${review.author}`}
    >
      <div className="flex gap-1.5 mb-6">
        <Stars count={review.rating} />
      </div>
      <p className="line-clamp-3 font-body text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
        {review.text}
      </p>
      <div className="h-px bg-[var(--border)] my-6" />
      <p className="font-body text-base font-medium text-[var(--text-primary)]">
        {review.author}
      </p>
      <p className="mt-1 font-mono text-sm text-[var(--text-muted)]">
        {review.car}
      </p>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Ticker row — duplicates cards for seamless infinite scroll
// ---------------------------------------------------------------------------

function TickerRow({
  reviews,
  direction,
}: {
  reviews: Review[];
  direction: "left" | "right";
}) {
  // Duplicate the array to create a seamless loop
  const doubled = [...reviews, ...reviews];
  const animClass =
    direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="overflow-hidden">
      {/* Pause on hover — arbitrary Tailwind property */}
      <div
        className={`flex gap-6 ${animClass} hover:[animation-play-state:paused]`}
        aria-hidden={direction === "right"} // Second row is decorative
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = headingRef.current;
      if (!heading) return;

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
    },
    { scope: sectionRef }
  );

  // Split reviews into two rows for visual variation
  const row1 = REVIEWS.slice(0, 5);
  const row2 = REVIEWS.slice(3); // slight overlap for visual density

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[var(--bg-primary)] py-32 md:py-40 lg:py-48"
      aria-label="Отзывы клиентов"
    >
      {/* Heading */}
      <div ref={headingRef} className="page-container mb-16">
        <SectionHeading
          label="ОТЗЫВЫ"
          title="ЧТО ГОВОРЯТ КЛИЕНТЫ"
          align="center"
        />
      </div>

      {/* Ticker rows */}
      <div className="flex flex-col gap-6">
        <TickerRow reviews={row1} direction="left" />
        <TickerRow reviews={row2} direction="right" />
      </div>
    </section>
  );
}
