
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { toolData } from '@/lib/toolData';
import type { Tool, CalculationResult } from '@/lib/types';
import { ToolInfo } from '@/components/dermscore/ToolInfo';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { HeaderToolSelector } from '@/components/dermscore/HeaderToolSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Info, CheckSquare, Settings, LayoutGrid } from 'lucide-react';

export default function DermScorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedTool = useMemo(() => {
    return toolData.find(tool => tool.id === selectedToolId) || null;
  }, [selectedToolId]);

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setCalculationResult(null); 
    // Close popover if search selector is in a popover - handled internally by HeaderToolSelector
  };

  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic) {
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      if (isClient) {
        const resultsElement = document.getElementById('results-section');
        resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const currentYear = useMemo(() => isClient ? new Date().getFullYear().toString() : '', [isClient]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <LayoutGrid className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-headline text-primary">DermScore</h1>
                    <p className="text-xs text-muted-foreground">Clinical Scoring Tools</p>
                </div>
            </div>
            <div className="flex-grow max-w-md md:max-w-lg lg:max-w-xl">
                 <HeaderToolSelector
                    tools={toolData}
                    onSelectTool={handleToolSelect}
                    selectedToolId={selectedToolId}
                  />
            </div>
        </div>
      </header>

      <div className="container mx-auto p-6 md:p-8 flex-grow">
        <main className="w-full space-y-8">
          {!selectedTool && (
            <Card className="shadow-xl border">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Welcome to DermScore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Search and select a dermatological scoring tool from the top bar to get started.
                  All calculations are performed locally in your browser, ensuring data privacy.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedTool && (
            <Card className="shadow-xl border">
              <CardHeader>
                 <CardTitle className="text-2xl font-headline flex items-center gap-2"><FileText className="text-primary h-7 w-7"/>Tool Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ToolInfo tool={selectedTool} />
              </CardContent>
            </Card>
          )}

          {selectedTool && (
            <Card className="shadow-xl border">
              <CardHeader>
                 <CardTitle className="text-2xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
              </CardHeader>
              <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
            </Card>
          )}
          
          <div id="results-section" className="pt-4">
            {calculationResult && selectedTool && (
                <ResultsDisplay result={calculationResult} />
            )}
          </div>
        </main>
      </div>
      <footer className="text-center p-6 border-t mt-auto">
        <p className="text-sm text-muted-foreground">
          DermScore &copy; {currentYear}. For educational and informational purposes only. Consult a healthcare professional for medical advice.
        </p>
      </footer>
    </div>
  );
}
