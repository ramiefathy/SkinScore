
import React from 'react';
import type { CalculationResult, Tool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ListOrdered, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResultsDisplayProps {
  result: CalculationResult;
  tool: Tool; // Added tool prop
}

const formatDetailsForCopy = (details: Record<string, any>, indentLevel = 0): string => {
  let detailsString = '';
  const indent = '  '.repeat(indentLevel);
  for (const [key, value] of Object.entries(details)) {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (value === null || value === undefined) {
        detailsString += `${indent}${formattedKey}: N/A\n`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      detailsString += `${indent}${formattedKey}:\n`;
      detailsString += formatDetailsForCopy(value as Record<string, any>, indentLevel + 1);
    } else {
      detailsString += `${indent}${formattedKey}: ${String(value)}\n`;
    }
  }
  return detailsString;
};


export function ResultsDisplay({ result, tool }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    const dateTime = new Date().toLocaleString();
    let reportString = `SkinScore Report\n`;
    reportString += `Tool: ${tool.name}${tool.acronym ? ` (${tool.acronym})` : ''}\n`;
    reportString += `Date & Time: ${dateTime}\n`;
    reportString += `--------------------------------------------------\n`;
    reportString += `SCORE: ${String(result.score)}\n`;
    reportString += `INTERPRETATION: ${result.interpretation}\n`;

    if (result.details && Object.keys(result.details).length > 0) {
      reportString += `--------------------------------------------------\n`;
      reportString += `DETAILS:\n`;
      reportString += formatDetailsForCopy(result.details);
    }

    reportString += `--------------------------------------------------\n`;
    reportString += `Calculated with SkinScore\n`;

    try {
      await navigator.clipboard.writeText(reportString);
      toast({
        title: "Results Copied",
        description: "The formatted results have been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy results: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy results to the clipboard. Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-accent/10 border-accent shadow-xl">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-7 w-7 text-accent-foreground" />
          <CardTitle className="text-2xl font-headline text-accent-foreground">Calculation Results</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="shrink-0">
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copy Results
        </Button>
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
                  <div className="font-semibold text-foreground/90">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</div>
                  {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                    <div className="pl-4 mt-1 space-y-0.5"> {/* Level 1 indent */}
                      {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                        <div key={subKey} className="pt-0.5">
                          <div className="font-medium text-muted-foreground">
                            {subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                          </div>
                          {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue) ? (
                            <div className="pl-4 space-y-0.5"> {/* Level 2 indent */}
                              {Object.entries(subValue as Record<string, string | number | undefined | null>).map(([subSubKey, subSubValue]) => (
                                (subSubValue !== undefined && subSubValue !== null && String(subSubValue).trim() !== '') || typeof subSubValue === 'number' ? ( // Render if not empty, or is a number (e.g. 0)
                                  <div key={subSubKey} className="flex text-xs">
                                    <span className="font-normal text-muted-foreground/80 w-auto max-w-[180px] shrink-0 pr-1.5">
                                      {subSubKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                    </span>
                                    <span className="text-foreground/90 break-words">{String(subSubValue)}</span>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          ) : (
                            <div className="pl-4 text-foreground/90 break-words">{String(subValue)}</div>
                          )}
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
