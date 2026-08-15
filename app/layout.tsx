import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Goldcril Tintas | Cores que transformam | Goianira — GO",
  description: "Tintas, texturas e acabamentos em Goianira — GO. Orientação especializada e orçamento rápido pelo WhatsApp.",
  keywords: ["tintas", "Goldcril", "Goianira", "loja de tintas", "tinta para parede", "texturas"],
  openGraph: { title: "Goldcril Tintas — Cores que transformam", description: "A tinta certa para transformar o seu espaço.", locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
