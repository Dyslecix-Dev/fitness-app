import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

// TODO: Change APP_NAME, APP_DEFAULT_TITLE, APP_TITLE_TEMPLATE, and APP_DESCRIPTION
const APP_NAME = "Fitness App";
const APP_DEFAULT_TITLE = "Fitness App - Wellness Tracker";
const APP_TITLE_TEMPLATE = "%s | Fitness App";
const APP_DESCRIPTION = "All-in-one workout, nutrition, and mental wellness tracker";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // TODO: Add startUpImage using pwa-asset-generator
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

// TODO: Change color
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

// TODO: Change font
const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

import { CounterStoreProvider } from "@/providers/counter-store-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CounterStoreProvider>{children}</CounterStoreProvider>
          </ThemeProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}

