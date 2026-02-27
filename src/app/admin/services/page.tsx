import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление услугами | MM Detailing Admin",
  description: "CRUD-интерфейс для управления услугами MM Detailing.",
};

export default function AdminServicesPage() {
  return (
    <main>
      <h1 className="font-display text-4xl font-bold">Услуги</h1>
    </main>
  );
}
