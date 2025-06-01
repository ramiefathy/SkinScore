import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { InputConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'; // Added FormField here
import { Textarea } from '@/components/ui/textarea';


interface DynamicFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  inputConfig: InputConfig;
}

export function DynamicFormField<TFieldValues extends FieldValues>({
  control,
  inputConfig,
}: DynamicFormFieldProps<TFieldValues>) {
  const { id, label, type, options, defaultValue, min, max, step, placeholder, description } = inputConfig;

  return (
    <FormField
      control={control}
      name={id as Path<TFieldValues>}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="mb-4">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <>
              {type === 'number' && (
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  min={min}
                  max={max}
                  step={step}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'text' && ( 
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'select' && options && (
                <Select onValueChange={(value) => field.onChange(isNaN(Number(value)) ? value : Number(value))} defaultValue={String(field.value)}>
                  <SelectTrigger className={error ? 'border-destructive' : ''}>
                    <SelectValue placeholder={placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor={id} className="text-sm font-normal">
                    {/* Checkbox might not need a separate label if it's self-descriptive or part of a group */}
                  </Label>
                </div>
              )}
              {type === 'radio' && options && (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                  className="flex flex-col space-y-1"
                >
                  {options.map((option) => (
                    <FormItem key={String(option.value)} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={String(option.value)} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
