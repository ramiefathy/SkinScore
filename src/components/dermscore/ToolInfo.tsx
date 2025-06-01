
import React from 'react';
import type { Tool } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link } from 'lucide-react';

interface ToolInfoProps {
  tool: Tool;
}

const getSourceTypeBadgeProps = (sourceType: Tool['sourceType']): { variant?: "default" | "secondary" | "destructive" | "outline", className?: string } => {
  switch (sourceType) {
    case 'Research':
      return { variant: "default" }; // Uses primary color
    case 'Clinical Guideline':
      return { className: "bg-accent text-accent-foreground border-transparent hover:bg-accent/80" }; // Uses accent color
    case 'Expert Consensus':
      return { variant: "secondary" };
    default:
      return { variant: "outline" }; // Fallback
  }
};

export function ToolInfo({ tool }: ToolInfoProps) {
  const IconComponent = tool.icon;
  const badgeProps = getSourceTypeBadgeProps(tool.sourceType);

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 mb-2">
        <div className="flex items-center gap-3 mb-2">
          {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
          <CardTitle className="text-2xl font-headline">{tool.name} {tool.acronym && `(${tool.acronym})`}</CardTitle>
        </div>
        <Badge variant={badgeProps.variant} className={badgeProps.className}>
          {tool.sourceType}
        </Badge>
      </CardHeader>
      
      <CardDescription className="text-base leading-relaxed">
        <span className="font-semibold">Condition:</span> {tool.condition}
      </CardDescription>
      
      <ScrollArea className="h-auto max-h-[120px] pr-3">
         <p className="text-sm text-muted-foreground">{tool.description}</p>
      </ScrollArea>

      {tool.keywords && tool.keywords.length > 0 && (
        <div className="mt-2">
          <span className="text-sm font-semibold">Keywords: </span>
          {tool.keywords.map(keyword => (
            <Badge key={keyword} variant="outline" className="mr-1 mb-1 text-xs">{keyword}</Badge>
          ))}
        </div>
      )}

      {tool.references && tool.references.length > 0 && (
        <>
          <Separator className="my-3"/>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">References:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              {tool.references.map((ref, index) => (
                <li key={index}>
                  {/* Basic URL detection, could be improved */}
                  {ref.startsWith('http') ? 
                    <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      {ref} <Link size={12}/>
                    </a> 
                    : ref
                  }
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
