"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, HeartHandshake, Award, Stethoscope, Hospital, MessageSquare } from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/pledges', label: 'Pledges', icon: HeartHandshake },
  { href: '/admin/rewards', label: 'Rewards', icon: Award },
  { href: '/admin/services', label: 'Services', icon: Stethoscope },
  { href: '/admin/hospitals', label: 'Hospitals', icon: Hospital },
  { href: '/admin/sms-tools', label: 'SMS Tools', icon: MessageSquare },
];

export function AdminNavMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
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
