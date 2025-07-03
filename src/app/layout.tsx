"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';

// This is a workaround to make metadata work with a client component
const metadata: Metadata = {
  title: 'HeroDrop+',
  description: 'Donate blood, earn rewards, save lives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/signup';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        {isLoginPage || isAdminPage ? children : <MainLayout>{children}</MainLayout>}
        <Toaster />
      </body>
    </html>
  );
}
