'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import GlassCapsuleButton from '@/components/ui/GlassCapsuleButton';

export interface CarModel {
  id: string;
  brand: string;
  model: string;
  year?: string;
  img: string;
  price: string;
  description: string;
  features: string[];
}

interface CarDetailOverlayProps {
  car: CarModel | null;
  onClose: () => void;
}

type ModalState = 'closed' | 'entering' | 'visible' | 'exiting';

/**
 * Overlay-модал с Sketch-анимацией.
 * Фазы открытия: backdrop fade → SVG рамка рисуется → фон модала → контент fade-in.
 * Фазы закрытия: всё одновременно за 500ms, DOM убирается через 550ms.
 */
const CarDetailOverlay = ({ car, onClose }: CarDetailOverlayProps) => {
  const [state, setState] = useState<ModalState>('closed');
  const svgRectRef = useRef<SVGRectElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Открытие
  useEffect(() => {
    if (car) {
      setState('entering');
      document.body.style.overflow = 'hidden';
      enterTimerRef.current = setTimeout(() => setState('visible'), 1300);
    } else {
      setState('closed');
    }
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    };
  }, [car]);

  // SVG рамка — Web Animations API, рисуем при открытии
  useEffect(() => {
    if (state !== 'entering' || !svgRectRef.current) return;

    const rect = svgRectRef.current;

    // Ждём render чтобы getBoundingClientRect вернул реальные размеры
    const rafId = requestAnimationFrame(() => {
      const box = rect.getBoundingClientRect();
      const perimeter = 2 * (box.width + box.height);

      rect.style.strokeDasharray = `${perimeter}`;
      rect.style.strokeDashoffset = `${perimeter}`;
      rect.style.stroke = 'rgba(255, 255, 255, 0.15)';
      rect.style.strokeWidth = '1.5';
      rect.style.fill = 'none';

      rect.animate(
        [
          { strokeDashoffset: `${perimeter}` },
          { strokeDashoffset: '0' },
        ],
        {
          duration: 500,
          delay: 300,
          fill: 'forwards',
          easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        }
      );
    });

    return () => cancelAnimationFrame(rafId);
  }, [state]);

  // SVG рамка — обратная анимация при закрытии
  const animateSvgOut = useCallback(() => {
    if (!svgRectRef.current) return;
    const rect = svgRectRef.current;
    const box = rect.getBoundingClientRect();
    const perimeter = 2 * (box.width + box.height);

    rect.animate(
      [
        { strokeDashoffset: '0' },
        { strokeDashoffset: `${perimeter}` },
      ],
      {
        duration: 500,
        fill: 'forwards',
        easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      }
    );
  }, []);

  // Закрытие с анимацией
  const handleClose = useCallback(() => {
    if (state === 'closed' || state === 'exiting') return;
    setState('exiting');
    animateSvgOut();
    exitTimerRef.current = setTimeout(() => {
      document.body.style.overflow = '';
      onClose();
      setState('closed');
    }, 550);
  }, [state, animateSvgOut, onClose]);

  // Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      document.body.style.overflow = '';
    };
  }, []);

  if (state === 'closed' || !car) return null;

  const isOut = state === 'exiting';

  return (
    <>
      {/* ═══ Backdrop ═══ */}
      <div
        className={`sketch-modal-backdrop${isOut ? ' out' : ''}`}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          cursor: 'pointer',
        }}
      />

      {/* ═══ Центрирующий wrapper ═══ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        {/* ═══ Modal Box ═══ */}
        <div
          className={`sketch-modal-box${isOut ? ' out' : ''}`}
          style={{
            position: 'relative',
            width: 'min(96vw, 1100px)',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: 'clamp(20px, 2.5vw, 36px)',
            pointerEvents: 'auto',
          }}
        >
          {/* ═══ SVG Sketch Border ═══ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
            preserveAspectRatio="none"
          >
            <rect
              ref={svgRectRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx="0"
              ry="0"
            />
          </svg>

          {/* ═══ Content ═══ */}
          <div className={`sketch-modal-content${isOut ? ' out' : ''}`}>

            {/* Кнопка закрытия */}
            <button
              onClick={handleClose}
              aria-label="Закрыть"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#555',
                fontSize: '20px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                padding: '4px',
                transition: 'color 200ms',
                zIndex: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
            >
              ✕
            </button>

            {/* Layout: фото слева, инфо справа */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr]">

              {/* Фото */}
              <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                <Image
                  src={car.img}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Информация */}
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#fff',
                    lineHeight: 1.15,
                    paddingRight: '32px',
                  }}
                >
                  {car.brand} {car.model}
                </h2>

                {car.year && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#555',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.15em',
                      display: 'block',
                      marginTop: '6px',
                    }}
                  >
                    {car.year}
                  </span>
                )}

                <p
                  style={{
                    fontSize: '14px',
                    color: '#999',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-body)',
                    marginTop: '16px',
                  }}
                >
                  {car.description}
                </p>

                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.08)',
                    margin: '16px 0',
                  }}
                />

                {/* Список работ */}
                <div>
                  {car.features.map((feat) => (
                    <span
                      key={feat}
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: '#555',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 2,
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.08)',
                    margin: '16px 0',
                  }}
                />

                {/* Цена */}
                <span
                  style={{
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    display: 'block',
                  }}
                >
                  {car.price}
                </span>

                {/* CTA */}
                <div style={{ marginTop: '20px' }}>
                  <GlassCapsuleButton as="link" href="/booking">
                    Записаться
                  </GlassCapsuleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDetailOverlay;
