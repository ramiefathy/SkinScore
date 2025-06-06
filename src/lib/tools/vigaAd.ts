
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const vigaAdOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory signs of AD (no erythema, no induration/papulation, no oozing/crusting)." },
  { value: 1, label: "1 - Almost Clear: Barely perceptible erythema, barely perceptible induration/papulation, and no oozing/crusting." },
  { value: 2, label: "2 - Mild: Mild erythema, mild induration/papulation, and +/- oozing/crusting." },
  { value: 3, label: "3 - Moderate: Moderate erythema, moderate induration/papulation, and +/- oozing/crusting." },
  { value: 4, label: "4 - Severe: Marked erythema, marked induration/papulation/lichenification, and +/- oozing/crusting." }
];

export const vigaAdTool: Tool = {
  id: "viga_ad",
  name: "Validated IGA for AD (vIGA-AD™)",
  acronym: "vIGA-AD",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["viga-ad", "iga", "atopic dermatitis", "ad", "eczema", "physician global assessment", "validated"],
  description: "Static clinician assessment of AD severity.",
  sourceType: 'Research',
  icon: UserCheck,
  displayType: 'staticList', // This tool is typically a classification
  formSections: [ // Simplified for staticList, only options for grading scale are needed
    {
      id: "viga_grade",
      label: "Select vIGA-AD™ Grade",
      type: 'select', // Still 'select' to hold options for ToolInfo
      options: vigaAdOptions,
      defaultValue: 0, // Not strictly needed for staticList display but good for consistency
      validation: getValidationSchema('select', vigaAdOptions, 0, 4) // Not used by UI for staticList
    }
  ],
  calculationLogic: (inputs) => { // Not called by UI if displayType='staticList'
      const grade = Number(inputs.viga_grade);
      const gradeLabel = vigaAdOptions.find(opt => opt.value === grade)?.label || "N/A";
      const gradeText = gradeLabel.substring(gradeLabel.indexOf(" - ") + 3);
      const gradeTitle = gradeLabel.substring(0, gradeLabel.indexOf(":")).trim();

      const interpretation = `vIGA-AD™ Grade: ${gradeTitle}. ${gradeText}`;
      return { score: grade, interpretation, details: { grade_text: gradeTitle, description: gradeText } };
  },
  references: ["Developed for clinical trials, e.g., by the Eczema Council and regulatory bodies like the FDA."]
};
