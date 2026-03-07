'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

/* ─── Данные ─── */
const items = [
  { id: 1,  cat: 'PPF',       title: 'BMW X5',              img: '/images/portfolio/1_.jpg' },
  { id: 2,  cat: 'CERAMIC',   title: 'Mercedes S-Class',    img: '/images/portfolio/2__.jpg' },
  { id: 3,  cat: 'INTERIOR',  title: 'Toyota Land Cruiser', img: '/images/portfolio/3_.jpg' },
  { id: 4,  cat: 'POLISH',    title: 'Porsche Cayenne',     img: '/images/portfolio/4_.jpg' },
  { id: 5,  cat: 'PPF',       title: 'Audi Q8',             img: '/images/portfolio/5_.jpg' },
  { id: 6,  cat: 'TINT',      title: 'Range Rover Sport',   img: '/images/portfolio/6_.jpg' },
  { id: 7,  cat: 'CERAMIC',   title: 'Lexus LX',            img: '/images/portfolio/7__.jpg' },
  { id: 8,  cat: 'INTERIOR',  title: 'BMW 7 Series',        img: '/images/portfolio/8__.jpg' },
  { id: 9,  cat: 'POLISH',    title: 'Audi RS6',            img: '/images/portfolio/9__.jpg' },
  // { id: 10, cat: 'TINT',      title: 'Mercedes GLE',        img: '/images/portfolio/10_.jpg' },
  // { id: 11, cat: 'PPF',       title: 'Porsche 911',         img: '/images/portfolio/11_.jpg' },
  // { id: 12, cat: 'CERAMIC',   title: 'BMW M4',              img: '/images/portfolio/12_.jpg' },
];

const COUNT = items.length;     // 12
const STEP = 360 / COUNT;       // 30°
const RADIUS = 857;             // px — ТОЧНО из DevTools poppr.be
const TILT_Z = 0;               // ° наклон — ТОЧНО из poppr.be
const PERSPECTIVE = 1000;       // px — из CSS poppr.be

/*
 * ══════════════════════════════════════════════════════════════
 *  МАТЕМАТИЧЕСКАЯ МОДЕЛЬ (доказана анализом исходника poppr.be)
 * ══════════════════════════════════════════════════════════════
 *
 *  Wrap: translateZ(857px) — сдвигает ЦЕНТР цилиндра к камере
 *  Cards: rotateY(i*-30°) translateZ(857px) — расставляет по кругу R=857
 *  Perspective: 1000px — камера на z=1000
 *
 *  Z-позиция карточки = 857 + 857 * cos(effectiveAngle)
 *    Front (0°):   z = 1714 → ЗА камерой → СКРЫТА
 *    Side (90°):   z = 857  → почти У камеры → СКРЫТА
 *    Back (180°):  z = 0    → далеко перед камерой → ВИДНА
 *
 *  ПРАВИЛО: visible когда cos(effectiveAngle) < 0
 *           т.е. effectiveAngle ∈ (90°, 270°) — задняя полусфера
 *
 *  Мы смотрим на карусель СНАРУЖИ и видим ДАЛЬНЮЮ сторону цилиндра.
 *  Ближние карточки пролетают мимо камеры и скрыты.
 * ══════════════════════════════════════════════════════════════
 */

const PortfolioCarousel = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const imgInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const angle = useRef(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  const vel = useRef(0);
  const prevX = useRef(0);
  const prevT = useRef(0);
  const rafId = useRef(0);
  const mounted = useRef(false);

  /* ─── Обновить transform, видимость, параллакс ─── */
  const update = useCallback(() => {
    if (!wrapRef.current) return;

    wrapRef.current.style.transform =
      `translateZ(${RADIUS}px) rotateZ(${TILT_Z}deg) rotateY(${angle.current}deg)`;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const effectiveAngle = (angle.current + i * -STEP) % 360;
      const norm = ((effectiveAngle % 360) + 360) % 360;

      /* ═══ ВИДИМОСТЬ: ЗАДНЯЯ полусфера (cos < 0) ═══ */
      const cosAngle = Math.cos(norm * Math.PI / 180);
      const isVisible = cosAngle < 0;

      card.style.visibility = isVisible ? 'visible' : 'hidden';
      card.style.pointerEvents = isVisible ? 'auto' : 'none';

      /* ═══ ПАРАЛЛАКС ═══
         Центр видимой зоны = 180° (самая дальняя точка)
         Отклонение ±90° → сдвиг ±140px */
      const inner = imgInnersRef.current[i];
      if (inner) {
        if (isVisible) {
          let rel = norm - 180;
          if (rel > 180) rel -= 360;
          if (rel < -180) rel += 360;
          const px = (rel / 90) * 140;
          inner.style.transform = `translate3d(${px}px, 0, 0)`;
        } else {
          inner.style.transform = `translate3d(-140px, 0, 0)`;
        }
      }
    });
  }, []);

  /* ─── Анимационный цикл ─── */
  const loop = useCallback(() => {
    if (!mounted.current) return;
    if (!dragging.current) {
      vel.current *= 0.94;
      if (Math.abs(vel.current) > 0.02) {
        angle.current += vel.current;
      }
    }
    update();
    rafId.current = requestAnimationFrame(loop);
  }, [update]);

  /* ─── Pointer Events ─── */
  useEffect(() => {
    mounted.current = true;
    const el = sectionRef.current;
    if (!el) return;

    update();
    rafId.current = requestAnimationFrame(loop);

    const down = (e: PointerEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startAngle.current = angle.current;
      prevX.current = e.clientX;
      prevT.current = Date.now();
      vel.current = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - startX.current;
      angle.current = startAngle.current + dx * 0.12;

      const now = Date.now();
      const dt = now - prevT.current;
      if (dt > 0) {
        vel.current = ((e.clientX - prevX.current) / dt) * 0.12 * 16;
        prevX.current = e.clientX;
        prevT.current = now;
      }
    };

    const up = () => {
      dragging.current = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    return () => {
      mounted.current = false;
      cancelAnimationFrame(rafId.current);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [loop, update]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#050505',
        paddingTop: '80px',
        paddingBottom: '40px',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Заголовок */}
      <div className="page-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            color: '#C41E2A',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          ПОРТФОЛИО
        </span>
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#fff',
            marginTop: '12px',
            fontFamily: 'var(--font-syne, sans-serif)',
          }}
        >
          НАШИ РАБОТЫ
        </h2>
      </div>

      {/* ─── 3D CAROUSEL ─── */}

      {/* Уровень 1: carousel-comp — perspective */}
      <div
        style={{
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: '50% 50%',
          overflow: 'visible',
        }}
      >
        {/* Уровень 2: carousel — preserve-3d + высота сцены */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            position: 'relative',
            height: '65vh',
            minHeight: '450px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          {/* Уровень 3: carousel-wrap — точка вращения (w:0, h:0) */}
          <div
            ref={wrapRef}
            style={{
              transformStyle: 'preserve-3d',
              width: 0,
              height: 0,
              position: 'relative',
              transform: `translateZ(${RADIUS}px) rotateZ(${TILT_Z}deg) rotateY(0deg)`,
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
                  width: 'clamp(340px, 30vw, 550px)',
                  aspectRatio: '1 / 1.12',
                  /* Центрирование через margin (как poppr.be),
                     НЕ через translate(-50%,-50%) —
                     translate мешает 3D-трансформам */
                  left: '50%',
                  top: '50%',
                  marginLeft: 'clamp(-275px, -15vw, -170px)',
                  marginTop: 'clamp(-308px, -16.5vw, -190px)',
                  /* 3D: ТОЛЬКО rotateY + translateZ */
                  transform: `rotateY(${i * -STEP}deg) translateZ(${RADIUS}px)`,
                  borderRadius: '30px',
                  overflow: 'hidden',
                  background: '#0A0A0A',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* Обёртка изображения — для параллакса */}
                <div
                  ref={(el) => { imgInnersRef.current[i] = el; }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '-140px',
                    right: '-140px',
                    willChange: 'transform',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 680px, calc(30vw + 280px)"
                    quality={90}
                    draggable={false}
                    priority={i < 6}
                  />
                </div>

                {/* Gradient */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Текст внизу — scaleX(-1) компенсирует зеркало backface */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(16px, 1.5vw, 28px)',
                    zIndex: 20,
                    pointerEvents: 'none',
                    transform: 'scaleX(-1)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(14px, 1.2vw, 20px)',
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: 'var(--font-syne, sans-serif)',
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Drag hint */}
      <div style={{ textAlign: 'center', paddingBottom: '24px', position: 'relative', zIndex: 200 }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)' }}>
          drag
        </span>
      </div>
    </section>
  );
};

export default PortfolioCarousel;
