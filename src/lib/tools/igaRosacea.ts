
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const igaRosaceaOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory lesions (papules/pustules), no erythema." },
  { value: 1, label: "1 - Almost Clear: Rare inflammatory lesions; faint erythema." },
  { value: 2, label: "2 - Mild: Few inflammatory lesions (papules/pustules); mild erythema." },
  { value: 3, label: "3 - Moderate: Several to many inflammatory lesions; moderate erythema." },
  { value: 4, label: "4 - Severe: Numerous inflammatory lesions; severe erythema; may include plaques/nodules." }
];

export const igaRosaceaTool: Tool = {
  id: "iga_rosacea",
  name: "Investigator's Global Assessment (IGA) for Rosacea",
  acronym: "IGA-R",
  condition: "Rosacea",
  keywords: ["iga", "rosacea", "physician global assessment", "severity", "erythema", "papules", "pustules"],
  description: "The Investigator’s Global Assessment for Rosacea (IGA Rosacea) is a clinician-reported, ordinal scale typically ranging from 0 (clear) to 4 (severe), based on the overall severity of key rosacea features—primarily erythema, papules, and pustules—on the face. The IGA is widely used in clinical trials and correlates well with more detailed indices such as the Rosacea Area and Severity Index (RASI), but it is less nuanced, as it does not account for area involvement or specific subtypes. Its simplicity supports feasibility and interobserver reliability, but it may lack sensitivity to subtle changes compared to more granular tools.",
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    {
      id: "iga_grade_rosacea",
      label: "Select IGA Grade for Rosacea",
      type: 'select',
      options: igaRosaceaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaRosaceaOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = Number(inputs.iga_grade_rosacea);
    const gradeDescription = igaRosaceaOptions.find(opt => opt.value === grade)?.label || "N/A";
    const gradeTitle = gradeDescription.substring(0, gradeDescription.indexOf(':')).trim();


    const interpretation = `IGA for Rosacea: Grade ${grade} (${gradeTitle}). This reflects the overall severity of rosacea based on inflammatory lesions and erythema. Full description: ${gradeDescription}`;
    return {
      score: grade,
      interpretation,
      details: {
        Selected_Grade_Description: gradeDescription
      }
    };
  },
  references: [
    "Fowler J, et al. Efficacy and safety of once-daily ivermectin 1% cream in treatment of papulopustular rosacea: results of two randomized, double-blind, vehicle-controlled pivotal studies. J Drugs Dermatol. 2014.",
    "Tan J, et al. Updating the diagnosis, classification and assessment of rosacea: recommendations from the global ROSacea COnsensus (ROSCO) panel. Br J Dermatol. 2017.",
    "Thiboutot D, et al. Standard management options for rosacea: The 2019 update by the National Rosacea Society Expert Committee. J Am Acad Dermatol. 2020."
    ]
};

