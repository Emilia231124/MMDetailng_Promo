import type { Metadata } from "next";
import PortfolioContent from "@/components/sections/PortfolioContent";

export const metadata: Metadata = {
  title: "Портфолио | MM Detailing",
  description:
    "Результаты наших работ: защита кузова, полировка, керамика, химчистка салона.",
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
