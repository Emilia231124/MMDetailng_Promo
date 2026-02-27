import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Контакты | MM Detailing",
  description:
    "Свяжитесь с нами: адрес, телефон, мессенджеры. Детейлинг-центр в Махачкале.",
};

export default function ContactPage() {
  return <ContactForm />;
}
