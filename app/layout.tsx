/**
 * Root Layout
 * Main layout for the entire application
 */

import type { Metadata } from 'next';
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
