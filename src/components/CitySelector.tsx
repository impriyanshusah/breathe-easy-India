'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { indianCities } from '@/constants/cities';
import type { City } from '@/services/air-quality';

interface CitySelectorProps {
  selectedCity: City | null;
  onCityChange: (city: City) => void;
  disabled?: boolean;
}

export function CitySelector({
  selectedCity,
  onCityChange,
  disabled = false,
}: CitySelectorProps) {
  const handleValueChange = (cityName: string) => {
    const city = indianCities.find((c) => c.name === cityName);
    if (city) {
      onCityChange(city);
    }
  };

  return (
    <Select
      value={selectedCity?.name ?? ''}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full md:w-[280px]">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        {indianCities.map((city) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
