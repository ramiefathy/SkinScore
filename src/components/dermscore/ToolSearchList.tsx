
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

    // Always group, even if search term is empty, to maintain consistent structure
    const baseToolsToGroup = searchTerm ? filtered : tools;
    
    return baseToolsToGroup.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);

  }, [tools, searchTerm]);

  const allFilteredToolsCount = useMemo(() => {
    // Make a shallow copy before using Object.values
    const plainGroupedTools = { ...groupedAndFilteredTools };
    return Object.values(plainGroupedTools).reduce((sum, group) => sum + group.length, 0);
  }, [groupedAndFilteredTools]);
  
  const activeAccordionItems = useMemo(() => {
    if (searchTerm) {
      // Make a shallow copy before using Object.keys
      const plainGroupedTools = { ...groupedAndFilteredTools };
      return Object.keys(plainGroupedTools).filter(condition => plainGroupedTools[condition]?.length > 0);
    }
    return []; 
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
            {/* Make a shallow copy before using Object.entries */}
            {Object.entries({ ...groupedAndFilteredTools }).map(([condition, conditionTools]) => {
              // Only hide empty groups if a search term is active
              if (searchTerm && conditionTools.length === 0) return null; 
              return (
                <AccordionItem value={condition} key={condition}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                    {/* Changed items-center to items-start for better multiline alignment */}
                    <div className="flex justify-between w-full items-start pr-1">
                      {/* Removed truncate, added flex-1 and min-w-0 to allow wrapping */}
                      <span className="flex-1 min-w-0 mr-2 text-left">{condition}</span>
                      {/* Added whitespace-nowrap to keep count on one line */}
                      <span className="text-xs text-muted-foreground ml-1 whitespace-nowrap">({conditionTools.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1.5 py-2">
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

