// Component to display macronutrient breakdown

import { Macros } from '@/lib/types';

interface MacroDisplayProps {
  macros: Macros;
  showFiber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MacroDisplay({
  macros,
  showFiber = true,
  size = 'md',
}: MacroDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const badgeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <div className={`flex flex-wrap gap-2 ${sizeClasses[size]}`}>
      {/* Calories */}
      <div className={`badge badge-primary ${badgeClasses[size]} gap-1`}>
        <span className="font-semibold">{Math.round(macros.calories)}</span>
        <span className="opacity-70">kcal</span>
      </div>

      {/* Protein */}
      <div className={`badge badge-success ${badgeClasses[size]} gap-1`}>
        <span className="font-semibold">{Math.round(macros.protein)}g</span>
        <span className="opacity-70">protein</span>
      </div>

      {/* Carbs */}
      <div className={`badge badge-warning ${badgeClasses[size]} gap-1`}>
        <span className="font-semibold">{Math.round(macros.carbs)}g</span>
        <span className="opacity-70">carbs</span>
      </div>

      {/* Fat */}
      <div className={`badge badge-info ${badgeClasses[size]} gap-1`}>
        <span className="font-semibold">{Math.round(macros.fat)}g</span>
        <span className="opacity-70">fat</span>
      </div>

      {/* Fiber (optional) */}
      {showFiber && (
        <div className={`badge badge-secondary ${badgeClasses[size]} gap-1`}>
          <span className="font-semibold">{Math.round(macros.fiber)}g</span>
          <span className="opacity-70">fiber</span>
        </div>
      )}
    </div>
  );
}
