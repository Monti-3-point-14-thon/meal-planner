'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileMenuButton from './MobileMenuButton';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar collapse state (lifted up from Sidebar for content margin adjustment)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false; // Default: expanded
  });

  // Persist collapse state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }
  }, [isCollapsed]);

  // Hide sidebar on auth pages
  const showSidebar = !pathname.startsWith('/auth');

  return (
    <div className="flex">
      {showSidebar && (
        <>
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isOpen={isMobileMenuOpen}
          />
        </>
      )}
      <div className={showSidebar ? `${isCollapsed ? 'md:ml-16' : 'md:ml-64'} ml-0 flex-1 transition-all duration-300` : 'flex-1'}>
        {children}
      </div>
    </div>
  );
}
