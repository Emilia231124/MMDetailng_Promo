import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Модерация отзывов | MM Detailing Admin",
  description: "Модерация и управление отзывами клиентов MM Detailing.",
};

export default function AdminReviewsPage() {
  return (
    <main>
      <h1 className="font-display text-4xl font-bold">Отзывы</h1>
    </main>
  );
}
