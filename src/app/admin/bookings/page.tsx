import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление записями | MM Detailing Admin",
  description: "Просмотр и управление записями клиентов MM Detailing.",
};

export default function AdminBookingsPage() {
  return (
    <main>
      <h1 className="font-display text-4xl font-bold">Записи</h1>
    </main>
  );
}
