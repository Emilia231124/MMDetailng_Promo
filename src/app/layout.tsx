import type { Metadata } from "next";
import { fontDisplay, fontBody, fontMono } from "@/lib/fonts";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import ClientRoot from "@/components/layout/ClientRoot";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Премиум детейлинг в Махачкале`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | Премиум детейлинг в Махачкале`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "MM Detailing — Премиум детейлинг-центр в Махачкале",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Премиум детейлинг в Махачкале`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MM Detailing",
  description: "Премиум детейлинг-центр в Махачкале. Защита, полировка, химчистка автомобилей.",
  url: "https://mm-detailing.ru",
  telephone: "+7-928-000-00-00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Гагарина, д. 15",
    addressLocality: "Махачкала",
    addressRegion: "Дагестан",
    addressCountry: "RU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  priceRange: "₽₽₽",
  image: "https://mm-detailing.ru/og-image.jpg",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}
    >
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
