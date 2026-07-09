import type { Metadata } from "next";
import localFont from "next/font/local";

import { MotionProvider } from "@/components/motion";
import { getCanonicalUrl, getSiteUrl, siteContent } from "@/content/site";

import "./globals.css";

const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteContent.metadata.title,
    template: siteContent.metadata.titleTemplate,
  },
  description: siteContent.metadata.description,
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    siteName: siteContent.metadata.siteName,
    type: "website",
    url: getCanonicalUrl(),
    images: [
      {
        url: siteContent.metadata.ogImagePath,
        width: 1200,
        height: 630,
        alt: "Growth Specialists ocean and coral brand mark",
      },
    ],
  },
  twitter: {
    card: siteContent.metadata.twitterCard,
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    images: [siteContent.metadata.ogImagePath],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
