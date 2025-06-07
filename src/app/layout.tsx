// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "./components/NavBar"; // <-- import NavBar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Positive Habits",
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
          <NavBar /> {/* <-- all pages */}
          <main>{children}</main>
        </Providers>
        
        {/* Footer */}
        <footer className="text-center text-sm py-6 bg-green-100">
          © 2025 Positive Habits. All rights reserved.
        </footer>

      </body>
    </html>
  );
}
