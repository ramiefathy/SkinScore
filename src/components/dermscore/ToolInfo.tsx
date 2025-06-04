
import React from 'react';
import type { Tool } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link as LinkIcon } from 'lucide-react';

interface ToolInfoProps {
  tool: Tool;
}

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

export function ToolInfo({ tool }: ToolInfoProps) {
  const badgeProps = getSourceTypeBadgeProps(tool.sourceType);

  return (
    <div className="space-y-4">
      <Badge variant={badgeProps.variant} className={`self-start ${badgeProps.className || ''}`}>
        {tool.sourceType}
      </Badge>
      
      <p className="text-base leading-relaxed">
        <span className="font-semibold text-foreground/90">Condition:</span> {tool.condition}
      </p>
      
      <ScrollArea className="h-auto max-h-[150px] pr-3 border rounded-md p-3 bg-muted/20">
         <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
      </ScrollArea>

      {tool.displayType === 'staticList' && tool.formSections && tool.formSections.length > 0 && (
        <>
          <Separator className="my-3" />
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-foreground/90">Assessment Levels:</h4>
            <ul className="list-none space-y-2">
              {tool.formSections.flatMap((section, sectionIndex) => {
                if (!('inputs' in section) && section.options) { 
                  return section.options.map((option, optionIndex) => (
                    <li 
                      key={`${tool.id}-s${sectionIndex}-opt${optionIndex}`} 
                      className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm"
                    >
                      {option.label}
                    </li>
                  ));
                }
                if ('inputs' in section && section.inputs) {
                  return section.inputs.flatMap((inputConfig, inputIndex) => 
                    inputConfig.options ? inputConfig.options.map((option, optionIndex) => (
                      <li 
                        key={`${tool.id}-s${sectionIndex}-i${inputIndex}-opt${optionIndex}`}
                        className="text-sm text-foreground bg-card p-3 rounded-md border shadow-sm"
                      >
                        {option.label}
                      </li>
                    )) : []
                  );
                }
                return [];
              })}
            </ul>
          </div>
        </>
      )}

      {tool.keywords && tool.keywords.length > 0 && (
        <div className="mt-3">
          <span className="text-sm font-semibold text-foreground/90">Keywords: </span>
          {tool.keywords.map(keyword => (
            <Badge key={keyword} variant="outline" className="mr-1.5 mb-1.5 text-xs py-1 px-2.5">{keyword}</Badge>
          ))}
        </div>
      )}

      {tool.references && tool.references.length > 0 && (
        <>
          <Separator className="my-4"/>
          <div className="space-y-1.5">
            <h4 className="text-md font-semibold text-foreground/90">References:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-1">
              {tool.references.map((ref, index) => (
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
  );
}

