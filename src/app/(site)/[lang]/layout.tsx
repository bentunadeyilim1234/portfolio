import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { GlassFilter } from "@/components/glass/GlassFilter";
import { glassTierScript } from "@/lib/glass-tier";
import { LANGS, isLang } from "@/lib/i18n";
import "../../globals.css";
import "@/components/glass/glass.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = { title: "Ali Tuna Baylan" };

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function SiteLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: glassTierScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GlassFilter />
          {children}
          {/* IslandBar goes here (Task 7) */}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
