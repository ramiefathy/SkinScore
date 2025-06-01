
import React from 'react';
import type { CalculationResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ListOrdered } from 'lucide-react';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Card className="bg-accent/10 border-accent shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-7 w-7 text-accent-foreground" />
          <CardTitle className="text-2xl font-headline text-accent-foreground">Calculation Results</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-0.5">Score</p>
          <p className="text-4xl font-bold text-primary">{String(result.score)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-0.5">Clinical Interpretation</p>
          <p className="text-md leading-relaxed">{result.interpretation}</p>
        </div>
        {result.details && Object.keys(result.details).length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-1.5">
              <ListOrdered className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Details</p>
            </div>
            <ul className="list-none pl-1 text-sm space-y-1.5">
              {Object.entries(result.details).map(([key, value]) => (
                <li key={key} className="pt-1.5 pb-1">
                  <div className="font-semibold text-foreground/90">{key}:</div>
                  {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                    <div className="pl-4 mt-1 space-y-0.5">
                      {Object.entries(value as Record<string, string | number>).map(([subKey, subValue]) => (
                        <div key={subKey} className="flex text-sm">
                          <span className="font-medium text-muted-foreground w-48 shrink-0 pr-2">
                            {subKey.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-foreground break-words">{String(subValue)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 mt-0.5 text-foreground break-words">{String(value)}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <CardDescription className="text-xs pt-3">
          Note: This calculation is for informational purposes only and should not replace professional medical advice.
          All data is processed locally and not stored or transmitted.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
