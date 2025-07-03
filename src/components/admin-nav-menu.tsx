"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { MessageSquare } from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'SMS Tools', icon: MessageSquare },
];

export function AdminNavMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  }

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.href)}
          >
            <Link href={item.href}>
              <item.icon className="text-primary" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
