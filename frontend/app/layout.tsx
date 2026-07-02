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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
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
            <svg className="w-[20px] h-[20px] text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
              <line x1="16" y1="8" x2="2" y2="22"/>
              <line x1="17.5" y1="15" x2="9" y2="15"/>
            </svg>
            <span className="text-[#f5f5f5] font-medium text-base">Vigil</span>
          </Link>

          {/* CENTER - Nav */}
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-sm text-[#f5f5f5] transition-colors">Dashboard</Link>
            <Link href="/dashboard" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">Models</Link>
            <Link href="/dashboard" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">Reports</Link>
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
