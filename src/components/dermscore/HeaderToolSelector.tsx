
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Tool } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderToolSelectorProps {
  tools: Tool[];
  onSelectTool: (toolId: string) => void;
  selectedToolId: string | null;
}

export function HeaderToolSelector({
  tools,
  onSelectTool,
  selectedToolId,
}: HeaderToolSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedToolName = useMemo(() => {
    return tools.find(tool => tool.id === selectedToolId)?.name || "Select a tool...";
  }, [tools, selectedToolId]);

  // Group tools by condition for display in Command Group
  const groupedTools = useMemo(() => {
    return tools.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [tools]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <span className="truncate">
            {selectedToolId ? selectedToolName : "Search and select a tool..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-md md:w-[400px] lg:w-[500px] p-0" align="start">
        <Command shouldFilter={false} // We handle filtering manually for grouping
        > 
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitiveInput
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder="Search tools by name, acronym, condition..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>No tool found.</CommandEmpty>
            {Object.entries(groupedTools).map(([condition, conditionTools]) => {
              const lowerSearchValue = searchValue.toLowerCase();
              const filteredTools = conditionTools.filter(tool =>
                tool.name.toLowerCase().includes(lowerSearchValue) ||
                (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchValue)) ||
                tool.condition.toLowerCase().includes(lowerSearchValue) ||
                tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchValue))
              );

              if (filteredTools.length === 0 && searchValue) return null; // Hide group if search term exists and no tools match in this group

              return (
                <CommandGroup key={condition} heading={filteredTools.length > 0 ? condition : undefined}>
                  {filteredTools.map((tool) => (
                    <CommandItem
                      key={tool.id}
                      value={tool.name} // CMDK uses this for its internal filtering if enabled, and for accessibility
                      onSelect={() => {
                        onSelectTool(tool.id);
                        setOpen(false);
                        setSearchValue(''); // Clear search on select
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">{tool.name}</span>
                        {tool.acronym && <span className="text-xs text-muted-foreground">{tool.acronym}</span>}
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedToolId === tool.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Minimal CommandPrimitiveInput for direct use, as CommandInput from ui/command has Search icon baked in
const CommandPrimitiveInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
CommandPrimitiveInput.displayName = "CommandPrimitiveInput";
