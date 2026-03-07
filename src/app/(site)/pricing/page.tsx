import { Suspense } from "react";
import type { Metadata } from "next";
import PricingContent from "@/components/sections/PricingContent";

export const metadata: Metadata = {
  title: "Цены | MM Detailing",
  description:
    "Прозрачные цены на все услуги детейлинга. Специальные цены для новых автомобилей.",
};

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}
