
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

// 6-point scale (0-5)
const igaAcneOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory or non-inflammatory lesions." },
  { value: 1, label: "1 - Almost Clear: Rare non-inflammatory lesions (NILs) with no more than one small inflammatory lesion (IL)." },
  { value: 2, label: "2 - Mild: Some NILs, no more than a few ILs (papules/pustules only, no nodules)." },
  { value: 3, label: "3 - Moderate: Many NILs, may have some ILs, no more than one small nodule." },
  { value: 4, label: "4 - Severe: Numerous NILs and ILs, may have a few nodules." },
  { value: 5, label: "5 - Very Severe: Highly inflammatory acne with widespread lesions and nodules." }
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
  description: "The Investigator's Global Assessment (IGA) is a static, clinician-rated scale that provides a snapshot of overall acne severity. Several versions exist, but a 5-point or 6-point scale (scored 0-4 or 0-5) is common in clinical trials for evaluating treatment success, often required by regulatory agencies like the FDA. This tool uses a 6-point (0-5) scale.",
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    {
      id: "current_iga_grade",
      label: "Current IGA Grade (0-5)",
      type: 'select',
      options: igaAcneOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaAcneOptions ,0,5)
    },
    {
      id: "baseline_iga_grade",
      label: "Baseline IGA Grade (0-5 or N/A)",
      type: 'select',
      options: baselineIgaOptions,
      defaultValue: -1,
      description: "Select baseline grade if assessing treatment success (≥2 grade improvement AND final grade 0 or 1).",
      validation: getValidationSchema('select', baselineIgaOptions ,-1,5)
    }
  ],
  calculationLogic: (inputs) => {
      const currentGrade = Number(inputs.current_iga_grade);
      const baselineGrade = Number(inputs.baseline_iga_grade);

      const currentGradeLabel = igaAcneOptions.find(opt => opt.value === currentGrade)?.label || "Invalid Grade";
      const baselineGradeLabel = baselineIgaOptions.find(opt => opt.value === baselineGrade)?.label || "N/A";

      let treatmentSuccess = "N/A";
      if (baselineGrade !== -1 && baselineGrade >= 0) {
          if (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) {
              treatmentSuccess = "Achieved";
          } else {
              treatmentSuccess = "Not Achieved";
          }
      }

      let interpretation = `Current IGA Acne Grade: ${currentGradeLabel}. `;
      if (baselineGrade !== -1) {
          interpretation += `\nBaseline IGA Grade: ${baselineGradeLabel}. \nTreatment Success (≥2 grade reduction and current grade 0 or 1): ${treatmentSuccess}.`;
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
    "Thiboutot, D. M., et al. (2008). A multicenter, randomized, double-blind, parallel-group study of the efficacy and safety of a novel tretinoin 0.04% gel microsphere formulation in the treatment of acne vulgaris. Cutis, 81(1), 71-78. (Example of IGA use in a clinical trial).",
    "FDA Guidance for Industry: Acne Vulgaris: Developing Drugs for Treatment."
  ]
};
