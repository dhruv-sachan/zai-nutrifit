import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriFit — AI-Powered Health & Nutrition",
  description:
    "NutriFit is a premium, AI-powered health platform. Personalized TDEE & macro targets, AI-generated workouts, and instant meal analysis — all in a beautiful glassmorphism experience.",
  keywords: [
    "NutriFit",
    "nutrition",
    "fitness",
    "AI health",
    "TDEE calculator",
    "macros",
    "workout generator",
    "meal analyzer",
  ],
  authors: [{ name: "NutriFit" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "NutriFit — AI-Powered Health & Nutrition",
    description:
      "Personalized TDEE & macro targets, AI workouts, and instant meal analysis.",
    siteName: "NutriFit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
