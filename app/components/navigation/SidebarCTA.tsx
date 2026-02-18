import Link from 'next/link';

interface SidebarCTAProps {
  isCollapsed: boolean;
}

export default function SidebarCTA({ isCollapsed }: SidebarCTAProps) {
  return (
    <Link
      href="/generate"
      className={`btn btn-primary mb-6 ${isCollapsed ? 'btn-circle' : 'w-full'}`}
      aria-label="Create a new meal plan"
    >
      {isCollapsed ? (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ) : (
        <>
          <svg className="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create a Plan</span>
        </>
      )}
    </Link>
  );
}
