import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/utils/utils";
import { TRPCReactProvider } from '@/trpc/client';

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
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>
        <SessionProvider>{children}</SessionProvider>
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}


 