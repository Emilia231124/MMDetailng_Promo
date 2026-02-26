import { Syne, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";

export const fontDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
  display: "swap",
});

export const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});
