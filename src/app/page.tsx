"use client";

import React, { useState, useMemo } from 'react';
import { toolData } from '@/lib/toolData';
import type { Tool, CalculationResult } from '@/lib/types';
import { ToolSearchList } from '@/components/dermscore/ToolSearchList';
import { ToolInfo } from '@/components/dermscore/ToolInfo';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Info, CheckSquare } from 'lucide-react';

export default function DermScorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const selectedTool = useMemo(() => {
    return toolData.find(tool => tool.id === selectedToolId) || null;
  }, [selectedToolId]);

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setCalculationResult(null); 
  };

  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic) {
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      // Scroll to results if needed, e.g. on mobile
      const resultsElement = document.getElementById('results-section');
      resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b p-4 shadow-sm">
        <h1 className="text-3xl font-headline text-primary text-center md:text-left">DermScore</h1>
        <p className="text-sm text-muted-foreground text-center md:text-left">Clinical Scoring Tools for Dermatology</p>
      </header>

      <div className="flex flex-col md:flex-row p-4 gap-6">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <Card className="sticky top-4 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Available Tools</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4">
               <ToolSearchList
                tools={toolData}
                onSelectTool={handleToolSelect}
                selectedToolId={selectedToolId}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 space-y-6">
          {!selectedTool && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2"><Info className="text-primary"/>Welcome to DermScore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Select a dermatological scoring tool from the list on the left to get started. 
                  You can search for tools by name, acronym, condition, or keywords. 
                  All calculations are performed locally in your browser, ensuring data privacy.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedTool && (
            <Card className="shadow-lg">
              <CardHeader>
                 <CardTitle className="text-xl font-headline flex items-center gap-2"><FileText className="text-primary"/>Tool Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ToolInfo tool={selectedTool} />
              </CardContent>
            </Card>
          )}

          {selectedTool && (
            <Card className="shadow-lg">
              <CardHeader>
                 <CardTitle className="text-xl font-headline flex items-center gap-2"><CheckSquare className="text-primary"/>Scoring Inputs</CardTitle>
              </CardHeader>
              {/* Content is inside ToolForm component */}
              <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
            </Card>
          )}
          
          <div id="results-section">
            {calculationResult && selectedTool && (
                <ResultsDisplay result={calculationResult} />
            )}
          </div>
        </main>
      </div>
      <footer className="text-center p-4 border-t mt-auto">
        <p className="text-xs text-muted-foreground">
          DermScore &copy; {new Date().getFullYear()}. For educational and informational purposes only. Consult a healthcare professional for medical advice.
        </p>
      </footer>
    </div>
  );
}
