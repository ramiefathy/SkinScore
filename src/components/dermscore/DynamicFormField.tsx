
import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { InputConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
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
            {/* This div ensures FormControl's Slot always has a single child */}
            <div>
              {type === 'number' && (
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty string for clearing, otherwise parse to float
                    field.onChange(val === '' ? null : parseFloat(val));
                  }}
                  min={min}
                  max={max}
                  step={step}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'text' && ( // Ensure Textarea is used for 'text' type
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder={placeholder}
                  className={error ? 'border-destructive' : ''}
                />
              )}
              {type === 'select' && options && (
                <Select
                  onValueChange={(value) => {
                    // Find the original option to check its type
                    const selectedOption = options.find(opt => String(opt.value) === value);
                    if (selectedOption && typeof selectedOption.value === 'number') {
                      field.onChange(Number(value));
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                >
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
                // The FormControl props (id, aria-attributes) will be passed to this div
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    {...field} // Ensures RHF props are passed
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={field.name} // Use field.name for id, common practice with RHF for unique IDs
                  />
                   <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
                     {/* This label is often used to make the text next to checkbox clickable.
                         It uses the field.name as htmlFor, matching the Checkbox id.
                         The main FormLabel (above) provides the primary description for the field.
                     */}
                   </Label>
                </div>
              )}
              {type === 'radio' && options && (
                <RadioGroup
                  {...field} // Ensures RHF props are passed
                  onValueChange={field.onChange} // field.onChange directly takes the value
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                  className="flex flex-col space-y-1 pt-1"
                >
                  {options.map((option) => (
                    <FormItem key={String(option.value)} className="flex items-center space-x-3 space-y-0">
                      {/* Inner FormControl for RadioGroupItem as per shadcn convention */}
                      <FormControl>
                        <RadioGroupItem value={String(option.value)} id={`${field.name}-${option.value}`} />
                      </FormControl>
                      <FormLabel htmlFor={`${field.name}-${option.value}`} className="font-normal cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
              {/* Fallback to ensure FormControl always has a child if no conditions above match */}
              {(!['number', 'text', 'select', 'checkbox', 'radio'].includes(type) ||
                (type === 'select' && !options) ||
                (type === 'radio' && !options)) && (
                  <div data-testid="empty-form-control-child" />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
