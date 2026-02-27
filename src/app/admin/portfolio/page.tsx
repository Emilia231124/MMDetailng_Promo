import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление портфолио | MM Detailing Admin",
  description: "CRUD-интерфейс для управления портфолио MM Detailing.",
};

export default function AdminPortfolioPage() {
  return (
    <main>
      <h1 className="font-display text-4xl font-bold">Портфолио</h1>
    </main>
  );
}
