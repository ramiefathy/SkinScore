
import React, { useMemo } from 'react';
import type { CalculationResult, Tool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ListOrdered, ClipboardCopy, BarChart as BarChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";


const formatValueForDisplay = (value: any): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // For objects, we might want a specific summary or indicate it's complex
    // For now, let's just show [Object] to avoid overly long strings in simple display
    // The recursive display logic will handle showing its contents.
    return "[Object]";
  }
  return String(value);
};

const formatDetailsForCopyText = (details: Record<string, any>, indentLevel = 0): string => {
  let detailsString = '';
  const indent = '  '.repeat(indentLevel);
  for (const [key, value] of Object.entries(details)) {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (value === null || value === undefined) {
        detailsString += `${indent}${formattedKey}: N/A\n`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      detailsString += `${indent}${formattedKey}:\n`;
      detailsString += formatDetailsForCopyText(value as Record<string, any>, indentLevel + 1);
    } else {
      detailsString += `${indent}${formattedKey}: ${String(value)}\n`;
    }
  }
  return detailsString;
};

const formatDetailsForHtmlTable = (details: Record<string, any>, isNested: boolean = false): string => {
  if (!details || Object.keys(details).length === 0) return '';

  let htmlString = isNested ? '<table style="width: 100%; border-collapse: collapse; margin-left: 15px;"><tbody>' : '';

  for (const [key, value] of Object.entries(details)) {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    htmlString += `<tr style="border: 1px solid #ddd;">`;
    htmlString += `<td style="padding: 8px; border: 1px solid #ddd; vertical-align: top; font-weight: bold;">${formattedKey}</td>`;
    if (value === null || value === undefined) {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">N/A</td>`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">${formatDetailsForHtmlTable(value as Record<string, any>, true)}</td>`;
    } else {
      htmlString += `<td style="padding: 8px; border: 1px solid #ddd;">${String(value)}</td>`;
    }
    htmlString += `</tr>`;
  }
  htmlString += isNested ? '</tbody></table>' : '';
  return htmlString;
};


interface ResultsDisplayProps {
  result: CalculationResult;
  tool: Tool;
}

export function ResultsDisplay({ result, tool }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    const dateTime = new Date().toLocaleString();

    // Plain Text Version
    let reportStringText = `SkinScore Report\n`;
    reportStringText += `Tool: ${tool.name}${tool.acronym ? ` (${tool.acronym})` : ''}\n`;
    reportStringText += `Date & Time: ${dateTime}\n`;
    reportStringText += `--------------------------------------------------\n`;
    reportStringText += `SCORE: ${String(result.score)}\n`;
    reportStringText += `INTERPRETATION: ${result.interpretation}\n`;

    if (result.details && Object.keys(result.details).length > 0) {
      reportStringText += `--------------------------------------------------\n`;
      reportStringText += `DETAILS:\n`;
      reportStringText += formatDetailsForCopyText(result.details);
    }
    reportStringText += `--------------------------------------------------\n`;
    reportStringText += `Calculated with SkinScore\n`;

    // HTML Version
    let reportStringHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ccc; padding: 15px; max-width: 800px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">SkinScore Report</h2>
        <p><strong>Tool:</strong> ${tool.name}${tool.acronym ? ` (${tool.acronym})` : ''}</p>
        <p><strong>Date & Time:</strong> ${dateTime}</p>
        <hr style="margin: 15px 0;" />
        <p><strong>SCORE:</strong> <span style="font-size: 1.5em; font-weight: bold;">${String(result.score)}</span></p>
        <p><strong>INTERPRETATION:</strong></p>
        <p style="background-color: #f9f9f9; border: 1px solid #eee; padding: 10px; border-radius: 4px;">${result.interpretation}</p>
    `;

    if (result.details && Object.keys(result.details).length > 0) {
      reportStringHtml += `
        <hr style="margin: 15px 0;" />
        <h3 style="color: #555;">DETAILS:</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; margin-top: 10px;">
          <tbody>
            ${formatDetailsForHtmlTable(result.details)}
          </tbody>
        </table>
      `;
    }
    reportStringHtml += `
        <hr style="margin: 15px 0;" />
        <p style="font-size: 0.9em; color: #777;">Calculated with SkinScore</p>
      </div>
    `;

    try {
      const plainBlob = new Blob([reportStringText], { type: 'text/plain' });
      const htmlBlob = new Blob([reportStringHtml], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/plain': plainBlob,
        'text/html': htmlBlob,
      });
      await navigator.clipboard.write([clipboardItem]);
      toast({
        title: "Results Copied",
        description: "Formatted results (HTML and plain text) have been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy results: ', err);
      // Fallback to text only if ClipboardItem fails (e.g. older browser or security restriction)
      try {
        await navigator.clipboard.writeText(reportStringText);
        toast({
          title: "Results Copied (Text Only)",
          description: "Plain text results copied. Rich format copy failed.",
        });
      } catch (textErr) {
        console.error('Failed to copy plain text results: ', textErr);
        toast({
          title: "Copy Failed",
          description: "Could not copy results to the clipboard. Please try again or copy manually.",
          variant: "destructive",
        });
      }
    }
  };

  const chartData = useMemo(() => {
    if (tool.id !== 'pasi' || !result.details) {
      return null;
    }
    return Object.entries(result.details)
      .filter(([, value]) => typeof value === 'object' && value !== null && 'Regional_PASI_Score' in value)
      .map(([name, data]) => ({
        name: name,
        score: (data as any).Regional_PASI_Score,
      }));
  }, [tool.id, result.details]);

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

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

        {chartData && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-1.5">
              <BarChartIcon className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Regional Score Contribution</p>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

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
                              {Object.entries(subValue as Record<string, string | number | undefined | null | Record<string, any>>).map(([subSubKey, subSubValue]) => (
                                (subSubValue !== undefined && subSubValue !== null && String(subSubValue).trim() !== '') || typeof subSubValue === 'number' ? (
                                  <div key={subSubKey} className="flex text-xs">
                                    <span className="font-normal text-muted-foreground/80 w-auto max-w-[180px] shrink-0 pr-1.5">
                                      {subSubKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                    </span>
                                     {typeof subSubValue === 'object' && subSubValue !== null && !Array.isArray(subSubValue) ?
                                        Object.entries(subSubValue as Record<string, any>).map(([deepKey, deepValue]) => (
                                            <div key={deepKey} className="pl-4 text-xs">
                                                <span className="font-normal text-muted-foreground/80 w-auto max-w-[180px] shrink-0 pr-1.5">
                                                    {deepKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                </span>
                                                <span className="text-foreground/90 break-words">{formatValueForDisplay(deepValue)}</span>
                                            </div>
                                        )).reduce((acc, curr, idx, arr) => acc.concat(curr, idx < arr.length -1 ? <br /> : []), [] as (JSX.Element | null)[])
                                        :
                                        <span className="text-foreground/90 break-words">{formatValueForDisplay(subSubValue)}</span>
                                    }
                                  </div>
                                ) : null
                              ))}
                            </div>
                          ) : (
                            <div className="pl-4 text-foreground/90 break-words">{formatValueForDisplay(subValue)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 mt-0.5 text-foreground break-words">{formatValueForDisplay(value)}</div>
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
