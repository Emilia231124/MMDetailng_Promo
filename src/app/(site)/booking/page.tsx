import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/sections/BookingWizard";

export const metadata: Metadata = {
  title: "Запись | MM Detailing",
  description: "Запишитесь на детейлинг онлайн. Выберите услугу, дату и время.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingWizard />
    </Suspense>
  );
}
