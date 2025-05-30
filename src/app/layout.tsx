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
  openGraph: {
    title: "Parko",
    description: "Easy Parking",
    url: "https://parko-orpin.vercel.app",
    siteName: "Parko",
    images: [
      {
        url: "/ParkoConcept.png",
        width: 512,
        height: 512,
        alt: "App Preview Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parko",
    description: "Easy Parking",
    images: ["/android-chrome-512x512.png"], // again, full URL is better
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cn(poppins.className)}`}>
        <AuthContextProvider>
          <ThemeProvider>
            <Theme>
              {/* <div className="m-0 mt-14"></div> */}
              <AppLayout>
                {children}
              </AppLayout>
              <Toaster 
                position="top-center" 
                richColors={true} 
                className="toaster-override"
                toastOptions={{
                  className: 'toaster-override'
                }}
              />
            </Theme>
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
