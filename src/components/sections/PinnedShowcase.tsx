"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   НАСТРАИВАЕМЫЕ ПАРАМЕТРЫ

   Чтобы подкрутить анимацию — меняй значения здесь.
   После изменения сохрани файл → страница перезагрузится (HMR).

   ОБЩЕЕ ПРАВИЛО:
   - Все значения фаз — в секундах на timeline (не реальных секундах,
     а "условных единицах" длины timeline).
   - Чем больше число — тем дольше длится фаза.
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  // ── Сколько vh скролла = 1 слайд ──
  // Больше → медленнее, больше скроллить. Меньше → быстрее.
  // Рекомендую: 3 (средне), 4 (медленно), 2.5 (быстро)
  scrollPerSlide: 3.5,

  // ── Плавность привязки к скроллу (GSAP scrub) ──
  // Число = секунды "отставания" анимации от скролла.
  // 0.5 = отзывчиво, 1 = плавно, 2 = очень тягуче
  scrub: 1.2,

  // ── Длительности фаз (условные единицы timeline) ──
  // Можешь менять пропорции. Сумма = общая длина цикла одного слайда.
  phase1_darkness: 0.03,      // Темнота в начале
  phase2_imageIn: 0.45,       // Проявление фото
  phase3_titleIn: 0.45,       // Появление заголовка
  phase4_descIn: 0.5,        // Появление description
  phase4_pause: 0.02,         // Пауза (всё видно, чтение)
  phase5_fadeOut: 0.2,       // Затухание всего
  phase5_darkness: 0.03,      // Темнота в конце (буфер перед след. слайдом)

  // ── Заголовок ──
  titleMaxOpacity: 0.7,      // Макс. прозрачность (0.7 = полупрозрачный, 1 = непрозрачный)
  titleRise: 50,             // На сколько px поднимается снизу (20=лёгкий, 50=средний, 80=сильный)

  // ── Description ──
  descMaxOpacity: 1,         // Макс. прозрачность
  descRise: 30,              // На сколько px поднимается

  // ── Фото ──
  imageScale: 1.0,          // Начальный масштаб (zoom-out эффект). 1.0 = без зума.
};

/* ═══════════════════════════════════════════════════════════════
   ДАННЫЕ СЛАЙДОВ
   ═══════════════════════════════════════════════════════════════ */
const slides = [
  {
    id: "ppf",
    title: "ЗАЩИТНАЯ ПЛЁНКА",
    subtitle: "PAINT PROTECTION FILM",
    description: "Невидимая броня для вашего автомобиля. Защита от сколов, царапин и дорожных реагентов.",
    image: "/images/services/ppf.png",
  },
  {
    id: "ceramic",
    title: "КЕРАМИКА",
    subtitle: "CERAMIC COATING",
    description: "Нанокерамическое покрытие с гидрофобным эффектом. Блеск и защита на годы.",
    image: "/images/services/ceramic.png",
  },
  {
    id: "polish",
    title: "ПОЛИРОВКА",
    subtitle: "PAINT CORRECTION",
    description: "Восстановление идеального блеска. Удаление царапин, голограмм и окислов.",
    image: "/images/services/polish.png",
  },
  {
    id: "interior",
    title: "ХИМЧИСТКА",
    subtitle: "INTERIOR DETAILING",
    description: "Глубокая чистка салона до заводского состояния.",
    image: "/images/services/interior.png",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════
   КОМПОНЕНТ
   ═══════════════════════════════════════════════════════════════ */
export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Refs для каждого слайда
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const subtitleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !pinRef.current) return;

    // Длина цикла одного слайда на timeline
    const slideDuration =
      CONFIG.phase1_darkness +
      CONFIG.phase2_imageIn +
      CONFIG.phase3_titleIn +
      CONFIG.phase4_descIn +
      CONFIG.phase4_pause +
      CONFIG.phase5_fadeOut +
      CONFIG.phase5_darkness;

    // ── MASTER TIMELINE ──
    const master = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${slides.length * CONFIG.scrollPerSlide * window.innerHeight}`,
        pin: pinRef.current,
        scrub: CONFIG.scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // ── Начальное состояние: ВСЁ скрыто ──
    slides.forEach((_, i) => {
      gsap.set(imageRefs.current[i], { opacity: 0, scale: CONFIG.imageScale });
      gsap.set(titleRefs.current[i], { opacity: 0, y: CONFIG.titleRise });
      gsap.set(subtitleRefs.current[i], { opacity: 0, y: 20 });
      gsap.set(descRefs.current[i], { opacity: 0, y: CONFIG.descRise });
    });

    // ── Для каждого слайда добавляем анимации на master timeline ──
    slides.forEach((_, i) => {
      const img = imageRefs.current[i];
      const title = titleRefs.current[i];
      const subtitle = subtitleRefs.current[i];
      const desc = descRefs.current[i];
      if (!img || !title || !desc) return;

      // Позиция старта этого слайда на master timeline
      const offset = i * slideDuration;

      // Курсор — текущая позиция внутри цикла слайда
      let cursor = offset;

      // ── ФАЗА 1: Темнота (ничего не делаем, просто ждём) ──
      cursor += CONFIG.phase1_darkness;

      // ── ФАЗА 2: Фото проявляется ──
      master.to(img, {
        opacity: 1,
        scale: 1,
        duration: CONFIG.phase2_imageIn,
        ease: "none",
      }, cursor);
      cursor += CONFIG.phase2_imageIn;

      // ── ФАЗА 3: Заголовок появляется (подъём + fade до 0.7) ──
      // Subtitle чуть раньше
      master.to(subtitle, {
        opacity: 0.5,
        y: 0,
        duration: CONFIG.phase3_titleIn * 0.6,
        ease: "power2.out",
      }, cursor);

      master.to(title, {
        opacity: CONFIG.titleMaxOpacity,
        y: 0,
        duration: CONFIG.phase3_titleIn,
        ease: "power2.out",
      }, cursor);
      cursor += CONFIG.phase3_titleIn;

      // ── ФАЗА 4: Description появляется ──
      master.to(desc, {
        opacity: CONFIG.descMaxOpacity,
        y: 0,
        duration: CONFIG.phase4_descIn,
        ease: "power2.out",
      }, cursor);
      cursor += CONFIG.phase4_descIn;

      // ── ПАУЗА: всё видно (ничего не анимируем) ──
      cursor += CONFIG.phase4_pause;

      // ── ФАЗА 5: Всё затухает одновременно ──
      master.to(img, {
        opacity: 0,
        duration: CONFIG.phase5_fadeOut,
        ease: "none",
      }, cursor);

      master.to(title, {
        opacity: 0,
        duration: CONFIG.phase5_fadeOut,
        ease: "none",
      }, cursor);

      master.to(subtitle, {
        opacity: 0,
        duration: CONFIG.phase5_fadeOut,
        ease: "none",
      }, cursor);

      master.to(desc, {
        opacity: 0,
        duration: CONFIG.phase5_fadeOut,
        ease: "none",
      }, cursor);

      // cursor += CONFIG.phase5_fadeOut;
      // phase5_darkness — пустое время (темнота) перед следующим слайдом
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${slides.length * CONFIG.scrollPerSlide * 100}vh` }}
    >
      {/* Pinned контейнер — весь экран, не двигается при скролле */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)]"
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0 pointer-events-none">

            {/* ── Фоновое изображение ── */}
            <div
              ref={(el) => { imageRefs.current[i] = el; }}
              className="absolute inset-0 will-change-transform"
              style={{ opacity: 0 }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                quality={85}
              />

              {/* Overlay для читаемости текста поверх фото */}
              <div className="absolute inset-0 bg-[rgba(5,5,5,0.30)]" />
            </div>

            {/* ── Текст — СТРОГО ПО ЦЕНТРУ экрана ── */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">

              {/* Subtitle */}
              <span
                ref={(el) => { subtitleRefs.current[i] = el; }}
                className="font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--accent-red)] mb-3 sm:mb-4 md:mb-6"
                style={{ opacity: 0 }}
              >
                {slide.subtitle}
              </span>

              {/* Заголовок — крупный, по центру, ПОЛУПРОЗРАЧНЫЙ */}
              <h3
                ref={(el) => { titleRefs.current[i] = el; }}
                className="font-display text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center uppercase leading-[0.9] tracking-tight"
                style={{ opacity: 0 }}
              >
                {slide.title}
              </h3>

              {/* Description — под заголовком, по центру */}
              <p
                ref={(el) => { descRefs.current[i] = el; }}
                className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg text-white/80 text-center max-w-md md:max-w-xl leading-relaxed tracking-wide uppercase"
                style={{ opacity: 0 }}
              >
                {slide.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
