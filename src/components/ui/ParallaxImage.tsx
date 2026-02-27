"use client";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export default function ParallaxImage({ src, alt, speed = 0.5, className }: ParallaxImageProps) {
  return (
    <div data-component="ParallaxImage" className={`relative overflow-hidden ${className ?? ""}`}>
      {/* TODO: Implement parallax effect */}
      <span className="text-[var(--text-muted)]">ParallaxImage</span>
    </div>
  );
}
