import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import OracleTrigger from "@/components/OracleTrigger";
import BrainDumpInput from "@/components/BrainDumpInput";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeProvider from "@/components/ThemeProvider";
import KillListProvider from "@/components/KillListProvider";
import OfflineBanner from "@/components/OfflineBanner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oracle Compass",
  description: "Sovereign creator daily command center",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oracle",
  },
};

export const viewport = {
  themeColor: "#f8f6f0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ErrorBoundary>
          <ThemeProvider>
            <KillListProvider>
              <OfflineBanner />
              <OracleTrigger />
              <BrainDumpInput />
              <main id="main-content">
                {children}
              </main>
              <BottomNav />
            </KillListProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
