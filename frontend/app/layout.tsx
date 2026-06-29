import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import AutoRefresh from '@/components/AutoRefresh';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vigil — AI Model Monitor",
  description: "Know when your AI changes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0f1117] text-[#f1f5f9] font-sans">
        <AutoRefresh intervalMs={15000} />
        <header className="bg-[#161b27] border-b border-[#1e2433] h-16 w-full px-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="flex h-full items-center">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg className="w-[24px] h-[24px] text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                  <line x1="16" y1="8" x2="2" y2="22"/>
                  <line x1="17.5" y1="15" x2="9" y2="15"/>
                </svg>
                <span className="text-[#f1f5f9] font-semibold text-xl">Vigil</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 min-h-screen bg-[#0f1117]">
          {children}
        </main>
      </body>
    </html>
  );
}
