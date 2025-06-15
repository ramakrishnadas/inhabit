// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "./components/NavBar";

// Main layout for entire web application

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InHabits",
  description: "Transform your life with small daily actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>

        <footer className="text-center text-sm py-6 bg-green-100 my-0">
          © 2025 InHabits. All rights reserved.
        </footer>

      </body>
    </html>
  );
}
