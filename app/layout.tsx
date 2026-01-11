/**
 * Root Layout
 * Main layout for the entire application
 * Notion-style layout with sidebar
 */

import type { Metadata } from 'next';
import { NotionSidebar } from '@/components/NotionSidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sonic KI - Voice-First Note Taking',
  description: 'Phase I: Voice-first note-taking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#191919] text-[#E9E9E9]">
        <div className="flex min-h-screen">
          <NotionSidebar />
          <main className="flex-1 min-w-0 bg-[#1F1F1F]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
