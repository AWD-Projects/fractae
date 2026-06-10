import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const BASE_URL = "https://fractae.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FRACTAE — Gestión inteligente para fraccionamientos",
    template: "%s | FRACTAE",
  },
  description:
    "Centraliza accesos, finanzas y comunicación de tu fraccionamiento o condominio en un solo lugar. Deja atrás el Excel, WhatsApp y el papel.",
  keywords: [
    "fraccionamiento",
    "condominio",
    "gestión residencial",
    "administración de condominios",
    "software fraccionamiento",
    "control de accesos",
    "cobranza automatizada",
  ],
  authors: [{ name: "FRACTAE", url: BASE_URL }],
  creator: "FRACTAE",
  publisher: "FRACTAE",
  openGraph: {
    type: "website",
    locale: "es_MX",
    alternateLocale: ["en_US", "fr_FR"],
    url: BASE_URL,
    siteName: "FRACTAE",
    title: "FRACTAE — Gestión inteligente para fraccionamientos",
    description:
      "Centraliza accesos, finanzas y comunicación de tu fraccionamiento en un solo lugar.",
    images: [
      {
        url: "/favicon.png",
        width: 2193,
        height: 2034,
        alt: "FRACTAE",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FRACTAE — Gestión inteligente para fraccionamientos",
    description:
      "Centraliza accesos, finanzas y comunicación de tu fraccionamiento.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
