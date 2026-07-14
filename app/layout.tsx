import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "@/styles.css";
import { ThemeProvider } from "@/lib/theme";
import { baseMetadata } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  ...baseMetadata({
    title: "Zabir Arkam - Full-Stack Developer & Product Engineer",
    description:
      "Portfolio of Zabir Arkam, a full-stack developer building considered interfaces, resilient APIs, and thoughtful digital products.",
    image: "/assets/portrait.png",
  }),
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
