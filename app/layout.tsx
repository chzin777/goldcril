import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Goldcril Tintas · Cores que transformam · Goianira · GO",
  description:
    "Loja de tintas em Goianira - GO. Tintas para parede, esmalte, texturas, acessórios e acabamentos com atendimento especializado. Peça um orçamento pelo WhatsApp.",
  keywords: [
    "tintas",
    "Goldcril",
    "Goianira",
    "loja de tintas",
    "tinta parede",
    "esmalte",
    "textura",
  ],
  openGraph: {
    title: "Goldcril Tintas — Cores que transformam",
    description:
      "Tintas e acabamentos com atendimento especializado em Goianira - GO.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
