import type { Metadata } from "next";
import AboutContent from "@/components/sections/AboutContent";

export const metadata: Metadata = {
  title: "О нас | MM Detailing",
  description:
    "Узнайте больше о команде MM Detailing — премиум детейлинг-центре в Махачкале.",
};

export default function AboutPage() {
  return <AboutContent />;
}
