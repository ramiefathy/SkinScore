
"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toolData } from '@/lib/tools';
import type { Tool, CalculationResult, InputConfig } from '@/lib/types';
import { ToolForm } from '@/components/dermscore/ToolForm';
import { ResultsDisplay } from '@/components/dermscore/ResultsDisplay';
import { HeaderToolSelector } from '@/components/dermscore/HeaderToolSelector';
import { CategoryToolDropdown } from '@/components/dermscore/CategoryToolDropdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Info, CheckSquare, LayoutGrid, Zap, ScrollText, List, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdBanner } from '@/components/AdBanner';

const MAX_RECENT_TOOLS = 3;
const RECENT_TOOLS_STORAGE_KEY = 'skinscore_recently_used_tools';


const getSourceTypeBadgeProps = (sourceType: Tool['sourceType']): { variant?: "default" | "secondary" | "destructive" | "outline", className?: string } => {
  switch (sourceType) {
    case 'Research':
      return { variant: "default" };
    case 'Clinical Guideline':
      return { className: "bg-accent text-accent-foreground border-transparent hover:bg-accent/80" };
    case 'Expert Consensus':
      return { variant: "secondary" };
    default:
      return { variant: "outline" };
  }
};

function SkinScorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handleToolSelect = useCallback((toolId: string | null) => {
    if (toolId) {
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
            const currentPath = window.location.pathname;
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('toolId', toolId);
            router.replace(newUrl.toString(), { scroll: false });
            setTimeout(() => {
                const toolInfoElement = document.getElementById('tool-info-section');
                toolInfoElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else {
        setSelectedToolId(null);
        setCalculationResult(null);
        if (isClient) {
            const currentPath = window.location.pathname;
            router.replace(currentPath, { scroll: false });
        }
    }
  }, [isClient, router]);

  useEffect(() => {
    if (isClient) {
      const toolIdFromQuery = searchParams.get('toolId');
      if (toolIdFromQuery && toolIdFromQuery !== selectedToolId) {
        const toolExists = toolData.some(tool => tool.id === toolIdFromQuery);
        if (toolExists) {
          handleToolSelect(toolIdFromQuery);
        } else {
           const currentPath = window.location.pathname;
           router.replace(currentPath, { scroll: false });
        }
      }
    }
  }, [isClient, searchParams, selectedToolId, handleToolSelect, router]);


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

  const SelectedToolIcon = selectedTool?.icon;
  const badgeProps = selectedTool ? getSourceTypeBadgeProps(selectedTool.sourceType) : {};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-2 shrink-0">
                <LayoutGrid className="h-8 w-8 text-primary" />
                <div>
 <h1 className="text-3xl font-headline text-primary cursor-pointer" onClick={() => handleToolSelect(null)}>SkinScores</h1>
                    <p className="text-xs text-muted-foreground">Clinical Scoring Tools</p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end min-w-[280px] sm:min-w-0">
                <Button variant="outline" asChild className="shrink-0">
                  <Link href="/tools">
                    <List className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Browse All Tools</span>
                  </Link>
                </Button>
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
            <Card className="shadow-xl border">
              <CardHeader>
 <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Welcome to SkinScores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-base leading-relaxed">
                  Use the selectors in the header to choose a specific tool for calculation, or visit the "Browse All Tools" page to explore and learn about all available instruments.
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
                          className="w-full justify-start h-auto py-3 px-4 text-left"
                          onClick={() => handleToolSelect(tool.id)}
                        >
                          <ToolIcon className="h-5 w-5 mr-3 shrink-0 text-primary/80" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground whitespace-normal break-words">{tool.name}</div>
                            <div className="text-xs text-muted-foreground whitespace-normal break-words">{tool.condition}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {selectedTool && selectedTool.displayType !== 'staticList' && (
            <Card className="shadow-xl border">
              <CardHeader>
                 <CardTitle className="text-2xl font-headline flex items-center gap-2"><CheckSquare className="text-primary h-7 w-7"/>Scoring Inputs</CardTitle>
              </CardHeader>
              <ToolForm tool={selectedTool} onCalculate={handleCalculate} />
            </Card>
          )}
          
          {selectedTool && selectedTool.displayType === 'staticList' && (
             <Card className="shadow-xl border">
              <CardHeader>
                 <CardTitle className="text-2xl font-headline flex items-center gap-2"><List className="text-primary h-7 w-7"/>Classification Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                    {selectedTool.formSections.flatMap((section) =>
                        'inputs' in section
                        ? (section.inputs as InputConfig[]).flatMap(input =>
                            input.options
                            ? input.options.map((option, optionIndex) => (
                                <div key={`${input.id}-${option.value}-${optionIndex}`} className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm">
                                  {option.label}
                                </div>
                            ))
                            : []
                        )
                        : (section as InputConfig).options
                          ? (section as InputConfig).options!.map((option, optionIndex) => (
                            <div key={`${section.id}-${option.value}-${optionIndex}`} className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm">
                              {option.label}
                            </div>
                          ))
                          : []
                    )}
                 </div>
              </CardContent>
            </Card>
          )}


          <div id="results-section" className="pt-4">
            {calculationResult && selectedTool && selectedTool.displayType !== 'staticList' && (
                <ResultsDisplay result={calculationResult} tool={selectedTool} />
            )}
          </div>
          
          {selectedTool && (
            <Card className="shadow-xl border mt-8">
               <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><Info className="text-primary h-7 w-7"/>Details & References</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    <p className="text-base leading-relaxed">
                      <span className="font-semibold text-foreground/90">Condition:</span> {selectedTool.condition}
                    </p>
                    <Badge variant={badgeProps.variant} className={`self-start ${badgeProps.className || ''}`}>
                        {selectedTool.sourceType}
                    </Badge>
                     <ScrollArea className="h-auto max-h-[150px] pr-3 border rounded-md p-3 bg-muted/20">
                         <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.description}</p>
                     </ScrollArea>
                    {(selectedTool.rationale || selectedTool.clinicalPerformance) && (
                        <Accordion type="multiple" className="w-full">
                          {selectedTool.rationale && (
                            <AccordionItem value="rationale">
                              <AccordionTrigger>Rationale</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.rationale}</p>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                          {selectedTool.clinicalPerformance && (
                            <AccordionItem value="performance">
                              <AccordionTrigger>Clinical Performance & Reliability</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedTool.clinicalPerformance}</p>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                    )}
              
                    {selectedTool.keywords && selectedTool.keywords.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-semibold text-foreground/90">Keywords: </span>
                        {selectedTool.keywords.map(keyword => (
                          <Badge key={keyword} variant="outline" className="mr-1.5 mb-1.5 text-xs py-1 px-2.5">{keyword}</Badge>
                        ))}
                      </div>
                    )}
              
                    {selectedTool.references && selectedTool.references.length > 0 && (
                      <>
                        <Separator className="my-4"/>
                        <div className="space-y-1.5">
                          <h4 className="text-md font-semibold text-foreground/90">References:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-1">
                            {selectedTool.references.map((ref, index) => (
                              <li key={index}>
                                {ref.startsWith('http') ? 
                                  <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1.5 break-all">
                                    {ref.length > 80 ? ref.substring(0,77) + '...' : ref} <LinkIcon size={14}/>
                                  </a> 
                                  : <span className="break-all">{ref.length > 100 ? ref.substring(0,97) + '...' : ref}</span>
                                }
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                 </div>
              </CardContent>
            </Card>
          )}

        </main>
        <AdBanner />
      </div>
      <footer className="text-center p-6 border-t mt-auto">
        <p className="text-sm text-muted-foreground">
          SkinScores &copy; {currentYear}. For educational and informational purposes only. Consult a healthcare professional for medical advice.
 </p>
      </footer>
    </div>
  );
}

export default function SkinScorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkinScorePageContent />
    </Suspense>
  );
}
