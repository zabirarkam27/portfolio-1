import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import "@/styles.css";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Ari Novak - Full-Stack Developer & Product Engineer",
  description:
    "Portfolio of Ari Novak, a full-stack developer building considered interfaces, resilient APIs, and everything in between.",
  openGraph: {
    title: "Ari Novak - Full-Stack Developer",
    description: "Selected work, experience, and case studies from a product-focused engineer.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
