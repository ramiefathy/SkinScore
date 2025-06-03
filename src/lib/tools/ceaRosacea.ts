
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Palette } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const ceaRosaceaOptions: InputOption[] = [
  { value: 0, label: "0 - Clear skin with no signs of erythema." },
  { value: 1, label: "1 - Almost clear; slight redness." },
  { value: 2, label: "2 - Mild erythema; definite redness, easily recognized." },
  { value: 3, label: "3 - Moderate erythema; marked redness." },
  { value: 4, label: "4 - Severe erythema; fiery redness." }
];

export const ceaRosaceaTool: Tool = {
  id: "cea_rosacea",
  name: "Clinician's Erythema Assessment (CEA) for Rosacea",
  acronym: "CEA Rosacea",
  condition: "Rosacea",
  keywords: ["cea", "rosacea", "erythema", "redness", "severity"],
  description: "A clinician-rated assessment of the severity of facial erythema associated with rosacea, typically on a 5-point scale.",
  sourceType: 'Research',
  icon: Palette,
  formSections: [
    {
      id: "cea_grade_rosacea",
      label: "Select CEA Grade for Rosacea Erythema",
      type: 'select',
      options: ceaRosaceaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', ceaRosaceaOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = Number(inputs.cea_grade_rosacea);
    const gradeDescription = ceaRosaceaOptions.find(opt => opt.value === grade)?.label || "N/A";
    const gradeTitle = gradeDescription.substring(0, gradeDescription.indexOf(':')).trim();

    const interpretation = `CEA for Rosacea: Grade ${grade} (${gradeTitle}). This score reflects the severity of facial erythema. Full description: ${gradeDescription}`;
    return {
      score: grade,
      interpretation,
      details: {
        Selected_Grade_Description: gradeDescription
      }
    };
  },
  references: ["Used in clinical trials evaluating treatments for rosacea-associated erythema. Example: Fowler J Jr, et al. J Drugs Dermatol. 2013;12(6):650-6 (brimonidine trials)."]
};
