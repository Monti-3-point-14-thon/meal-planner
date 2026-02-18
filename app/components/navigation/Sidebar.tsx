'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarCTA from './SidebarCTA';
import SidebarNav from './SidebarNav';
import SidebarSettings from './SidebarSettings';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen = false, setIsMobileMenuOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  // Close mobile menu on route change (T018)
  useEffect(() => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, setIsMobileMenuOpen]);

  // Close mobile menu on Escape key (T021)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen && setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed left-0 top-0 h-screen bg-base-200 border-r border-base-300 z-50
          transition-all duration-300
          ${isCollapsed ? 'w-16 px-2 py-4' : 'w-64 p-4'}
          md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <SidebarLogo isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
          <SidebarCTA isCollapsed={isCollapsed} />
          <SidebarNav isCollapsed={isCollapsed} pathname={pathname} />
          <SidebarSettings isCollapsed={isCollapsed} pathname={pathname} />
        </div>
      </nav>

      {/* Mobile backdrop overlay (T019) */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
