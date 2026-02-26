# CLAUDE.md — MM Detailing Project Rules

## Бренд
- Название: **MM Detailing**
- Тип: Premium детейлинг-центр (Дагестан, Россия)
- Позиционирование: топовый по визуалу detailing-сайт, ощущение премиум-класса

## Стек технологий (НЕ МЕНЯТЬ)

| Технология | Версия | Назначение |
|---|---|---|
| Next.js | 15 (App Router) | Фреймворк, серверные компоненты |
| React | 19 | UI-библиотека |
| TypeScript | strict mode | Типизация |
| Tailwind CSS | v4 | Утилитарные стили |
| shadcn/ui | latest | UI-компоненты (формы, модалки, кнопки) |
| GSAP 3 | latest | Scroll-анимации, pinning, draggable |
| ScrollTrigger | (GSAP plugin) | Scroll-driven анимации |
| Draggable | (GSAP plugin) | Drag-интеракции (карусель) |
| Framer Motion | latest | Page transitions, mount/unmount |
| Lenis | latest | Smooth scrolling |
| Prisma | latest | ORM для PostgreSQL |
| NextAuth v5 | beta | Аутентификация |
| Zod | latest | Валидация данных |
| Resend | latest | Email-уведомления |

## Архитектура — жёсткие правила

### Файловая структура
```
src/
├── app/                    # Next.js App Router pages
│   ├── (site)/             # Route group: публичный сайт
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Главная
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── contact/
│   │   └── booking/
│   ├── admin/              # Route group: админка (защищена auth)
│   ├── api/
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Header, Footer, Preloader, SmoothScroll
│   ├── sections/           # Секции главной: Hero, PinnedShowcase, Carousel...
│   ├── ui/                 # shadcn/ui + кастомные (MagneticButton, TextReveal...)
│   └── animations/         # HOC и wrapper-ы анимаций
├── hooks/                  # useGSAP, useLenis, useMediaQuery, usePreloader
├── lib/                    # gsap-config, fonts, constants, utils
├── server/                 # Server Actions, db, auth
└── types/                  # TypeScript типы
```

### Правила кода
1. Server Components по умолчанию. `'use client'` ТОЛЬКО когда нужны: useState, useEffect, анимации, event handlers
2. Каждый компонент — отдельный файл
3. Именование: PascalCase для компонентов, camelCase для хуков/утилит
4. Импорты: абсолютные через `@/`
5. Анимации GSAP: всегда оборачивать в `useGSAP()`, всегда cleanup
6. Типизация: никаких `any`. Все пропсы — интерфейсы
7. Tailwind: CSS-переменные из дизайн-системы
8. Изображения: ВСЕГДА `next/image` с alt
9. Шрифты: ТОЛЬКО через `next/font`
10. Каждая секция — отдельный компонент в `components/sections/`

### Дизайн-система

#### Цвета
```
--bg-primary: #0A0A0A
--bg-secondary: #141414
--bg-elevated: #1A1A1A
--text-primary: #F5F5F5
--text-secondary: #8A8A8A
--text-muted: #4A4A4A
--accent-primary: #C8A97E
--accent-glow: #D4AF37
--accent-blue: #2563EB
--brand-border: #1F1F1F
```

#### Типографика
- Display: "Syne" (hero-заголовки, uppercase)
- Body: "Plus Jakarta Sans"
- Mono: "Space Mono" (цены, цифры)

#### Анимации
- Smooth scroll: Lenis, duration 1.2
- Scroll reveal: opacity 0→1, translateY 40→0, duration 0.8, ease "power2.out"
- Stagger: 0.08s
- Page transition: Framer Motion, duration 0.6
- Preloader: только при первом визите в сессии

### Что НЕЛЬЗЯ делать
- `pages/` router (только App Router)
- Inline styles (только Tailwind + CSS-переменные)
- `any` в TypeScript
- `<img>` вместо `next/image`
- Стандартные шрифты (Arial, Inter, Roboto)
- Забывать cleanup для GSAP
