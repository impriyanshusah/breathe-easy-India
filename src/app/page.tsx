'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { CitySelector } from '@/components/CitySelector';
import { AqiBadge } from '@/components/AqiBadge';
import { PollutantDisplay } from '@/components/PollutantDisplay';
import { AqiPrediction } from '@/components/AqiPrediction';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { indianCities } from '@/constants/cities';
import type { City, AQI } from '@/services/air-quality';
import { getAirQualityIndex } from '@/services/air-quality'; // Assuming you have this function implemented
import { predictAqi, PredictAqiInput } from '@/ai/flows/predict-aqi'; // Import AI prediction function
import { getAqiPrecautions, AqiPrecautionsInput } from '@/ai/flows/aqi-precautions'; // Import AI precautions function
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, HeartPulse, Wind } from 'lucide-react'; // Import icons
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Button } from '@/components/ui/button';


export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(indianCities[0] ?? null); // Default to first city or null
  const [currentAqi, setCurrentAqi] = useState<AQI | null>(null);
  const [predictedAqi, setPredictedAqi] = useState<number | null>(null);
  const [precautions, setPrecautions] = useState<string | null>(null);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition(); // For smooth updates

  const isLoading = isLoadingCurrent || isLoadingPrediction || isPending;

  // Fetch data when selectedCity changes
  const fetchData = useCallback(async (city: City) => {
    if (!city) return;

    setIsLoadingCurrent(true);
    setIsLoadingPrediction(true);
    setError(null);
    setCurrentAqi(null); // Clear previous data
    setPredictedAqi(null);
    setPrecautions(null);

    try {
      // Fetch Current AQI
      const aqiData = await getAirQualityIndex(city);
      startTransition(() => {
        setCurrentAqi(aqiData);
      });

      // Prepare data for AI prediction (using dummy historical data for now)
       // In a real app, you'd fetch or have actual historical data
      const historicalAqiData = [
        { aqi: aqiData.aqi - 10 }, // Example dummy data
        { aqi: aqiData.aqi - 5 },
        { aqi: aqiData.aqi },
        { aqi: aqiData.aqi + 2 },
        { aqi: aqiData.aqi - 3 },
        { aqi: aqiData.aqi + 5 },
        { aqi: aqiData.aqi - 1 },
      ];

       const predictionInput: PredictAqiInput = {
        city: { name: city.name, latitude: city.latitude, longitude: city.longitude },
        historicalAqiData: historicalAqiData.slice(-7), // Use last 7 days
      };

      // Call AI Prediction Flow
      const predictionResult = await predictAqi(predictionInput);
      const predictedValue = predictionResult?.predictedAqi ?? null;


      if (predictedValue !== null) {
         // Fetch Precautions based on prediction
         const precautionsInput: AqiPrecautionsInput = {
            city: city.name,
            predictedAqi: predictedValue,
        };
        const precautionsResult = await getAqiPrecautions(precautionsInput);
        startTransition(() => {
            setPredictedAqi(predictedValue);
            setPrecautions(precautionsResult?.precautions ?? 'No specific precautions available.');
        });
      } else {
         startTransition(() => {
           setPredictedAqi(null);
           setPrecautions('Prediction unavailable, cannot generate precautions.');
         });
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch AQI data. Please try again later.');
      startTransition(() => {
        setCurrentAqi(null);
        setPredictedAqi(null);
        setPrecautions(null);
      });
    } finally {
        setIsLoadingCurrent(false);
        setIsLoadingPrediction(false);
    }
  }, []);

  // Fetch data on initial mount and when city changes
  useEffect(() => {
    if (selectedCity && isMounted) {
      fetchData(selectedCity);
    }
  }, [selectedCity, fetchData, isMounted]);

 useEffect(() => {
    // This effect runs only once on the client after hydration
    setIsMounted(true);
    if (selectedCity) {
      fetchData(selectedCity); // Initial fetch on mount
    }
  }, []); // Empty dependency array ensures it runs once client-side

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-3">
             <Wind className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
             BreatheEasy India
            </h1>
        </div>

        <div className="w-full md:w-auto">
         <CitySelector
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            disabled={isLoading}
          />
        </div>
      </header>

      <main className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current AQI Section */}
        <Card className="shadow-md transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                Current Air Quality {selectedCity ? `in ${selectedCity.name}` : ''}
            </CardTitle>
            <CardDescription>
                Real-time air quality index and pollutant levels. Updated periodically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">Overall AQI:</h2>
              {isLoadingCurrent || !isMounted ? (
                 <Skeleton className="h-8 w-40" />
              ) : currentAqi ? (
                <AqiBadge aqi={currentAqi.aqi} />
              ) : (
                <p className="text-muted-foreground">Loading AQI...</p>
              )}
            </div>
             <h3 className="text-md font-semibold mb-2">Pollutant Levels:</h3>
            <PollutantDisplay aqiData={currentAqi} loading={isLoadingCurrent || !isMounted} />
          </CardContent>
        </Card>


        {/* Prediction Section */}
        <AqiPrediction
          predictedAqi={predictedAqi}
          precautions={precautions}
          loading={isLoadingPrediction || !isMounted}
        />

      </main>

       <footer className="mt-12 text-center text-sm text-muted-foreground">
         <p>Data sourced from public APIs. Predictions are AI-generated estimates.</p>
         <p>&copy; {new Date().getFullYear()} BreatheEasy India. Stay safe!</p>
       </footer>
    </div>
  );
}
