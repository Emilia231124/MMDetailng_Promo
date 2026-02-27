import type { Metadata } from "next";
import ServicesPageContent from "@/components/sections/ServicesPageContent";

export const metadata: Metadata = {
  title: "Услуги | MM Detailing",
  description:
    "Полный спектр услуг премиум детейлинга в Махачкале: защитные плёнки, керамика, полировка, химчистка.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
