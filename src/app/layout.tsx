import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";


export const metadata: Metadata = {
  title: "Classroom Scheduler",
  description: "A real-time classroom scheduling system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
