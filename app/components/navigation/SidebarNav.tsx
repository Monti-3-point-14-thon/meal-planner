import Link from 'next/link';

interface SidebarNavProps {
  isCollapsed: boolean;
  pathname: string;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    href: '/meal-plans',
    label: 'Meal Plans',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
];

export default function SidebarNav({ isCollapsed, pathname }: SidebarNavProps) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="space-y-1 flex-1">
      {navItems.map((item) => {
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
    </div>
  );
}
