export const SITE_CONFIG = {
  name: "MM Detailing",
  description: "Премиум детейлинг-центр в Махачкале. Защита, полировка, химчистка автомобилей.",
  url: "https://mm-detailing.ru",
  locale: "ru-RU",
} as const;

export const NAV_LINKS = [
  { label: "Услуги", href: "/services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Цены", href: "/pricing" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
] as const;

export const ANIMATION = {
  duration: { fast: 0.3, normal: 0.6, slow: 1.0, scroll: 1.2 },
  ease: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    sharp: "power4.out",
    inOut: "power2.inOut",
  },
  stagger: 0.08,
} as const;
