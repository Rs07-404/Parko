import type { Metadata, Viewport } from "next";
import { poppins } from "@/styles/fonts/Fonts";
import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/context/theme-provider";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layout/app-layout";
import { AuthContextProvider } from "@/context/auth-context";


export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '0 0% 100%' },
    { media: '(prefers-color-scheme: dark)', color: '222.2 84% 4.9%' },
  ],
};

export const metadata: Metadata = {
  title: "Parko",
  description: "Parko",
  applicationName: "Parko",
  keywords: ["Parko"],
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      url: "/android-chrome-512x512.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cn(poppins.className)}`}>
        <ThemeProvider>
          <Theme>
            <AuthContextProvider>
            <AppLayout>
              <div className="m-0 mt-14"></div>
              {children}
            </AppLayout>
            </AuthContextProvider>
            <Toaster position="top-center" />
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
