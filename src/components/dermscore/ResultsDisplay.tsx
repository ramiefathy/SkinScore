import React from 'react';
import type { CalculationResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Card className="bg-accent/10 border-accent shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
          <CardTitle className="text-xl font-headline text-accent-foreground">Calculation Results</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Score</p>
          <p className="text-3xl font-bold text-primary">{String(result.score)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Clinical Interpretation</p>
          <p className="text-md">{result.interpretation}</p>
        </div>
        {result.details && Object.keys(result.details).length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground">Details</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {Object.entries(result.details).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {String(value)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <CardDescription className="text-xs pt-2">
          Note: This calculation is for informational purposes only and should not replace professional medical advice. 
          All data is processed locally and not stored or transmitted.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
