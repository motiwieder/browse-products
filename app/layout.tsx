import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'Browse our collection of products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
