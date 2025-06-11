
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hsPgaGradeOptions: InputOption[] = [
  { value: 0, label: "0 - Clear (no lesions)" },
  { value: 1, label: "1 - Minimal (no abscesses or draining fistulas)" },
  { value: 2, label: "2 - Mild (few nodules, ≤1 abscess or fistula)" },
  { value: 3, label: "3 - Moderate (multiple nodules, few abscesses/fistulas)" },
  { value: 4, label: "4 - Severe (multiple nodules/abscesses, limited fistulas)" },
  { value: 5, label: "5 - Very Severe (multiple nodules, abscesses, and fistulas)" }
];

export const hsPgaTool: Tool = {
  id: "hspga",
  name: "HS-PGA (Hidradenitis Suppurativa Physician's Global Assessment)",
  acronym: "HS-PGA",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hspga", "hs", "hidradenitis suppurativa", "pga", "physician global assessment", "severity"],
  description: "The HS-PGA is a validated 6-point scale (0-5) used to rate the overall severity of HS at a single point in time. It is based on the number and type of lesions and is frequently used in clinical trials to provide a global impression of the disease state.",
  sourceType: 'Research',
  icon: UserCheck,
  displayType: 'staticList',
  formSections: [
    {
      id: "hs_pga_grade_display",
      label: "HS-PGA Grades",
      type: 'select',
      options: hsPgaGradeOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', hsPgaGradeOptions, 0, 5)
    }
  ],
  calculationLogic: (inputs) => { // Not called by UI if displayType='staticList'
    const grade = Number(inputs.pgaGrade) || 0; // inputs.pgaGrade won't be present
    const gradeLabel = hsPgaGradeOptions.find(opt => opt.value === grade)?.label || "Invalid Grade";
    const interpretationText = `HS-PGA Grade ${gradeLabel}. A common trial endpoint is achieving a ≥2-grade reduction from baseline.`;

    return {
      score: grade,
      interpretation: interpretationText,
      details: {
        Selected_HS_PGA_Grade: gradeLabel
      }
    };
  },
  references: [
    "Kimball, A. B., et al. (2016). The Hidradenitis Suppurativa Physician's Global Assessment. Journal of the American Academy of Dermatology, 75(2), 346-350."
  ]
};
