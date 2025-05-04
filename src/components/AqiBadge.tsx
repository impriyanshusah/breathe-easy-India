import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AqiBadgeProps {
  aqi: number;
}

const getAqiLevel = (aqi: number): { level: string; color: string } => {
  if (aqi <= 50) return { level: 'Good', color: 'bg-green-500 hover:bg-green-600' };
  if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500 hover:bg-yellow-600' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500 hover:bg-orange-600' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500 hover:bg-red-600' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500 hover:bg-purple-600' };
  return { level: 'Hazardous', color: 'bg-maroon-500 hover:bg-maroon-600' }; // Note: Tailwind doesn't have maroon, might need custom color
};

export function AqiBadge({ aqi }: AqiBadgeProps) {
  const { level, color } = getAqiLevel(aqi);

  return (
    <Badge className={cn("text-white font-semibold px-3 py-1 text-sm", color)}>
      {aqi} - {level}
    </Badge>
  );
}
