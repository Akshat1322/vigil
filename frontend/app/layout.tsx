import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import AutoRefresh from '@/components/AutoRefresh';
import VigilLogo from '@/components/VigilLogo';

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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] font-sans">
        <AutoRefresh intervalMs={15000} />
        <header 
          className="h-[52px] w-full px-6 sticky top-0 z-50 flex items-center justify-between"
          style={{ 
            background: 'rgba(10,10,10,0.85)', 
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #1c1c1c'
          }}
        >
          {/* LEFT - Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <VigilLogo className="w-[28px] h-[28px] text-[#34d399]" />
            <span className="text-[#f5f5f5] font-medium text-base">Vigil</span>
          </Link>

          {/* CENTER - Nav */}
          <nav className="flex gap-6 items-center">
            <a href="/#features" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">How it Works</a>
          </nav>

          {/* RIGHT - GitHub */}
          <a href="https://github.com/Akshat1322/vigil" target="_blank" rel="noreferrer" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">
            GitHub ↗
          </a>
        </header>
        <main className="flex-1 min-h-screen bg-[#0a0a0a]">
          {children}
        </main>
      </body>
    </html>
  );
}
