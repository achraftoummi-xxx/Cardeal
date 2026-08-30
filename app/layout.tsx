import "./globals.css";
import type { Metadata, Viewport } from "next";
import TranslationProvider from "@/components/TranslationProvider";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import cardealLogo from "@/assets/images/cardeal_logo.png";

export const metadata: Metadata = {
  title: "CarDeal",
  description: "Find the right repair shop for your vehicle, near you.",
  icons: {
    icon: [{ url: cardealLogo.src }],
    apple: [{ url: cardealLogo.src }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CarDeal",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a10" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("locale");if(l){document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <TranslationProvider>
            <AuthProvider>{children}</AuthProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}