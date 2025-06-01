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

const getSourceTypeColor = (sourceType: Tool['sourceType']) => {
  switch (sourceType) {
    case 'Research':
      return 'bg-blue-500 hover:bg-blue-600'; // Using specific Tailwind color for now, ideally theme based
    case 'Clinical Guideline':
      return 'bg-green-500 hover:bg-green-600';
    case 'Expert Consensus':
      return 'bg-purple-500 hover:bg-purple-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export function ToolInfo({ tool }: ToolInfoProps) {
  const IconComponent = tool.icon;

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 mb-2">
        <div className="flex items-center gap-3 mb-2">
          {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
          <CardTitle className="text-2xl font-headline">{tool.name} {tool.acronym && `(${tool.acronym})`}</CardTitle>
        </div>
        <Badge variant="secondary" className={`${getSourceTypeColor(tool.sourceType)} text-white`}>
          {tool.sourceType}
        </Badge>
      </CardHeader>
      
      <CardDescription className="text-base leading-relaxed">
        <span className="font-semibold">Condition:</span> {tool.condition}
      </CardDescription>
      
      <ScrollArea className="h-[100px] pr-3">
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
