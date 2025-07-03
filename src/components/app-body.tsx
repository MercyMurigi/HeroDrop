'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';

export function AppBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/signup';
  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }
  
  return <MainLayout>{children}</MainLayout>;
}
