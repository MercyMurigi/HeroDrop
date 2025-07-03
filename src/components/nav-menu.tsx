"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, CalendarPlus, Wallet, ShoppingBag, Gift, User } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/booking', label: 'Book Donation', icon: CalendarPlus },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/redeem', 'label': 'Redeem Tokens', icon: ShoppingBag },
  { href: '/referrals', 'label': 'Refer a Friend', icon: Gift },
  { href: '/profile', 'label': 'My Profile', icon: User },
];

export function NavMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href || pathname === '/';
    }
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
