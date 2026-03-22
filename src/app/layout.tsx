import type { Metadata } from "next";
import { Rubik, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Smileey - AI-Powered Skin & Hair Analysis",
  description: "Scan your face. Get a personalized routine and product matches for your skin and hair type.",
  keywords: ["Smileey", "AI", "skincare", "haircare", "beauty", "personalized routine"],
  authors: [{ name: "Smileey Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Smileey - AI-Powered Skin & Hair Analysis",
    description: "Scan your face. Get a personalized routine and product matches for your skin and hair type.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smileey - AI-Powered Skin & Hair Analysis",
    description: "Scan your face. Get a personalized routine and product matches for your skin and hair type.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${rubik.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
