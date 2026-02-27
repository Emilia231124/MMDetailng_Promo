"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface CarouselItem {
  id: string;
  title: string;
  category: "PPF" | "Ceramic" | "Polish" | "Interior";
  gradient: string;
}

const ITEMS: CarouselItem[] = [
  {
    id: "1",
    title: "BMW X5",
    category: "PPF",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 50%, #0f3460 100%)",
  },
  {
    id: "2",
    title: "Mercedes S-Class",
    category: "Ceramic",
    gradient: "linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 50%, #4a2d6e 100%)",
  },
  {
    id: "3",
    title: "Porsche 911",
    category: "Polish",
    gradient: "linear-gradient(135deg, #2a1800 0%, #4a2d00 50%, #6b4000 100%)",
  },
  {
    id: "4",
    title: "Range Rover Sport",
    category: "Interior",
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0d2a0d 100%)",
  },
  {
    id: "5",
    title: "Audi RS7",
    category: "PPF",
    gradient: "linear-gradient(135deg, #0a1e2e 0%, #1a3a5a 50%, #0c2a45 100%)",
  },
  {
    id: "6",
    title: "Lamborghini Urus",
    category: "Ceramic",
    gradient: "linear-gradient(135deg, #200d3a 0%, #3a1a5e 50%, #5a2a8e 100%)",
  },
  {
    id: "7",
    title: "Tesla Model S",
    category: "Polish",
    gradient: "linear-gradient(135deg, #1e1200 0%, #3a2200 50%, #552e00 100%)",
  },
  {
    id: "8",
    title: "Toyota Land Cruiser",
    category: "Interior",
    gradient: "linear-gradient(135deg, #051505 0%, #112211 50%, #0d1f0d 100%)",
  },
];

const CARD_COUNT = ITEMS.length; // 8
const RADIUS = 420; // px — cylinder radius for 3D layout
const CARD_W = 320; // px
const CARD_H = 420; // px
const SENSITIVITY = 0.28; // px drag → degrees rotation

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_COLOR: Record<CarouselItem["category"], string> = {
  PPF: "#2563EB",
  Ceramic: "#8B5CF6",
  Polish: "#C8A97E",
  Interior: "#22C55E",
};

// ---------------------------------------------------------------------------
// Mobile carousel (scroll-snap)
// ---------------------------------------------------------------------------

function CarouselMobile({ items }: { items: CarouselItem[] }) {
  return (
    <div
      className="flex gap-4 overflow-x-auto px-4 pb-6 snap-x snap-mandatory"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex-shrink-0 snap-center rounded-2xl overflow-hidden relative"
          style={{
            width: "80vw",
            height: 380,
            background: item.gradient,
            border: "1px solid var(--border)",
          }}
        >
          {/* TODO: Replace with:
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display text-[18vw] font-bold uppercase leading-none"
              style={{ color: "rgba(255,255,255,0.06)" }}
            >
              {item.category}
            </span>
          </div>
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: CATEGORY_COLOR[item.category] }}
            >
              {item.category}
            </span>
            <p className="mt-1 font-body text-lg text-[var(--text-primary)]">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PortfolioCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Drag state — refs for mutable values (no re-renders during drag)
  const currentRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);

  const [isHovering, setIsHovering] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // ── Cursor follow ──────────────────────────────────────────────────────────
  useGSAP(() => {
    const cursor = cursorRef.current;
    if (!cursor || !isDesktop) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 40,
        y: e.clientY - 40,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop]);

  // ── Entrance animations ────────────────────────────────────────────────────
  useGSAP(
    () => {
      const header = headerRef.current;
      const scene = sceneRef.current;
      const carousel = carouselRef.current;
      if (!header) return;

      // Header elements stagger reveal
      const headerChildren = Array.from(header.children) as HTMLElement[];
      gsap.fromTo(
        headerChildren,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 85%" },
        }
      );

      if (!scene || !carousel) return;

      // Scene entrance
      gsap.set(scene, { opacity: 0, y: 60 });

      ScrollTrigger.create({
        trigger: scene,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(scene, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });

          // Rotation hint — invites user to drag
          gsap.to(carousel, {
            rotateY: -28,
            duration: 1.6,
            ease: "power2.inOut",
            delay: 0.4,
            onUpdate() {
              currentRotationRef.current = gsap.getProperty(
                carousel,
                "rotateY"
              ) as number;
            },
            onComplete() {
              gsap.to(carousel, {
                rotateY: 0,
                duration: 2,
                ease: "power2.inOut",
                onUpdate() {
                  currentRotationRef.current = gsap.getProperty(
                    carousel,
                    "rotateY"
                  ) as number;
                },
              });
            },
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [isDesktop] }
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDesktop) return;
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startRotationRef.current = currentRotationRef.current;
      lastXRef.current = e.clientX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;

      // Kill any running inertia tween
      gsap.killTweensOf(carouselRef.current);

      // Cursor shrink on press
      gsap.to(cursorRef.current, { scale: 0.8, duration: 0.15 });

      // Capture pointer so drag continues outside element bounds
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isDesktop]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      const newRotation = startRotationRef.current + deltaX * SENSITIVITY;
      currentRotationRef.current = newRotation;
      gsap.set(carouselRef.current, { rotateY: newRotation });

      // Track velocity for inertia
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current =
          ((e.clientX - lastXRef.current) / dt) * SENSITIVITY;
      }
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });

    // Apply inertia: velocity × decay distance
    const inertiaTarget =
      currentRotationRef.current + velocityRef.current * 380;

    gsap.to(carouselRef.current, {
      rotateY: inertiaTarget,
      duration: 1.6,
      ease: "power2.out",
      onUpdate() {
        currentRotationRef.current = gsap.getProperty(
          carouselRef.current!,
          "rotateY"
        ) as number;
      },
    });
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="overflow-hidden py-32">

      {/* Section header */}
      <div ref={headerRef} className="mb-20 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
          ПОРТФОЛИО
        </span>
        <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-7xl">
          НАШИ РАБОТЫ
        </h2>
        <p className="mt-4 font-body text-[var(--text-secondary)]">
          {isDesktop ? "Перетащите для просмотра" : "Листайте для просмотра"}
        </p>
      </div>

      {/* Carousel */}
      {isDesktop ? (
        // ── Desktop: 3D cylinder carousel ──────────────────────────────────
        <div
          ref={sceneRef}
          className="relative h-[520px] cursor-none select-none"
          style={{ perspective: "1200px" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/*
           * Carousel pivot:
           *   position: absolute; left: 50%; top: 50%; width: 0; height: 0
           * Each card is offset by (-CARD_W/2, -CARD_H/2) so its center aligns
           * with the pivot, then rotated + pushed out by RADIUS.
           */}
          <div
            ref={carouselRef}
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
          >
            {ITEMS.map((item, i) => {
              const angle = i * (360 / CARD_COUNT);
              return (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    left: -CARD_W / 2,
                    top: -CARD_H / 2,
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  }}
                >
                  {/* Card inner — CSS hover scale */}
                  <div
                    className="group relative h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.03]"
                    style={{
                      background: item.gradient,
                      border: "1px solid var(--border)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* TODO: Replace with:
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    */}

                    {/* Background watermark text */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span
                        className="font-display text-[80px] font-bold uppercase leading-none"
                        style={{ color: "rgba(255,255,255,0.05)" }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 58%)",
                      }}
                    />

                    {/* Overlay brightens on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 70%)",
                      }}
                    />

                    {/* Card text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span
                        className="font-mono text-xs uppercase tracking-widest"
                        style={{ color: CATEGORY_COLOR[item.category] }}
                      >
                        {item.category}
                      </span>
                      <p className="mt-1 font-body text-lg font-medium text-[var(--text-primary)]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // ── Mobile: horizontal scroll-snap ─────────────────────────────────
        <CarouselMobile items={ITEMS} />
      )}

      {/* Custom drag cursor — desktop only, follows mouse */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 items-center justify-center rounded-full transition-opacity duration-200"
        style={{
          background: "var(--accent-primary)",
          opacity: isHovering ? 0.92 : 0,
        }}
      >
        <span className="font-mono text-sm font-medium text-[var(--bg-primary)]">
          Drag
        </span>
      </div>

    </section>
  );
}
