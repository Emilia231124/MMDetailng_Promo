"use client";

interface ScrollIndicatorProps {
  className?: string;
}

export default function ScrollIndicator({ className }: ScrollIndicatorProps) {
  return (
    <div data-component="ScrollIndicator" className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      {/* TODO: Implement scroll arrow animation */}
      <span className="text-xs tracking-widest text-[var(--text-muted)] uppercase">Scroll</span>
    </div>
  );
}
