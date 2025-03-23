"use client"; // Keep this at the top

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "tailwindcss/tailwind.css";
// import "../styles/globals.css";
import Layout from "@/components/layout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
        <Layout>{children}</Layout>

        </SessionProvider>
      </body>
    </html>
  );
}

