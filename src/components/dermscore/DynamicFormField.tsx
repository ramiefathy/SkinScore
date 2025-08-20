
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
  const { id, label, type, options, defaultValue, min, max, step, placeholder, description: fieldDescription } = inputConfig; // Renamed to avoid conflict

  return (
    <FormField
      control={control}
      name={id as Path<TFieldValues>}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {type !== 'checkbox' && (
            <div className="min-h-[4rem]">
              <FormLabel>{label}</FormLabel>
              {fieldDescription ? (
                <FormDescription className="mt-1 text-sm text-muted-foreground">
                  {fieldDescription}
                </FormDescription>
              ) : (
                <div className="mt-1 h-[1.25rem]" aria-hidden="true" />
              )}
            </div>
          )}
          <FormControl>
            <div>
              {type === 'number' && (
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? null : parseFloat(val));
                  }}
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
                <Select
                  onValueChange={(value) => {
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
                      <SelectItem
                        key={`${inputConfig.id}-${String(option.value)}-${option.label}`}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type === 'checkbox' && (
                <div className="flex items-start space-x-2 pt-2 min-h-[4rem]">
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={field.name}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={field.name} className="text-sm font-medium cursor-pointer">
                      {label}
                    </Label>
                    {fieldDescription && (
                      <p className="text-sm text-muted-foreground">{fieldDescription}</p>
                    )}
                  </div>
                </div>
              )}
              {type === 'radio' && options && (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    const selectedOption = options.find(opt => String(opt.value) === value);
                    if (selectedOption && typeof selectedOption.value === 'number') {
                      field.onChange(Number(value));
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                  className="flex flex-col space-y-1 pt-1"
                >
                  {options.map((option) => (
                    <FormItem
                      key={`${inputConfig.id}-${String(option.value)}-${option.label}`}
                      className="flex items-center space-x-3 space-y-0"
                    >
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
              {(!['number', 'text', 'select', 'checkbox', 'radio'].includes(type) ||
                (type === 'select' && !options) ||
                (type === 'radio' && !options)) && (
                  <div data-testid="empty-form-control-child" />
              )}
            </div>
          </FormControl>
          <FormMessage className="text-xs min-h-[1rem]" />
        </FormItem>
      )}
    />
  );
}
