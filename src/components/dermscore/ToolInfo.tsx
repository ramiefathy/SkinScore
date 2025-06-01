
import React from 'react';
import type { Tool } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CardDescription } from '@/components/ui/card'; // Removed CardHeader, CardTitle as they are handled by parent
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link } from 'lucide-react';

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
  const IconComponent = tool.icon;
  const badgeProps = getSourceTypeBadgeProps(tool.sourceType);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="h-9 w-9 text-primary" />}
          <h2 className="text-3xl font-headline text-foreground">{tool.name} {tool.acronym && `(${tool.acronym})`}</h2>
        </div>
        <Badge variant={badgeProps.variant} className={`self-start ${badgeProps.className || ''}`}>
          {tool.sourceType}
        </Badge>
      </div>
      
      <CardDescription className="text-base leading-relaxed">
        <span className="font-semibold text-foreground/90">Condition:</span> {tool.condition}
      </CardDescription>
      
      <ScrollArea className="h-auto max-h-[150px] pr-3 border rounded-md p-3 bg-muted/20">
         <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
      </ScrollArea>

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
                      {ref} <Link size={14}/>
                    </a> 
                    : <span className="break-all">{ref}</span>
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
