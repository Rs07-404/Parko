import type { Metadata } from "next";
import { poppins } from "@/styles/fonts/Fonts";
import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/context/theme-provider";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layout/app-layout";



export const metadata: Metadata = {
  title: "Parko",
  description: "Parko",
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
            <AppLayout>
              <div className="m-0 pt-20"></div>
            {children}
            </AppLayout>
            <Toaster position="top-right"/>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
