'use client';

import { Goal } from '@/lib/types';

interface GoalSelectorProps {
  value: Goal;
  onChange: (goal: Goal) => void;
  error?: string;
}

const GOALS = [
  { value: 'muscle_building' as Goal, label: 'Muscle Building', icon: '💪' },
  { value: 'weight_loss' as Goal, label: 'Weight Loss', icon: '⚖️' },
  { value: 'gut_health' as Goal, label: 'Gut Health', icon: '🦠' },
  { value: 'mental_performance' as Goal, label: 'Mental Performance', icon: '🧠' },
  { value: 'general_health' as Goal, label: 'General Health', icon: '❤️' },
];

export default function GoalSelector({ value, onChange, error }: GoalSelectorProps) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">What is your primary health goal?</span>
      </label>
      <select
        className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value as Goal)}
      >
        <option value="" disabled>
          Select your goal
        </option>
        {GOALS.map((goal) => (
          <option key={goal.value} value={goal.value}>
            {goal.icon} {goal.label}
          </option>
        ))}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
