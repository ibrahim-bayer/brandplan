import type { Metadata } from 'next';
import '@brandplan/ui/styles.css';
import './brandplan.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrandPlan Example - Next.js',
  description: 'End-to-end integration example of BrandPlan with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-brand-surface-0 text-brand-text-primary">{children}</body>
    </html>
  );
}
