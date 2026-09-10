import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import { getSiteSettings } from "@/lib/content/settings";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildRootMetadata(settings);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let lang = "en";
  try {
    lang = await getRequestLocale();
  } catch {
    /* keep en */
  }

  return (
    <html lang={lang}>
      <body className={`${inter.variable} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
