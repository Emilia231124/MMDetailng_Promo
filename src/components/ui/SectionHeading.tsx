"use client";

interface SectionHeadingProps {
  label?: string;        // Маленький текст сверху (font-mono, accent-primary)
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
        <span className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
          {label}
        </span>
      )}
      <h2 className="font-display text-4xl font-bold uppercase leading-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {align === "center" && (
        <div className="mt-5 h-px w-20 bg-[var(--accent-primary)]" />
      )}
      {desc && (
        <p className="mt-4 max-w-xl font-body text-base text-[var(--text-secondary)] md:text-lg">
          {desc}
        </p>
      )}
    </div>
  );
}
