 "use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Tool, CalculationResult } from '@/lib/types';
import { DynamicFormField } from './DynamicFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CardContent, CardFooter } from '@/components/ui/card';

interface ToolFormProps {
  tool: Tool;
  onCalculate: (inputs: Record<string, any>) => void;
}

export function ToolForm({ tool, onCalculate }: ToolFormProps) {
  // Dynamically create Zod schema
  const generateSchema = () => {
    const shape: Record<string, z.ZodSchema<any>> = {};
    tool.inputs.forEach(input => {
      shape[input.id] = input.validation || z.any(); // Default to z.any() if no validation provided
    });
    return z.object(shape);
  };

  const formSchema = React.useMemo(() => generateSchema(), [tool]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: tool.inputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {} as Record<string, any>),
  });

  useEffect(() => {
    form.reset(
      tool.inputs.reduce((acc, input) => {
        acc[input.id] = input.defaultValue;
        return acc;
      }, {} as Record<string, any>)
    );
  }, [tool, form]);

  const onSubmit = (data: Record<string, any>) => {
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="p-0 grid gap-4 md:grid-cols-2">
          {tool.inputs.map((inputConfig) => (
            <DynamicFormField
              key={inputConfig.id}
              control={form.control}
              inputConfig={inputConfig}
            />
          ))}
        </CardContent>
        <CardFooter className="p-0">
          <Button type="submit" className="w-full md:w-auto">
            Calculate Score
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
