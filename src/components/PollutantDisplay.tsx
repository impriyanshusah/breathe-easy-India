import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Cloud, Thermometer, Atom, Waves, MountainSnow, Trees } from 'lucide-react'; // Using available icons
import type { AQI } from '@/services/air-quality';

interface PollutantDisplayProps {
  aqiData: AQI | null;
  loading?: boolean;
}

const pollutants = [
  { name: 'CO', key: 'co', unit: 'ppm', icon: Cloud },
  { name: 'O₃', key: 'o3', unit: 'ppm', icon: Waves },
  { name: 'NO₂', key: 'no2', unit: 'ppm', icon: Atom },
  { name: 'SO₂', key: 'so2', unit: 'ppm', icon: Thermometer }, // Reusing thermometer icon
  { name: 'PM₂.₅', key: 'pm25', unit: 'μg/m³', icon: Trees },
  { name: 'PM₁₀', key: 'pm10', unit: 'μg/m³', icon: MountainSnow }, // Reusing mountain snow icon
] as const; // Use 'as const' for stricter typing

export function PollutantDisplay({ aqiData, loading = false }: PollutantDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {pollutants.map((pollutant) => (
        <Card key={pollutant.key} className="text-center shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-center gap-2">
              <pollutant.icon className="h-4 w-4 text-muted-foreground" />
              {pollutant.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="h-6 w-16 bg-muted rounded animate-pulse mx-auto"></div>
            ) : aqiData ? (
              <div className="text-lg font-bold">
                {/* Ensure the key exists before accessing it */}
                {pollutant.key in aqiData ? aqiData[pollutant.key] : '-'}
                <span className="text-xs text-muted-foreground ml-1">{pollutant.unit}</span>
              </div>
            ) : (
              <div className="text-lg font-bold">-</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
