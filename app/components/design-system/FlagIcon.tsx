'use client';

import React from 'react';

interface FlagIconProps {
  cuisine: string;
}

const CUISINE_FLAGS: Record<string, string> = {
  'Italian': '🇮🇹',
  'Mexican': '🇲🇽',
  'Japanese': '🇯🇵',
  'Chinese': '🇨🇳',
  'Indian': '🇮🇳',
  'Mediterranean': '🇬🇷🇮🇹🇹🇷',
  'American': '🇺🇸',
  'French': '🇫🇷',
  'Thai': '🇹🇭',
  'Vietnamese': '🇻🇳',
  'Korean': '🇰🇷',
  'Middle Eastern': '🇱🇧🇸🇦🇦🇪',
  'Caribbean': '🇯🇲🇨🇺🇵🇷',
  'African': '🌍',
  'Latin American': '🇲🇽🇧🇷🇦🇷',
  'Greek': '🇬🇷',
  'Spanish': '🇪🇸',
  'Brazilian': '🇧🇷',
  'British': '🇬🇧',
  'German': '🇩🇪',
  'Scandinavian': '🇸🇪🇳🇴🇩🇰',
  'Other': '🌍',
};

export default function FlagIcon({ cuisine }: FlagIconProps) {
  const flag = CUISINE_FLAGS[cuisine] || '🌍';

  return <span className="inline-flex items-center">{flag}</span>;
}
