import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/utils/utils";
import { TRPCReactProvider } from '@/trpc/client';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "QwetuLinks | Store POS",
  description: "Manage apparel inventory, orders, customers, and Lipa Mdogo collections for QwetuLinks.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark h-full antialiased", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>
          <ThemeProvider>
            <SessionProvider>{children}</SessionProvider>
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}


 
