 "use client";

import React, { useMemo } from 'react';
import type { Tool } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

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
  const filteredTools = useMemo(() => {
    if (!searchTerm) return tools;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerSearchTerm) ||
      (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchTerm)) ||
      tool.condition.toLowerCase().includes(lowerSearchTerm) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm))
    );
  }, [tools, searchTerm]);

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
        {filteredTools.length > 0 ? (
          <ul className="space-y-2">
            {filteredTools.map(tool => (
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
                    <span className="font-semibold">{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                    <span className="text-xs text-muted-foreground">{tool.condition}</span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">No tools found.</p>
        )}
      </ScrollArea>
    </div>
  );
}
