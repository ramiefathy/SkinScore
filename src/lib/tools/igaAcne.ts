
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

// Updated to 5-point scale (0-4)
const igaAcneOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory or non-inflammatory lesions." },
  { value: 1, label: "1 - Almost Clear: Rare non-inflammatory lesions (NILs) with no more than one small inflammatory lesion (IL)." },
  { value: 2, label: "2 - Mild: Some NILs, no more than a few ILs (papules/pustules only, no nodules)." },
  { value: 3, label: "3 - Moderate: Many NILs, may have some ILs, no more than one small nodule." },
  { value: 4, label: "4 - Severe: Numerous NILs and ILs, may have a few nodules." }
];

const baselineIgaOptions: InputOption[] = [
  { value: -1, label: "N/A (Baseline not assessed)" },
  ...igaAcneOptions
];


export const igaAcneTool: Tool = {
  id: "iga_acne",
  name: "IGA for Acne Vulgaris",
  acronym: "IGA Acne",
  condition: "Acne Vulgaris",
  keywords: ["iga", "acne", "acne vulgaris", "physician global assessment", "severity"],
  description: "The Investigator's Global Assessment (IGA) for Acne Vulgaris is a static, clinician-rated, 5-point ordinal scale (0–4: clear, almost clear, mild, moderate, severe) based on lesion type, number, and distribution, as recommended by the American Academy of Dermatology. It is the most commonly used global assessment in US clinical trials and practice, providing a standardized, qualitative measure of acne severity.",
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    {
      id: "current_iga_grade",
      label: "Current IGA Grade (0-4)",
      type: 'select',
      options: igaAcneOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaAcneOptions ,0,4) // Max changed to 4
    },
    {
      id: "baseline_iga_grade",
      label: "Baseline IGA Grade (0-4 or N/A)",
      type: 'select',
      options: baselineIgaOptions,
      defaultValue: -1,
      description: "Select baseline grade if assessing treatment success (≥2 grade improvement AND final grade 0 or 1).",
      validation: getValidationSchema('select', baselineIgaOptions ,-1,4) // Max changed to 4
    }
  ],
  calculationLogic: (inputs) => {
      const currentGrade = Number(inputs.current_iga_grade);
      const baselineGrade = Number(inputs.baseline_iga_grade);

      const currentGradeLabel = igaAcneOptions.find(opt => opt.value === currentGrade)?.label || "Invalid Grade";
      const baselineGradeLabel = baselineIgaOptions.find(opt => opt.value === baselineGrade)?.label || "N/A";

      let treatmentSuccess = "N/A";
      if (baselineGrade !== -1 && baselineGrade >= 0) {
          // Treatment success definition: current grade 0 or 1 AND at least a 2-grade improvement from baseline
          if (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) {
              treatmentSuccess = "Achieved";
          } else {
              treatmentSuccess = "Not Achieved";
          }
      }

      let interpretation = `Current IGA Acne Grade: ${currentGradeLabel}. `;
      if (baselineGrade !== -1) {
          interpretation += `\nBaseline IGA Grade: ${baselineGradeLabel}. \nTreatment Success (Current grade 0 or 1 AND ≥2 grade reduction from baseline): ${treatmentSuccess}.`;
      }

      return {
        score: currentGrade,
        interpretation,
        details: {
          Current_IGA_Description: currentGradeLabel,
          Baseline_IGA_Description: baselineGradeLabel,
          Treatment_Success_Criteria_Met: treatmentSuccess
        }
      };
  },
  references: [
    "Bernardis E, Shou H, Barbieri JS, et al. Development and Initial Validation of a Multidimensional Acne Global Grading System Integrating Primary Lesions and Secondary Changes. JAMA Dermatology. 2020;156(3):296-302. doi:10.1001/jamadermatol.2019.4668.",
    "Thiboutot, D. M., et al. (2008). A multicenter, randomized, double-blind, parallel-group study of the efficacy and safety of a novel tretinoin 0.04% gel microsphere formulation in the treatment of acne vulgaris. Cutis, 81(1), 71-78. (Example of IGA use in a clinical trial).",
    "FDA Guidance for Industry: Acne Vulgaris: Developing Drugs for Treatment."
  ]
};

