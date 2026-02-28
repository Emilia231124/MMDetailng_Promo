# CLAUDE.md — MM Detailing Project Rules

## Бренд
- Название: **MM Detailing**
- Логотип: **MM✕DETAILING** — "MM" белый, "✕" красный (#C41E2A), "DETAILING" белый
- Тип: Premium детейлинг-центр (Дагестан, Россия)
- Позиционирование: топовый по визуалу detailing-сайт, ощущение чёрного зеркала — дорого, строго, лаконично

## Стек технологий (НЕ МЕНЯТЬ)

| Технология | Версия | Назначение |
|---|---|---|
| Next.js | 15 (App Router) | Фреймворк, серверные компоненты |
| React | 19 | UI-библиотека |
| TypeScript | strict mode | Типизация |
| Tailwind CSS | v4 | Утилитарные стили |
| shadcn/ui | latest | UI-компоненты (формы, модалки, тосты) |
| GSAP 3 | latest | Scroll-анимации, pinning, draggable |
| ScrollTrigger | (GSAP plugin) | Scroll-driven анимации |
| Draggable | (GSAP plugin) | Drag-интеракции (карусель) |
| Framer Motion | latest | Page transitions, mount/unmount |
| Lenis | @studio-freight/lenis | Smooth scrolling |
| Prisma | latest | ORM для PostgreSQL |
| NextAuth v5 | beta | Аутентификация |
| Zod | latest | Валидация данных |
| Resend | latest | Email-уведомления |

---

## Архитектура — жёсткие правила

### Файловая структура
```
src/
├── app/
│   ├── (site)/             # Публичный сайт
│   │   ├── layout.tsx
│   │   ├── template.tsx    # Framer Motion page transitions
│   │   ├── page.tsx        # Главная
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── contact/
│   │   └── booking/
│   ├── admin/              # Админка (защищена auth)
│   ├── api/
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Header, Footer, Preloader, SmoothScroll
│   ├── sections/           # Секции главной: Hero, PinnedShowcase, Carousel...
│   ├── ui/                 # GlassButton, BorderTraceButton, TextReveal, CustomCursor...
│   └── animations/         # ScrollReveal, PageTransition, StaggerChildren
├── hooks/                  # useGSAP, useLenis, useMediaQuery, usePreloader, useMousePosition
├── lib/                    # gsap-config, fonts, constants, utils, data/
├── server/                 # Server Actions, db, auth
├── styles/                 # globals.css
└── types/                  # TypeScript типы
```

### Правила кода
1. **Server Components по умолчанию.** `'use client'` ТОЛЬКО для: useState, useEffect, анимации, event handlers
2. **Каждый компонент — отдельный файл.** Не смешивать
3. **Именование:** PascalCase компоненты, camelCase хуки/утилиты
4. **Импорты:** абсолютные через `@/`
5. **GSAP:** всегда в `useGSAP()` хуке, всегда cleanup
6. **Типизация:** никаких `any`. Все пропсы — интерфейсы
7. **Стили:** Tailwind + CSS-переменные. Никаких inline styles
8. **Изображения:** ВСЕГДА `next/image` с alt-текстом
9. **Шрифты:** ТОЛЬКО через `next/font`
10. **Секции:** каждая — отдельный компонент в `components/sections/`

---

## Дизайн-система

### Философия дизайна
Чёрное зеркало. Строгость. Лаконичность. Минимум элементов — максимум пространства.
Каждый пиксель должен ощущаться дорого. Если сомневаешься — убери, а не добавь.

### Цвета — СТРОГО ТОЛЬКО ЭТИ

```css
:root {
  /* Фоны — глубокий чёрный */
  --bg-primary: #050505;
  --bg-secondary: #0A0A0A;
  --bg-elevated: #111111;
  --bg-card: #0D0D0D;

  /* Текст — белый и серый */
  --text-primary: #FFFFFF;
  --text-secondary: #999999;
  --text-muted: #555555;
  --text-dim: #333333;

  /* Акцент — ТОЛЬКО красный, дорогой, глубокий */
  --accent-red: #C41E2A;
  --accent-red-light: #E63946;
  --accent-red-dark: #8B0000;
  --accent-red-glow: rgba(196, 30, 42, 0.15);

  /* Стекло и отражения */
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-highlight: rgba(255, 255, 255, 0.08);
  --mirror-gradient: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.02) 100%);

  /* Границы */
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-red: rgba(196, 30, 42, 0.3);
}
```

### ЗАПРЕЩЁННЫЕ ЦВЕТА
Золотой, жёлтый, синий, фиолетовый, зелёный, бирюзовый, коричневый, оранжевый, cyan.
Если они появляются где-то в коде — это баг, немедленно исправить.
На сайте существуют ТОЛЬКО: чёрный (оттенки), белый (оттенки серого), красный (accent).

### Красный акцент используется ТОЧЕЧНО
- Логотип: "✕" между MM и DETAILING
- Цены: "от 25 000 ₽"
- Subtitle-labels: font-mono ("PAINT PROTECTION FILM")
- Звёзды отзывов: ★★★★★
- Hover-состояния некоторых элементов (border, text)
- Border-trace на кнопках Типа 2
- Scrollbar thumb
- Text selection background
**НИГДЕ БОЛЬШЕ.** Красный не должен быть "повсюду" — он ценен именно своей редкостью.

### Типографика
- **Display:** "Syne" — hero-заголовки, секционные заголовки, uppercase
- **Body:** "Plus Jakarta Sans" — основной текст, описания
- **Mono:** "Space Mono" — цены, labels, subtitle, технические данные

### Кнопки — ДВА типа, никаких других

**Тип 1: GlassButton** (основные CTA)
- Стеклянный полупрозрачный фон + backdrop-blur
- При hover: диагональный shine (блик) проходит по кнопке слева направо
- Тонкая линия-блик сверху (имитация стекла)
- Варианты: default (белый border) и red (красный border)
- Используется: "Записаться" в Header, CTA в Hero, "Записаться онлайн" в CTA-секции

**Тип 2: BorderTraceButton** (вторичные)
- Полностью прозрачный фон
- При hover: светящаяся точка/линия обегает контур кнопки по периметру
- Цвет линии: белый или красный
- Используется: "Позвонить", навигационные кнопки, "Назад" в формах

**ЗАПРЕЩЕНО:** MagneticButton (кнопки двигающиеся к курсору). Не использовать никогда.

### Пространство — МНОГО воздуха

| Элемент | Отступ |
|---|---|
| Между секциями главной | `py-32 md:py-40 lg:py-48` |
| Заголовок секции → контент | `mb-16 md:mb-24` |
| Внутри карточек | `p-8 md:p-10` |
| Gap в grid карточек | `gap-6 md:gap-8` |
| Hero → следующая секция | Минимум 128px |

### Текст — МИНИМУМ

- Описание на карточке услуги: НЕТ описания — только категория + название + цена
- Описание в секции: максимум 2 строки
- Мелкий текст (text-xs): ТОЛЬКО для font-mono labels/tags
- Всё что можно убрать — убрать
- Кнопок "Записаться" на всём сайте: **максимум 3** (Header, Hero, CTA-секция)

### Анимации

| Анимация | Параметры |
|---|---|
| Smooth scroll | Lenis, duration 1.2, easing expo |
| Scroll reveal | opacity 0→1, translateY 40→0, duration 0.8, ease "power2.out" |
| Stagger | 0.08s между элементами |
| Page transition | Framer Motion, duration 0.4, через template.tsx |
| Preloader | Только при первом визите в сессии (sessionStorage) |
| GlassButton shine | Диагональный блик, duration 0.7s |
| BorderTrace | Точка бежит по периметру, ~3s на круг |

### Ключевые секции главной страницы

1. **HeroVideo** — полноэкранное видео + "MM✕DETAILING" + одна CTA
2. **ServicesOverview** — карточки услуг (тёмные, единый стиль, без цветных gradient-ов)
3. **PinnedShowcase** — полноэкранные фото услуг + текст внизу слева, scroll-driven смена
4. **BeforeAfterReveal** — чистый clip-path reveal, без текстов ДО/ПОСЛЕ, минимальная линия
5. **PortfolioCarousel** — 3D draggable карусель работ
6. **WhyUs** — текст + 4 числовых метрики
7. **Testimonials** — auto-scroll ticker отзывов
8. **CTA** — "ГОТОВЫ?" + 2 кнопки

---

## SEO — обязательно
- Semantic HTML (header, main, section, article, footer)
- Metadata API Next.js для каждой страницы
- JSON-LD (LocalBusiness schema)
- Alt-текст на всех изображениях
- Lazy loading ниже fold

## Производительность
- Server Components по умолчанию
- Dynamic import для клиентских компонентов с анимациями
- WebM + MP4 для видео, poster image
- WebP/AVIF через next/image
- Preload шрифтов

---

## Что НЕЛЬЗЯ делать
- Использовать `pages/` router (только App Router)
- Ставить inline styles (только Tailwind + CSS-переменные)
- Использовать `any` в TypeScript
- Создавать компоненты без типизации пропсов
- Использовать `<img>` вместо `next/image`
- Использовать стандартные шрифты (Arial, Inter, Roboto)
- Использовать MagneticButton или кнопки двигающиеся к курсору
- Использовать ЛЮБЫЕ цвета кроме чёрного, белого и красного (#C41E2A)
- Добавлять кнопки "Записаться" сверх трёх разрешённых мест
- Добавлять длинные описательные тексты
- Забывать cleanup для GSAP-анимаций
- Игнорировать мобильную адаптацию
