'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

/* ─── Данные ─── */
const items = [
  { id: 1,  cat: 'PPF',       title: 'BMW X5',              img: '/images/portfolio/1.jpg',  bg: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)' },
  { id: 2,  cat: 'CERAMIC',   title: 'Mercedes S-Class',    img: '/images/portfolio/2.jpg',  bg: 'linear-gradient(160deg, #141414 0%, #080808 100%)' },
  { id: 3,  cat: 'INTERIOR',  title: 'Toyota Land Cruiser', img: '/images/portfolio/3.jpg',  bg: 'linear-gradient(160deg, #181818 0%, #0c0c0c 100%)' },
  { id: 4,  cat: 'POLISH',    title: 'Porsche Cayenne',     img: '/images/portfolio/4.jpg',  bg: 'linear-gradient(160deg, #1c1c1c 0%, #101010 100%)' },
  { id: 5,  cat: 'PPF',       title: 'Audi Q8',             img: '/images/portfolio/5.jpg',  bg: 'linear-gradient(160deg, #121212 0%, #060606 100%)' },
  { id: 6,  cat: 'TINT',      title: 'Range Rover Sport',   img: '/images/portfolio/6.jpg',  bg: 'linear-gradient(160deg, #161616 0%, #0a0a0a 100%)' },
  // { id: 7,  cat: 'CERAMIC',   title: 'Lexus LX',            img: '/images/portfolio/7.jpg',  bg: 'linear-gradient(160deg, #1a1a1a 0%, #0e0e0e 100%)' },
  // { id: 8,  cat: 'INTERIOR',  title: 'BMW 7 Series',        img: '/images/portfolio/8.jpg',  bg: 'linear-gradient(160deg, #151515 0%, #090909 100%)' },
  // { id: 9,  cat: 'POLISH',    title: 'Audi RS6',            img: '/images/portfolio/9.jpg',  bg: 'linear-gradient(160deg, #191919 0%, #0d0d0d 100%)' },
  // { id: 10, cat: 'TINT',      title: 'Mercedes GLE',        img: '/images/portfolio/10.jpg', bg: 'linear-gradient(160deg, #131313 0%, #070707 100%)' },
  // { id: 11, cat: 'PPF',       title: 'Porsche 911',         img: '/images/portfolio/11.jpg', bg: 'linear-gradient(160deg, #1b1b1b 0%, #0f0f0f 100%)' },
  // { id: 12, cat: 'CERAMIC',   title: 'BMW M4',              img: '/images/portfolio/12.jpg', bg: 'linear-gradient(160deg, #171717 0%, #0b0b0b 100%)' },
];

const COUNT  = items.length; // 12
const STEP   = 360 / COUNT;  // 30°
const RADIUS = 550;          // радиус цилиндра в px
const TILT_Z = 4;            // наклон в °

/* ─────────────────────────────────────────────────────────────────────────
   ГЕОМЕТРИЯ (внешний вид, камера снаружи):

   Wrap только вращается — translateZ НА НЁМ НЕТ.
   Карточка i: rotateY(i*-30°) translateZ(550px)

   Карточка прямо перед камерой (i=0): z=+550 → ближайшая, самая большая.
   Карточки сбоку (±90°): z=0 → нейтральный масштаб.
   Карточки сзади (180°): z=-550 → дальние, скрыты backfaceVisibility.

   При perspective=1500px:
   ─ front card scale = 1500/(1500-550) = 1.58  (58% крупнее)
   ─ ±30° card scale  = 1500/(1500-476) = 1.46
   ─ ±60° card scale  = 1500/(1500-275) = 1.22
   ─ ±90° card scale  = 1500/1500      = 1.00

   Показываем только ±65° от фронта (5 карточек) — остальные скрыты.
──────────────────────────────────────────────────────────────────────── */

const PortfolioCarousel = () => {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const cardsRef     = useRef<(HTMLAnchorElement | null)[]>([]);
  const imgInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef   = useRef<HTMLElement>(null);

  const angle      = useRef(0);
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const startAngle = useRef(0);
  const vel        = useRef(0);
  const prevX      = useRef(0);
  const prevT      = useRef(0);
  const rafId      = useRef(0);
  const mounted    = useRef(false);

  /* ─── update: вращение + видимость + параллакс ─── */
  const update = useCallback(() => {
    if (!wrapRef.current) return;

    /* Wrap только вращается — без translateZ.
       Иначе (wrap_z + card_z) вытолкнут карточки за камеру. */
    wrapRef.current.style.transform =
      `rotateZ(${TILT_Z}deg) rotateY(${angle.current}deg)`;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const worldAngle = angle.current + i * -STEP;
      const norm       = ((worldAngle % 360) + 360) % 360;

      /* degFromFront: угловое расстояние от "передней" позиции (0°).
         0° = прямо перед камерой (ближайшая карточка).
         180° = прямо за камерой (скрытая). */
      const degFromFront = norm <= 180 ? norm : 360 - norm;

      /* Показываем только 5 карточек (±65° от фронта).
         Остальные скрыты — они либо edge-on, либо позади. */
      card.style.visibility = degFromFront < 65 ? 'visible' : 'hidden';

      /* Параллакс: линейный сдвиг изображения внутри карточки.
         Карточки справа от фронта → изображение вправо, и наоборот. */
      const inner = imgInnersRef.current[i];
      if (inner && degFromFront < 65) {
        const sign = norm <= 180 ? 1 : -1; // +1 справа, -1 слева
        const t    = degFromFront / 65;     // 0 (центр) → 1 (крайняя)
        const px   = sign * t * 100;
        inner.style.transform = `translate3d(${px}px, 0, 0)`;
      }
    });
  }, []);

  /* ─── RAF loop ─── */
  const loop = useCallback(() => {
    if (!mounted.current) return;
    if (!dragging.current) {
      vel.current *= 0.94;
      if (Math.abs(vel.current) > 0.02) angle.current += vel.current;
    }
    update();
    rafId.current = requestAnimationFrame(loop);
  }, [update]);

  /* ─── Pointer Events + запуск ─── */
  useEffect(() => {
    mounted.current = true;
    const el = sectionRef.current;
    if (!el) return;

    update();
    rafId.current = requestAnimationFrame(loop);

    const down = (e: PointerEvent) => {
      dragging.current   = true;
      startX.current     = e.clientX;
      startAngle.current = angle.current;
      prevX.current      = e.clientX;
      prevT.current      = Date.now();
      vel.current        = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      angle.current = startAngle.current + (e.clientX - startX.current) * 0.12;
      const now = Date.now();
      const dt  = now - prevT.current;
      if (dt > 0) {
        vel.current   = ((e.clientX - prevX.current) / dt) * 0.12 * 16;
        prevX.current = e.clientX;
        prevT.current = now;
      }
    };

    const up = () => { dragging.current = false; el.style.cursor = 'grab'; };

    el.addEventListener('pointerdown',   down);
    el.addEventListener('pointermove',   move);
    el.addEventListener('pointerup',     up);
    el.addEventListener('pointercancel', up);

    return () => {
      mounted.current = false;
      cancelAnimationFrame(rafId.current);
      el.removeEventListener('pointerdown',   down);
      el.removeEventListener('pointermove',   move);
      el.removeEventListener('pointerup',     up);
      el.removeEventListener('pointercancel', up);
    };
  }, [loop, update]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#050505',
        paddingTop: '80px',
        paddingBottom: '40px',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        /* overflow:visible — иначе 3D-карточки обрезаются снаружи viewport */
        overflow: 'visible',
      }}
    >
      {/* Заголовок */}
      <div className="page-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#C41E2A', fontFamily: 'var(--font-mono, monospace)' }}>
          ПОРТФОЛИО
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginTop: '12px', fontFamily: 'var(--font-syne, sans-serif)' }}>
          НАШИ РАБОТЫ
        </h2>
      </div>

      {/* ══════ Perspective + сцена ══════
          Один уровень perspective, один preserve-3d wrap внутри.
          Нет промежуточных элементов — чище и надёжнее. */}
      <div
        style={{
          perspective: '1500px',
          perspectiveOrigin: '50% 50%',
          height: '65vh',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        {/* ══════ Wrap — точка вращения (0×0) ══════ */}
        <div
          ref={wrapRef}
          style={{
            transformStyle: 'preserve-3d',
            width: 0,
            height: 0,
            position: 'relative',
            transform: `rotateZ(${TILT_Z}deg) rotateY(0deg)`,
          }}
        >
          {items.map((item, i) => (
            <a
              key={item.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                position: 'absolute',
                display: 'block',
                width: 'clamp(320px, 28vw, 500px)',
                aspectRatio: '1 / 1.15',
                left: '50%',
                top: '50%',
                /* translate(-50%,-50%) центрирует карточку на точке (0,0) wrap.
                   Затем rotateY ставит карточку в нужный сектор.
                   translateZ выдвигает её к камере на RADIUS px. */
                transform: `translate(-50%, -50%) rotateY(${i * -STEP}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: 'hidden',
                borderRadius: '24px',
                overflow: 'hidden',
                background: item.bg,
                border: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
              }}
            >
              {/* Изображение с параллакс-сдвигом: шире карточки на ±100px */}
              <div
                ref={(el) => { imgInnersRef.current[i] = el; }}
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: '-100px', right: '-100px',
                  willChange: 'transform',
                  transform: 'translate3d(0,0,0)',
                }}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 320px, 28vw"
                  draggable={false}
                  priority={i < 3}
                />
              </div>

              {/* Gradient снизу */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)', pointerEvents: 'none', zIndex: 10 }} />

              {/* Watermark */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
                <span style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', fontWeight: 800, textTransform: 'uppercase', opacity: 0.05, color: '#fff', letterSpacing: '0.05em', fontFamily: 'var(--font-syne, sans-serif)' }}>
                  {item.cat}
                </span>
              </div>

              {/* Текст внизу */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(14px, 1.2vw, 24px)', zIndex: 20, pointerEvents: 'none' }}>
                <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 500, color: '#C41E2A', fontFamily: 'var(--font-mono, monospace)' }}>
                  {item.cat}
                </span>
                <h3 style={{ fontSize: 'clamp(13px, 1.1vw, 18px)', fontWeight: 700, marginTop: '4px', color: '#fff', fontFamily: 'var(--font-syne, sans-serif)' }}>
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Drag hint */}
      <div style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '24px' }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)' }}>
          drag
        </span>
      </div>
    </section>
  );
};

export default PortfolioCarousel;
