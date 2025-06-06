
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const pgaPsoriasisOptions: InputOption[] = [
  { value: 0, label: "0 - Clear" }, { value: 1, label: "1 - Almost Clear / Minimal" }, { value: 2, label: "2 - Mild" },
  { value: 3, label: "3 - Mild to Moderate" }, { value: 4, label: "4 - Moderate" }, { value: 5, label: "5 - Moderate to Severe" }, { value: 6, label: "6 - Severe / Very Marked" }
];

export const pgaPsoriasisTool: Tool = {
  id: "pga_psoriasis",
  name: "Physician Global Assessment (PGA) for Psoriasis",
  acronym: "PGA Psoriasis",
  description: "Single-item clinician assessment of overall psoriasis severity. Scales vary.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pga", "psoriasis", "physician global assessment", "severity", "psoriatic arthritis"],
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    {
      id: "pga_level", label: "Select PGA Level (Example 7-Level)", type: 'select',
      options: pgaPsoriasisOptions,
      defaultValue: 0, validation: getValidationSchema('select', pgaPsoriasisOptions ,0,6)
    }
  ],
  calculationLogic: (inputs) => {
      const pgaLevel = Number(inputs.pga_level);
      const pgaDescription = pgaPsoriasisOptions.find(opt => opt.value === pgaLevel)?.label || "N/A";
      const score = pgaLevel;
      const interpretation = `PGA for Psoriasis: Level ${score} (${pgaDescription}). Score directly reflects assessed severity. PGA 0 or 1 often a treatment goal.`;
      return { score, interpretation, details: { pga_description: pgaDescription } };
  },
  references: ["Various versions; widely used in clinical trials."]
};
