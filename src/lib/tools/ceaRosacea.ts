
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Palette } from 'lucide-react'; // Or UserCheck if focusing on clinician assessment
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
  keywords: ["cea", "rosacea", "erythema", "redness", "severity", "clinician-rated"],
  description: "The CEA is a 5-point (0-4) static scale rated by a clinician to assess the severity of persistent facial erythema in rosacea. Validation studies show fair to substantial agreement (Weighted κ = 0.54-0.69; ICC ≈ 0.60 for inter-rater; Weighted κ = 0.66-0.74; ICC ≈ 0.58 for intra-rater).",
  sourceType: 'Research',
  icon: Palette,
  formSections: [
    {
      id: "ceaScore",
      label: "Erythema Grade (0–4)",
      type: 'select', // Changed to select to provide descriptive options
      options: ceaRosaceaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', ceaRosaceaOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = Number(inputs.ceaScore);
    const gradeLabelObj = ceaRosaceaOptions.find(opt => opt.value === grade);
    const gradeInterpretation = gradeLabelObj ? gradeLabelObj.label : `Grade ${grade} (Unknown description)`;

    return {
      score: grade,
      interpretation: `CEA for Rosacea: ${gradeInterpretation}.`,
      details: {
        Selected_CEA_Grade_Description: gradeInterpretation
      }
    };
  },
  references: [
    "Tan, J., et al. (2017). Reliability of the Clinician's Erythema Assessment and Patient's Self-Assessment of rosacea. Journal of Cutaneous Medicine and Surgery, 21(1), 30-34.",
    // Example reference of its use, can be kept or replaced if more specific validation study is preferred.
    "Fowler J Jr, et al. J Drugs Dermatol. 2013;12(6):650-6 (brimonidine trials)."
    ]
};
