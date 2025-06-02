
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Tool } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput, 
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Kbd } from '@/components/ui/kbd';
import { Check, Search as SearchIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderToolSelectorProps {
  tools: Tool[];
  onSelectTool: (toolId: string) => void;
  selectedToolId: string | null;
  recentlyUsedToolIds: string[];
}

export function HeaderToolSelector({
  tools,
  onSelectTool,
  selectedToolId,
  recentlyUsedToolIds,
}: HeaderToolSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedToolName = useMemo(() => {
    return tools.find(tool => tool.id === selectedToolId)?.name || "Select a tool...";
  }, [tools, selectedToolId]);

  const groupedTools = useMemo(() => {
    if (searchValue) return {}; 
    return tools.reduce((acc, tool) => {
      const condition = tool.condition || 'Other';
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [tools, searchValue]);

  const filteredTools = useMemo(() => {
    if (!searchValue) return []; 
    const lowerSearchValue = searchValue.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerSearchValue) ||
      (tool.acronym && tool.acronym.toLowerCase().includes(lowerSearchValue)) ||
      tool.condition.toLowerCase().includes(lowerSearchValue) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchValue)))
    );
  }, [tools, searchValue]);

  const recentToolsFull = useMemo(() => {
    return recentlyUsedToolIds
      .map(id => tools.find(tool => tool.id === id))
      .filter(Boolean) as Tool[];
  }, [recentlyUsedToolIds, tools]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      } else if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []); // Removed setOpen from dependency array as it's a stable setState function

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchValue(''); 
    }
  }, [open]);

  const handleSelect = useCallback((toolId: string) => {
    onSelectTool(toolId);
    setOpen(false);
    setSearchValue('');
  }, [onSelectTool]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground hover:text-foreground group"
        >
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50 group-hover:text-foreground" />
          <span className="truncate flex-1 text-left">
            {selectedToolId ? selectedToolName : "Search tools..."}
          </span>
          <div className="flex items-center ml-auto">
            <Kbd className="hidden md:inline-flex">⌘K</Kbd>
            <span className="text-muted-foreground mx-1 hidden md:inline-flex">or</span>
            <Kbd className="hidden md:inline-flex">/</Kbd>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-md md:w-[450px] lg:w-[550px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitiveInput
              ref={inputRef}
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder="Search tools by name, acronym, condition..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>{searchValue ? "No tool found." : "Type to search..."}</CommandEmpty>
            
            {!searchValue && recentToolsFull.length > 0 && (
              <CommandGroup heading={
                <div className="flex items-center text-xs font-medium text-muted-foreground px-2 py-1.5">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  Recently Used
                </div>
              }>
                {recentToolsFull.map((tool) => (
                  <CommandItem
                    key={`recent-${tool.id}`}
                    value={`${tool.name} ${tool.acronym || ''} ${tool.condition}`}
                    onSelect={() => handleSelect(tool.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="text-sm">{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                      <span className="text-xs text-muted-foreground truncate">{tool.condition}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        selectedToolId === tool.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!searchValue && recentToolsFull.length > 0 && <CommandSeparator />}

            {searchValue && filteredTools.map((tool) => (
              <CommandItem
                key={tool.id}
                value={`${tool.name} ${tool.acronym || ''} ${tool.condition}`}
                onSelect={() => handleSelect(tool.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="text-sm">{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                  <span className="text-xs text-muted-foreground truncate">{tool.condition}</span>
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0",
                    selectedToolId === tool.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}

            {!searchValue && Object.entries(groupedTools).map(([condition, conditionTools]) => (
              <CommandGroup 
                key={condition} 
                heading={
                    <div className="text-xs font-semibold text-foreground/80 px-2 py-1.5 border-b border-border/50 my-1 first:mt-0">
                        {condition}
                    </div>
                }
              >
                {conditionTools.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    value={`${tool.name} ${tool.acronym || ''} ${tool.condition}`}
                    onSelect={() => handleSelect(tool.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="text-sm">{tool.name} {tool.acronym && `(${tool.acronym})`}</span>
                      <span className="text-xs text-muted-foreground truncate">{tool.condition}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        selectedToolId === tool.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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

