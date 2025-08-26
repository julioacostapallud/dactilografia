import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import DeviceCheck from "./components/DeviceCheck";
import AdSenseLoader from "./components/AdSenseLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DACTILO - Práctica de Dactilografía y Velocidad de Tipeo",
  description: "Mejora tu velocidad de tipeo con DACTILO. Practica dactilografía con textos legales, mide tu WPM y perfecciona tu técnica de escritura. Aplicación gratuita para estudiantes, profesionales y entusiastas del tipeo rápido.",
  keywords: [
    "dactilografía",
    "velocidad de tipeo", 
    "WPM",
    "práctica de escritura",
    "textos legales",
    "mecanografía",
    "técnica de tipeo",
    "palabras por minuto",
    "ejercicios de dactilografía",
    "mejorar velocidad de escritura",
    "curso de mecanografía",
    "práctica de tipeo",
    "velocidad de escritura",
    "textos para practicar",
    "dactilografía online",
    "mecanografía gratuita"
  ],
  authors: [{ name: "Julio Acosta" }],
  creator: "Julio Acosta",
  publisher: "DACTILO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dactilo.com.ar'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DACTILO - Práctica de Dactilografía y Velocidad de Tipeo",
    description: "Mejora tu velocidad de tipeo con DACTILO. Practica dactilografía con textos legales, mide tu WPM y perfecciona tu técnica de escritura.",
    url: 'https://dactilo.com.ar',
    siteName: 'DACTILO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DACTILO - Práctica de Dactilografía',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DACTILO - Práctica de Dactilografía y Velocidad de Tipeo",
    description: "Mejora tu velocidad de tipeo con DACTILO. Practica dactilografía con textos legales, mide tu WPM y perfecciona tu técnica de escritura.",
    images: ['/og-image.png'],
    creator: '@julioacostapallud',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#15803d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "DACTILO",
              "description": "Mejora tu velocidad de tipeo con DACTILO. Practica dactilografía con textos legales, mide tu WPM y perfecciona tu técnica de escritura.",
              "url": "https://dactilo.com.ar",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Person",
                "name": "Julio Acosta",
                "email": "julioacostapallud@gmail.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ARS"
              },
              "featureList": [
                "Práctica de dactilografía",
                "Medición de WPM",
                "Textos legales para practicar",
                "Interfaz moderna y responsive"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AdSenseLoader />
          <DeviceCheck>
            {children}
          </DeviceCheck>
        </Providers>
      </body>
    </html>
  );
}
