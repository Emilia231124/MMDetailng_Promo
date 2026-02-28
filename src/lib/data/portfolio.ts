import type { ServiceCategory } from "./services";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  serviceSlug: string;
  category: ServiceCategory;
  gradientBefore: string;
  gradientAfter: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "1",
    title: "PPF на BMW X5",
    description: "Полная оклейка кузова XPEL Ultimate Plus. Защита всех ударных зон: бампера, капота, зеркал, порогов и крыльев.",
    serviceSlug: "ppf",
    category: "Защита",
    gradientBefore: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    gradientAfter: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
  },
  {
    id: "2",
    title: "Керамика на Mercedes C-Class",
    description: "Нанесение двухслойной нанокерамики Gtechniq Crystal Serum Ultra. Твёрдость 10H, гарантия 9 лет.",
    serviceSlug: "ceramic",
    category: "Защита",
    gradientBefore: "linear-gradient(135deg, #222222 0%, #333333 100%)",
    gradientAfter: "linear-gradient(135deg, #101010 0%, #1c1c1c 100%)",
  },
  {
    id: "3",
    title: "Полировка Porsche 911",
    description: "Двухстадийная коррекция лака с устранением 95% дефектов. Финишное покрытие карнаубским воском.",
    serviceSlug: "polishing",
    category: "Восстановление",
    gradientBefore: "linear-gradient(135deg, #1a1a1a 0%, #252525 100%)",
    gradientAfter: "linear-gradient(135deg, #111111 0%, #1e1e1e 100%)",
  },
  {
    id: "4",
    title: "Химчистка салона Lexus LX",
    description: "Полная химчистка кожаного салона: экстракция, кондиционирование, озонирование. Результат — как из автосалона.",
    serviceSlug: "interior",
    category: "Уход",
    gradientBefore: "linear-gradient(135deg, #141414 0%, #1f1f1f 100%)",
    gradientAfter: "linear-gradient(135deg, #0d0d0d 0%, #181818 100%)",
  },
  {
    id: "5",
    title: "Виниловая оклейка Range Rover",
    description: "Полная оклейка кузова в матовый антрацит Hexis. Смена цвета с белого на тёмный без покраски.",
    serviceSlug: "vinyl-wrap",
    category: "Стайлинг",
    gradientBefore: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
    gradientAfter: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  },
  {
    id: "6",
    title: "Тонировка Tesla Model Y",
    description: "Керамическая тонировка Formula One Pinnacle 30% на все боковые стёкла и заднее. Светопропускаемость документально подтверждена.",
    serviceSlug: "tinting",
    category: "Стайлинг",
    gradientBefore: "linear-gradient(135deg, #303030 0%, #404040 100%)",
    gradientAfter: "linear-gradient(135deg, #0e0e0e 0%, #191919 100%)",
  },
  {
    id: "7",
    title: "Полировка фар Toyota Land Cruiser",
    description: "Восстановление пожелтевших фар с нанесением УФ-защитного лака. Видимость в ночное время улучшена на 80%.",
    serviceSlug: "headlight-polish",
    category: "Восстановление",
    gradientBefore: "linear-gradient(135deg, #161616 0%, #212121 100%)",
    gradientAfter: "linear-gradient(135deg, #0f0f0f 0%, #1b1b1b 100%)",
  },
  {
    id: "8",
    title: "PPF на Audi RS6",
    description: "Частичная оклейка — передняя часть, зеркала и пороги. Плёнка STEK DYNOshield с самовосстановлением.",
    serviceSlug: "ppf",
    category: "Защита",
    gradientBefore: "linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)",
    gradientAfter: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
  },
  {
    id: "9",
    title: "Химчистка Porsche Cayenne",
    description: "Комплексная чистка: алькантара, перфорированная кожа, деревянные вставки, потолок. До и после — небо и земля.",
    serviceSlug: "interior",
    category: "Уход",
    gradientBefore: "linear-gradient(135deg, #131313 0%, #1e1e1e 100%)",
    gradientAfter: "linear-gradient(135deg, #0d0d0d 0%, #181818 100%)",
  },
];
