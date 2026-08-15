import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinInsight',
  description: 'AI-powered financial insights dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
