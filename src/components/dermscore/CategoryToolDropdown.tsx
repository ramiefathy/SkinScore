
"use client";

import React, { useMemo } from 'react';
import type { Tool } from '@/lib/types';
import { toolData as allTools } from '@/lib/tools'; // Ensure this path is correct after refactor
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, LayoutList, FolderKanban } from 'lucide-react';

interface CategoryToolDropdownProps {
  tools: Tool[]; // This prop might become redundant if we always use allTools
  onSelectTool: (toolId: string) => void;
}

export function CategoryToolDropdown({ tools, onSelectTool }: CategoryToolDropdownProps) {
  const groupedTools = useMemo(() => {
    return allTools.reduce((acc, tool) => { // Using allTools directly
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, []); // Removed 'tools' from dependency array as we use 'allTools'

  const sortedCategories = useMemo(() => {
    return Object.entries(groupedTools).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groupedTools]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shrink-0">
          <LayoutList className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Browse Categories</span>
          <ChevronDown className="ml-1 md:ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-[calc(100vh-10rem)] overflow-y-auto">
        <DropdownMenuLabel>Tool Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortedCategories.map(([condition, conditionTools]) => (
          <DropdownMenuSub key={condition}>
            <DropdownMenuSubTrigger>
              <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{condition}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
              {conditionTools
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <DropdownMenuItem key={tool.id} onSelect={() => onSelectTool(tool.id)}>
                      {ToolIcon && <ToolIcon className="mr-2 h-4 w-4 shrink-0 opacity-80" />}
                      <span>{tool.name}</span>
                    </DropdownMenuItem>
                  );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
