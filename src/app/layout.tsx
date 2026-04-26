import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/auth/";
import { QueryProvider } from "@/providers/QueryProvider";
import { GlobalLoader } from "@/components/logo-loader-provider";
import { InitialLoader } from "@/components/initial-loader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "produtividade",
    "hábitos",
    "gamificação",
    "Nucleos",
    "foco",
    "XP",
    "level up",
    "organização",
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@nucleosapp",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="min-h-dvh" lang="pt-BR" suppressHydrationWarning>
      <body
        className={`min-h-dvh ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId="989373819860-qb1csbaig0afvm9s5ek3p1on3ojco7j4.apps.googleusercontent.com">
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <Suspense fallback={<InitialLoader />}>{children}</Suspense>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>

        <Analytics />
      </body>
    </html>
  );
}
