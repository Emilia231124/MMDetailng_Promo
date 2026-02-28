"use client";

interface SectionHeadingProps {
  label?: string;        // Маленький текст сверху (font-mono, accent-red)
  title: string;         // Основной заголовок (font-display)
  description?: string;  // Подзаголовок (text-secondary)
  /** @deprecated Используй description */
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const desc = description ?? subtitle;
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {label && (
        <span className="mb-3 font-mono text-sm uppercase tracking-widest text-[var(--accent-red)]">
          {label}
        </span>
      )}
      <h2 className="font-display text-5xl font-bold uppercase leading-tight tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl">
        {title}
      </h2>
      {align === "center" && (
        <div className="mt-5 h-px w-20 bg-[var(--accent-red)]" />
      )}
      {desc && (
        <p className="mt-4 max-w-xl font-body text-lg tracking-wide text-[var(--text-secondary)] md:text-xl">
          {desc}
        </p>
      )}
    </div>
  );
}
