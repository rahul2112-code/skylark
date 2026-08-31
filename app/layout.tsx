import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Skylark BI Agent — Business Intelligence for Drones',
  description:
    'AI-powered business intelligence agent that answers founder-level queries across Monday.com Work Orders and Deals data in real time.',
  keywords: ['business intelligence', 'monday.com', 'AI agent', 'pipeline', 'work orders', 'Skylark Drones'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
