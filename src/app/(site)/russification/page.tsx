import { Suspense } from "react";
import type { Metadata } from "next";
import RussificationContent from "@/components/sections/RussificationContent";

export const metadata: Metadata = {
  title: "Русификация авто | MM Detailing",
  description:
    "Русификация мультимедиа, приборной панели и голосового помощника китайских автомобилей. Найдите свою модель и узнайте стоимость.",
};

export default function RussificationPage() {
  return (
    <Suspense>
      <RussificationContent />
    </Suspense>
  );
}
