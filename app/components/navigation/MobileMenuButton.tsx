interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MobileMenuButton({ onClick, isOpen }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 md:hidden btn btn-ghost btn-circle"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
    >
      <span className="text-2xl">☰</span>
    </button>
  );
}
