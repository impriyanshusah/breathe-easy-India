import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { AqiBadge } from './AqiBadge';
import { Skeleton } from './ui/skeleton'; // Import Skeleton

interface AqiPredictionProps {
  predictedAqi: number | null;
  precautions: string | null;
  loading?: boolean;
}

export function AqiPrediction({ predictedAqi, precautions, loading = false }: AqiPredictionProps) {
  return (
    <Card className="shadow-lg border border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <AlertTriangle className="h-5 w-5 text-accent" />
          Tomorrow's AQI Prediction & Precautions
        </CardTitle>
         <CardDescription>
          AI-powered prediction and advice based on historical trends. This is an estimate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-semibold mb-2">Predicted AQI:</h3>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : predictedAqi !== null ? (
            <AqiBadge aqi={predictedAqi} />
          ) : (
            <p className="text-muted-foreground">Prediction not available.</p>
          )}
        </div>
         <div>
          <h3 className="text-md font-semibold mb-2 flex items-center gap-1">
             <Info className="h-4 w-4 text-primary" />
            Recommended Precautions:
            </h3>
          {loading ? (
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <Skeleton className="h-4 w-3/4" />
            </div>
          ) : precautions ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{precautions}</p>
          ) : (
            <p className="text-muted-foreground">Precautions not available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
