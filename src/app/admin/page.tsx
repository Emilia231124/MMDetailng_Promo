import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MM Detailing Admin",
  description: "Панель управления MM Detailing.",
};

export default function AdminDashboardPage() {
  return (
    <main>
      <h1 className="font-display text-4xl font-bold">Dashboard</h1>
    </main>
  );
}
