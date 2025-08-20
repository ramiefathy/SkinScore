 "use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Tool, InputConfig, InputGroupConfig, FormSectionConfig } from '@/lib/types';
import { DynamicFormField } from './DynamicFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CardContent, CardFooter } from '@/components/ui/card';

interface ToolFormProps {
  tool: Tool;
  onCalculate: (inputs: Record<string, any>) => void;
}

// Helper function to flatten all InputConfigs from FormSectionConfig[]
const getAllInputConfigs = (sections: FormSectionConfig[]): InputConfig[] => {
  return sections.reduce((acc, section) => {
    if ('inputs' in section) { // It's an InputGroupConfig
      acc.push(...section.inputs);
    } else { // It's an InputConfig
      acc.push(section);
    }
    return acc;
  }, [] as InputConfig[]);
};


export function ToolForm({ tool, onCalculate }: ToolFormProps) {
  const allInputConfigs = React.useMemo(() => getAllInputConfigs(tool.formSections), [tool.formSections]);

  const generateSchema = () => {
    const shape: Record<string, z.ZodSchema<any>> = {};
    allInputConfigs.forEach(input => {
      shape[input.id] = input.validation || z.any();
    });
    return z.object(shape);
  };

  const formSchema = React.useMemo(() => generateSchema(), [allInputConfigs]);
  
  const defaultValues = React.useMemo(() => {
    return allInputConfigs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  }, [allInputConfigs]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [tool, form, defaultValues]);

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <CardContent className="p-6 grid gap-x-6 gap-y-0 md:grid-cols-2">
          {tool.formSections.map((section, index) => {
            if ('inputs' in section) { // This is an InputGroupConfig
              const group = section as InputGroupConfig;
              let groupGridColsClass = 'md:grid-cols-2'; // Default for group
              if (group.gridCols === 1) groupGridColsClass = 'md:grid-cols-1';
              if (group.gridCols === 3) groupGridColsClass = 'md:grid-cols-3';
              if (group.gridCols === 4) groupGridColsClass = 'md:grid-cols-4';
              
              return (
                <div key={group.id || `group-${index}`} className="md:col-span-2 space-y-3 border p-4 rounded-lg shadow bg-card/50 my-3">
                  {group.title && <h3 className="text-md font-semibold mb-3 text-foreground">{group.title}</h3>}
                  {group.description && <p className="text-sm text-muted-foreground mb-3 -mt-2">{group.description}</p>}
                  <div className={`grid gap-x-6 gap-y-1 ${groupGridColsClass}`}>
                    {group.inputs.map((inputConfig) => (
                      <DynamicFormField
                        key={inputConfig.id}
                        control={form.control}
                        inputConfig={inputConfig}
                      />
                    ))}
                  </div>
                </div>
              );
            } else { // This is a simple InputConfig
              const inputConfig = section as InputConfig;
              return (
                <DynamicFormField
                  key={inputConfig.id}
                  control={form.control}
                  inputConfig={inputConfig}
                />
              );
            }
          })}
        </CardContent>
        <CardFooter className="p-6 pt-4">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Calculate Score
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
