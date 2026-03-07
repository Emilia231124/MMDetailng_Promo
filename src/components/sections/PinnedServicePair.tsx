'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

export interface Service {
  id: string;
  title: string;
  features: string[];
  imgLarge: string;
  imgSmall: string;
  /** width in vw, default 24 */
  imgLargeVw?: number;
  /** height in vh, default 38 — controls portrait/landscape feel */
  imgLargeHVh?: number;
  /** width in vw, minimum 25 */
  imgSmallVw?: number;
  /** height in vh, default 26 */
  imgSmallHVh?: number;
  /** extra image paths for single-layout page-views */
  extraImgs?: string[];
  /** extra image dimensions */
  extraVw?: number[];
  extraHVh?: number[];
}

interface PinnedServicePairProps {
  left: Service;
  right?: Service;
  layoutIndex: number;
}

const layoutPresets = [
  { left: { largeY: '5%', smallY: '55%' }, right: { largeY: '15%', smallY: '60%' } },
  { left: { largeY: '12%', smallY: '55%' }, right: { largeY: '10%', smallY: '58%' } },
  { left: { largeY: '8%', smallY: '58%' }, right: { largeY: '18%', smallY: '65%' } },
  { left: { largeY: '10%', smallY: '57%' }, right: { largeY: '6%', smallY: '60%' } },
];

const imgBg = { background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)' };

function imgStyle(vw: number, hvh: number, baseVw = 24, baseHVh = 38): React.CSSProperties {
  const sw = vw / baseVw;
  const sh = hvh / baseHVh;
  return {
    width: `clamp(${Math.round(200 * sw)}px, ${vw}vw, ${Math.round(340 * sw)}px)`,
    height: `clamp(${Math.round(200 * sh)}px, ${hvh}vh, ${Math.round(420 * sh)}px)`,
  };
}

function ServiceSide({
  service,
  side,
  largeY,
  smallY,
}: {
  service: Service;
  side: 'left' | 'right';
  largeY: string;
  smallY: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isRight = side === 'right';
  const align = isRight ? 'right' : 'left';

  const largeVw = service.imgLargeVw ?? 24;
  const largeHVh = service.imgLargeHVh ?? 38;
  const smallVw = Math.max(25, service.imgSmallVw ?? 25);
  const smallHVh = service.imgSmallHVh ?? 26;

  const titleWords = service.title.split(' ');

  return (
    <div style={{ position: 'relative', flex: 1, height: '100%', minWidth: 0 }}>
      {/* Large image */}
      <div
        className={`${side}-large`}
        style={{
          position: 'absolute',
          top: largeY,
          [align]: '4%',
          overflow: 'hidden',
          ...imgStyle(largeVw, largeHVh),
          ...imgBg,
        }}
      >
        <Image
          src={service.imgLarge}
          alt={service.title}
          fill
          sizes={`(max-width: 768px) 80vw, ${largeVw}vw`}
          className="object-cover"
          unoptimized
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Small image */}
      <div
        className={`${side}-small`}
        style={{
          position: 'absolute',
          top: smallY,
          [align]: '18%',
          overflow: 'hidden',
          filter: 'brightness(0.7)',
          ...imgStyle(smallVw, smallHVh, 25, 26),
          ...imgBg,
        }}
      >
        <Image
          src={service.imgSmall}
          alt=""
          fill
          sizes={`(max-width: 768px) 60vw, ${smallVw}vw`}
          className="object-cover"
          unoptimized
          aria-hidden
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Text block — hover triggers underline animation, click goes to /pricing */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          [align]: 0,
          width: `clamp(${Math.round(200 * (largeVw / 24))}px, ${largeVw}vw, ${Math.round(340 * (largeVw / 24))}px)`,
          textAlign: isRight ? 'right' : 'left',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={`/pricing?service=${service.id}`}
          style={{ display: 'block', textDecoration: 'none' }}
          aria-label={`Перейти к ценам на: ${service.title}`}
        >
          {/* Title — word-by-word slide-up + underline per word */}
          <h2
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(1.2rem, 2.4vw, 2.1rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            {titleWords.map((word, i) => (
              <span key={i} style={{ display: 'block' }}>
                {/* inline-block so underline width = text width, not container width */}
                <span style={{ display: 'inline-block' }}>
                  {/* overflow:hidden mask for slide-up GSAP */}
                  <span style={{ display: 'block', overflow: 'hidden', lineHeight: 1.2 }}>
                    <span className={`${side}-text-word`} style={{ display: 'block' }}>
                      {word}
                    </span>
                  </span>
                  {/* Underline — inherits inline-block width = text width */}
                  <motion.span
                    style={{
                      display: 'block',
                      height: '1px',
                      background: 'rgba(255,255,255,0.6)',
                      transformOrigin: isRight ? 'right' : 'left',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
                  />
                </span>
              </span>
            ))}
          </h2>

          {/* Features — each line slides up + underline */}
          <ul
            aria-label={`Включено: ${service.title}`}
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {service.features.map((feat, i) => (
              <li
                key={feat}
                className={`${side}-feature-item`}
                style={{ paddingBottom: '2px' }}
              >
                {/* inline-block so underline width = text width */}
                <span style={{ display: 'inline-block' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#555',
                      lineHeight: 2,
                      display: 'block',
                    }}
                  >
                    {feat}
                  </span>
                  <motion.span
                    style={{
                      display: 'block',
                      height: '1px',
                      background: 'rgba(255,255,255,0.25)',
                      transformOrigin: isRight ? 'right' : 'left',
                      marginTop: '-2px',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{
                      duration: 0.25,
                      delay: titleWords.length * 0.06 + i * 0.05,
                      ease: 'easeOut',
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </Link>
      </div>
    </div>
  );
}

export default function PinnedServicePair({
  left,
  right,
  layoutIndex,
}: PinnedServicePairProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const preset = layoutPresets[layoutIndex % layoutPresets.length];
  const isSingle = !right;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ll = section.querySelector('.left-large');
    const rl = section.querySelector('.right-large');
    const ls = section.querySelector('.left-small');
    const rs = section.querySelector('.right-small');
    const ex1 = section.querySelector('.left-extra-1');
    const ex2 = section.querySelector('.left-extra-2');

    const leftWords = section.querySelectorAll('.left-text-word');
    const rightWords = section.querySelectorAll('.right-text-word');
    const leftItems = section.querySelectorAll('.left-feature-item');
    const rightItems = section.querySelectorAll('.right-feature-item');

    const photoEls = [ll, ls, rl, rs, ex1, ex2].filter(Boolean);
    if (photoEls.length === 0) return;

    gsap.set(photoEls, { opacity: 0, y: 60, scale: 1.03 });
    if (leftWords.length) gsap.set(leftWords, { y: '110%' });
    if (rightWords.length) gsap.set(rightWords, { y: '110%' });
    if (leftItems.length) gsap.set(leftItems, { opacity: 0, y: 14 });
    if (rightItems.length) gsap.set(rightItems, { opacity: 0, y: 14 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: isSingle ? '+=150%' : '+=200%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 0,
      },
    });

    // Phase 1: large photos
    if (ll) tl.to(ll, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, 0);
    if (rl) tl.to(rl, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.05);

    // Phase 2: title words slide up staggered
    if (leftWords.length) {
      tl.to(leftWords, { y: 0, stagger: 0.04, duration: 0.25, ease: 'power2.out' }, 0.2);
    }
    if (rightWords.length) {
      tl.to(rightWords, { y: 0, stagger: 0.04, duration: 0.25, ease: 'power2.out' }, 0.25);
    }

    // Phase 3: small photos + extras
    if (ls) tl.to(ls, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }, 0.35);
    if (rs) tl.to(rs, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }, 0.4);
    if (ex1) tl.to(ex1, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }, 0.42);
    if (ex2) tl.to(ex2, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }, 0.47);

    // Phase 4: feature lines staggered
    if (leftItems.length) {
      tl.to(leftItems, { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out' }, 0.5);
    }
    if (rightItems.length) {
      tl.to(rightItems, { opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out' }, 0.55);
    }

    tl.to({}, { duration: 0.3 });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, [isSingle]);

  const containerStyle: React.CSSProperties = {
    background: '#050505',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };

  // Padding ~2.5x of previous: was clamp(48px, 7.5vw, 114px) → now clamp(120px, 18vw, 260px)
  const innerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    paddingLeft: 'clamp(150px, 18vw, 300px)',
    paddingRight: 'clamp(150px, 18vw, 300px)',
    gap: '20px',
  };

  if (isSingle) {
    const extraVwArr = left.extraVw ?? [26, 18];
    const extraHVhArr = left.extraHVh ?? [18, 24];

    return (
      <div ref={sectionRef} style={containerStyle}>
        <div style={{ ...innerStyle, paddingRight: 0 }}>
          <div style={{ position: 'relative', width: '50%', height: '100%', flexShrink: 0 }}>
            <ServiceSide
              service={left}
              side="left"
              largeY={preset.left.largeY}
              smallY={preset.left.smallY}
            />
          </div>
        </div>

        {/* Extra photos — scattered in right half */}
        {left.extraImgs?.map((src, i) => {
          const extraPositions: React.CSSProperties[] = [
            {
              position: 'absolute',
              top: '10%',
              right: 'calc(clamp(48px, 7vw, 100px) + 10vw)',
              ...imgStyle(extraVwArr[i] ?? 26, extraHVhArr[i] ?? 18, 26, 18),
              overflow: 'hidden',
              filter: 'brightness(0.8)',
              ...imgBg,
            },
            {
              position: 'absolute',
              bottom: '18%',
              right: `calc(clamp(48px, 7vw, 100px) + clamp(${Math.round(200 * ((extraVwArr[0] ?? 26) / 26))}px, ${extraVwArr[0] ?? 26}vw, ${Math.round(340 * ((extraVwArr[0] ?? 26) / 26))}px) + 24px - 12vw)`,
              ...imgStyle(extraVwArr[i] ?? 18, extraHVhArr[i] ?? 24, 18, 24),
              overflow: 'hidden',
              filter: 'brightness(0.6)',
              ...imgBg,
            },
          ];

          return (
            <div key={i} className={`left-extra-${i + 1}`} style={extraPositions[i]}>
              <Image
                src={src}
                alt=""
                fill
                sizes={`${extraVwArr[i] ?? 20}vw`}
                className="object-cover"
                unoptimized
                aria-hidden
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={containerStyle}>
      <div style={innerStyle}>
        <ServiceSide
          service={left}
          side="left"
          largeY={preset.left.largeY}
          smallY={preset.left.smallY}
        />
        <ServiceSide
          service={right!}
          side="right"
          largeY={preset.right.largeY}
          smallY={preset.right.smallY}
        />
      </div>
    </div>
  );
}
