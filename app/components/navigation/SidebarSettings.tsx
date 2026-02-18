'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface SidebarSettingsProps {
  isCollapsed: boolean;
  pathname: string;
}

const settingsItems = [
  {
    href: '/settings/profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function SidebarSettings({ isCollapsed, pathname }: SidebarSettingsProps) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="mt-auto border-t border-base-300 pt-4 space-y-1">
      {settingsItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center rounded-lg transition-colors ${
              isCollapsed
                ? 'justify-center w-11 h-11 min-w-[44px]'
                : 'gap-3 px-3 py-2'
            } ${
              active
                ? 'bg-base-300 text-base-content font-medium'
                : 'hover:bg-base-300 text-base-content'
            }`}
            aria-current={active ? 'page' : undefined}
            aria-label={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        );
      })}

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className={`flex items-center rounded-lg hover:bg-base-300 text-error cursor-pointer ${
          isCollapsed
            ? 'justify-center w-11 h-11 min-w-[44px]'
            : 'gap-3 px-3 py-2 w-full text-left'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Log out of your account"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {!isCollapsed && <span className="text-sm">Log out</span>}
      </button>
    </div>
  );
}
