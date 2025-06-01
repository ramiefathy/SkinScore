
 "use client";

import React, { useMemo } from 'react';
import type { Tool } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ToolSearchListProps {
  tools: Tool[];
  onSelectTool: (toolId: string) => void;
  selectedToolId: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function ToolSearchList({
  tools,
  onSelectTool,
  selectedToolId,
  searchTerm,
  setSearchTerm,
}: ToolSearchListProps) {

  const groupedAndFilteredTools = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerSearchTerm) ||
      (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchTerm)) ||
      tool.condition.toLowerCase().includes(lowerSearchTerm) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm))
    );

    if (!searchTerm) { // If no search term, group all tools
        return tools.reduce((acc, tool) => {
        const condition = tool.condition || 'Other';
        if (!acc[condition]) {
            acc[condition] = [];
        }
        acc[condition].push(tool);
        return acc;
        }, {} as Record<string, Tool[]>);
    }
    
    // If search term exists, group the filtered tools
    return filtered.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);

  }, [tools, searchTerm]);

  const allFilteredToolsCount = Object.values(groupedAndFilteredTools).reduce((sum, group) => sum + group.length, 0);

  // Determine active accordion items: if searching, open all groups that have matching tools. Otherwise, open none by default.
  const activeAccordionItems = useMemo(() => {
    if (searchTerm) {
      return Object.keys(groupedAndFilteredTools).filter(condition => groupedAndFilteredTools[condition].length > 0);
    }
    return []; // Or you could return a default open group, e.g., the first one: Object.keys(groupedAndFilteredTools)[0] ? [Object.keys(groupedAndFilteredTools)[0]] : []
  }, [searchTerm, groupedAndFilteredTools]);


  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <ScrollArea className="flex-grow pr-2">
        {allFilteredToolsCount > 0 ? (
          <Accordion type="multiple" defaultValue={activeAccordionItems} className="w-full">
            {Object.entries(groupedAndFilteredTools).map(([condition, conditionTools]) => {
              if (conditionTools.length === 0 && searchTerm) return null; // Don't show empty groups when searching
              return (
                <AccordionItem value={condition} key={condition}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    {condition} ({conditionTools.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pt-1 pb-2">
                      {conditionTools.map(tool => (
                        <li key={tool.id}>
                          <Button
                            variant={selectedToolId === tool.id ? 'default' : 'outline'}
                            className={cn(
                              "w-full justify-start text-left h-auto py-2 px-3",
                              selectedToolId === tool.id && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => onSelectTool(tool.id)}
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                              {/* Removed condition display here as it's redundant with accordion group */}
                            </div>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground py-4">No tools found.</p>
        )}
      </ScrollArea>
    </div>
  );
}
