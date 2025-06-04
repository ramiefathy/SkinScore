

"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toolData } from '@/lib/tools'; // Updated import path
import type { Tool, CalculationResult } from '@/lib/types';
import { ToolInfo } from '@/components/dermscore/ToolInfo';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { HeaderToolSelector } from '@/components/dermscore/HeaderToolSelector';
import { CategoryToolDropdown } from '@/components/dermscore/CategoryToolDropdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Info, CheckSquare, LayoutGrid, Zap, Link as LinkIcon, ScrollText, FileQuestion, Stethoscope } from 'lucide-react';

const MAX_RECENT_TOOLS = 3;
const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';

export default function SkinScorePage() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [recentlyUsedTools, setRecentlyUsedTools] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedRecent = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
      if (storedRecent) {
        setRecentlyUsedTools(JSON.parse(storedRecent));
      }
    }
  }, []);

  const selectedTool = useMemo(() => {
    return toolData.find(tool => tool.id === selectedToolId) || null;
  }, [selectedToolId]);

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedToolId(toolId);
    setCalculationResult(null);

    if (typeof window !== 'undefined') {
      setRecentlyUsedTools(prevRecent => {
        const updatedRecent = [toolId, ...prevRecent.filter(id => id !== toolId)].slice(0, MAX_RECENT_TOOLS);
        localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(updatedRecent));
        return updatedRecent;
      });
    }

    if (isClient) {
        setTimeout(() => {
            const toolInfoElement = document.getElementById('tool-info-section');
            toolInfoElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [isClient]);

  const handleCalculate = (inputs: Record<string, any>) => {
    if (selectedTool && selectedTool.calculationLogic && selectedTool.displayType !== 'staticList') {
      const result = selectedTool.calculationLogic(inputs);
      setCalculationResult(result);
      if (isClient) {
        const resultsElement = document.getElementById('results-section');
        resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const currentYear = useMemo(() => isClient ? new Date().getFullYear().toString() : '', [isClient]);

  const popularTools: Tool[] = useMemo(() => {
    const popularIds = ['pasi', 'dlqi', 'abcde_melanoma'];
    return toolData.filter(tool => popularIds.includes(tool.id));
  }, []);

  const groupedToolsForList = useMemo(() => {
    return toolData.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, []);

  const sortedCategoriesForList = useMemo(() => {
    return Object.entries(groupedToolsForList).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groupedToolsForList]);


  const SelectedToolIcon = selectedTool?.icon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-2 shrink-0">
                <LayoutGrid className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-headline text-primary">SkinScore</h1>
                    <p className="text-xs text-muted-foreground">Clinical Scoring Tools</p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end min-w-[280px] sm:min-w-0">
                <CategoryToolDropdown tools={toolData} onSelectTool={handleToolSelect} />
                <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                 <HeaderToolSelector
                    tools={toolData}
                    onSelectTool={handleToolSelect}
                    selectedToolId={selectedToolId}
                    recentlyUsedToolIds={recentlyUsedTools}
                  />
                </div>
            </div>
        </div>
      </header>

      <div className="container mx-auto p-6 md:p-8 flex-grow">
        <main className="w-full space-y-8">
          {!selectedTool && (
            <>
            <Card className="shadow-xl border">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Welcome to SkinScore</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-base leading-relaxed">
                  Browse categories or search for a dermatological scoring tool from the top bar to get started.
                  All calculations are performed locally in your browser, ensuring data privacy.
                </p>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground/90">Popular Tools</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {popularTools.map(tool => {
                      const ToolIcon = tool.icon || Zap;
                      return (
                        <Button
                          key={tool.id}
                          variant="outline"
                          className="justify-start h-auto py-3 px-4 text-left"
                          onClick={() => handleToolSelect(tool.id)}
                        >
                          <ToolIcon className="h-5 w-5 mr-3 shrink-0 text-primary/80" />
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="font-medium text-foreground">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.condition}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <ScrollText className="text-primary h-7 w-7"/>All Available Scoring Tools
                    </CardTitle>
                    <CardDescription>
                        Expand a category and a tool to learn more or select it for use.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {sortedCategoriesForList.map(([condition, conditionTools]) => (
                        <div key={condition}>
                            <h3 className="text-xl font-semibold mb-3 text-foreground/90 border-b pb-2">{condition}</h3>
                            <Accordion type="multiple" className="w-full space-y-2">
                                {conditionTools.sort((a,b) => a.name.localeCompare(b.name)).map(tool => {
                                    const ToolIcon = tool.icon || FileQuestion;
                                    return (
                                        <AccordionItem value={tool.id} key={tool.id} className="border bg-card/30 hover:bg-card/60 rounded-md px-3 shadow-sm">
                                            <AccordionTrigger className="py-3 text-left hover:no-underline">
                                                <div className="flex items-center gap-3">
                                                    <ToolIcon className="h-5 w-5 text-primary/90 shrink-0"/>
                                                    <span>{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2 pb-3 space-y-3 text-sm">
                                                <div>
                                                    <h4 className="font-semibold text-foreground/80 mb-1">Purpose:</h4>
                                                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.description}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground/80 mb-1">Rationale:</h4>
                                                    <p className="text-muted-foreground text-xs italic">The specific rationale for the development and use of the {tool.name} will be detailed here, including the clinical need it addresses and its underlying principles. [Information to be updated]</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground/80 mb-1">Clinical Performance & Reliability:</h4>
                                                    <p className="text-muted-foreground text-xs italic">Information regarding the {tool.name}'s clinical performance, such as sensitivity, specificity, inter-rater reliability, intra-rater reliability, and validation studies, will be provided here when available. [Information to be updated]</p>
                                                </div>
                                                {tool.references && tool.references.length > 0 && (
                                                  <div>
                                                    <h4 className="font-semibold text-foreground/80 mb-1">Key References:</h4>
                                                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                                                      {tool.references.slice(0, 2).map((ref, index) => (
                                                        <li key={index}>
                                                          {ref.startsWith('http') ?
                                                            <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary/90 hover:underline inline-flex items-center gap-1 break-all">
                                                              {ref.length > 100 ? ref.substring(0,97) + '...' : ref} <LinkIcon size={12}/>
                                                            </a>
                                                            : <span className="break-all">{ref.length > 100 ? ref.substring(0,97) + '...' : ref}</span>
                                                          }
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handleToolSelect(tool.id)} className="mt-2 text-primary hover:text-primary/90 hover:bg-primary/10">
                                                    <Stethoscope className="mr-2 h-4 w-4"/>Use this Tool
                                                </Button>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </div>
                    ))}
                </CardContent>
            </Card>
            </>
          )}

          {selectedTool && (
             <div id="tool-info-section" className="space-y-1 mb-6 pt-2">
              <div className="flex items-center gap-3">
                {SelectedToolIcon && <SelectedToolIcon className="h-10 w-10 text-primary" />}
                <h2 className="text-4xl font-headline text-foreground">{selectedTool.name}</h2>
              </div>
              {selectedTool.acronym && <p className="text-lg text-muted-foreground ml-12 -mt-2">{selectedTool.acronym}</p>}
            </div>
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

          {selectedTool && selectedTool.displayType !== 'staticList' && (
            <Card className="shadow-xl border">
              <CardHeader>
                 <CardTitle className="text-2xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
              </CardHeader>
              <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
            </Card>
          )}

          <div id="results-section" className="pt-4">
            {calculationResult && selectedTool && selectedTool.displayType !== 'staticList' && (
                <ResultsDisplay result={calculationResult} tool={selectedTool} />
            )}
          </div>
        </main>
      </div>
      <footer className="text-center p-6 border-t mt-auto">
        <p className="text-sm text-muted-foreground">
          SkinScore &copy; {currentYear}. For educational and informational purposes only. Consult a healthcare professional for medical advice.
        </p>
      </footer>
    </div>
  );
}

