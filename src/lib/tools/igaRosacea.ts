
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
  description: "A clinician-rated assessment of overall rosacea severity, typically on a 5-point scale (0=Clear to 4=Severe). Definitions vary slightly.",
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
  references: ["Various versions used in clinical trials for rosacea treatments. Example: Fowler J, et al. Efficacy and safety of once-daily ivermectin 1% cream in treatment of papulopustular rosacea: results of two randomized, double-blind, vehicle-controlled pivotal studies. J Drugs Dermatol. 2014."]
};
