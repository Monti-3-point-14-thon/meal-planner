interface SidebarLogoProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarLogo({ isCollapsed, onToggleCollapse }: SidebarLogoProps) {
  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-4 mb-4 border-b border-base-300`}>
      {/* Logo placeholder (32x32px) - hidden when collapsed */}
      {!isCollapsed && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xl">
          🍽️
        </div>
      )}

      {/* App name (hidden when collapsed) */}
      {!isCollapsed && (
        <span className="text-lg font-semibold text-base-content ml-3">
          Meal Planner
        </span>
      )}

      {/* Collapse toggle button */}
      <button
        onClick={onToggleCollapse}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-base-300 transition-colors ml-auto"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
    </div>
  );
}
