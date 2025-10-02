import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/providers/trpc-provider";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "InstaSlide - AI Slideshow Creator",
  description: "Create beautiful presentations from PDFs or outlines using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <TRPCProvider>{children}</TRPCProvider>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
