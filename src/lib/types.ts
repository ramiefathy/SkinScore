
import type { LucideIcon } from 'lucide-react';
import type { ZodSchema } from 'zod';

export type InputOption = {
  value: string | number;
  label: string;
};

export type InputConfig = {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox' | 'radio' | 'text';
  options?: InputOption[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  validation?: ZodSchema<any>;
  description?: string;
};

export type InputGroupConfig = {
  id: string;
  title: string;
  inputs: InputConfig[];
  gridCols?: 1 | 2 | 3 | 4; // Number of columns for the inputs within this group
  description?: string;
};

export type FormSectionConfig = InputConfig | InputGroupConfig;

export type CalculationResult = {
  score: number | string;
  interpretation: string;
  details?: Record<string, any>; // Allow nested details
};

export type Tool = {
  id: string;
  name: string;
  acronym?: string;
  description: string;
  condition: string;
  keywords: string[];
  sourceType: 'Research' | 'Clinical Guideline' | 'Expert Consensus';
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  formSections: FormSectionConfig[]; // Changed from inputs: InputConfig[]
  calculationLogic: (inputs: Record<string, any>) => CalculationResult;
  references?: string[];
  displayType?: 'staticList';
  rationale?: string;
  clinicalPerformance?: string;
};
