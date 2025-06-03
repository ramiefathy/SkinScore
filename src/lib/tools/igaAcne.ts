
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const igaAcneGradeOptions: InputOption[] = [ {value:0,label:"0 - Clear"}, {value:1,label:"1 - Almost Clear"}, {value:2,label:"2 - Mild"}, {value:3,label:"3 - Moderate"}, {value:4,label:"4 - Severe"} ];
const igaAcneBaselineOptions: InputOption[] = [ {value:-1,label:"N/A"}, ...igaAcneGradeOptions];

export const igaAcneTool: Tool = {
  id: "iga_acne",
  name: "IGA for Acne Vulgaris",
  acronym: "IGA Acne",
  condition: "Acne Vulgaris",
  keywords: ["iga", "acne", "acne vulgaris", "physician global assessment", "severity"],
  description: "Static clinician assessment of overall facial acne severity.",
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    { id: "current_iga_grade", label: "Current IGA Grade", type: 'select', options: igaAcneGradeOptions, defaultValue: 0, validation: getValidationSchema('select', igaAcneGradeOptions ,0,4)},
    { id: "baseline_iga_grade", label: "Baseline IGA Grade (for treatment success)", type: 'select', options: igaAcneBaselineOptions, defaultValue: -1, validation: getValidationSchema('select', igaAcneBaselineOptions ,-1,4)}
  ],
  calculationLogic: (inputs) => {
      const currentGrade = Number(inputs.current_iga_grade);
      const baselineGrade = Number(inputs.baseline_iga_grade);
      let treatmentSuccess = "N/A";
      const gradeMap: Record<number, string> = {"-1":"N/A"};
      igaAcneGradeOptions.forEach(opt => gradeMap[opt.value as number] = String(opt.label).substring(String(opt.label).indexOf("- ") + 2));


      if (baselineGrade !== -1 && baselineGrade >=0 ) {
          treatmentSuccess = (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) ? "Achieved" : "Not Achieved";
      }

      let interpretation = `Current IGA Acne Grade: ${currentGrade} (${gradeMap[currentGrade] || 'Invalid Grade'}). `;
      if (baselineGrade !== -1) {
          interpretation += `Baseline IGA Grade: ${baselineGrade} (${gradeMap[baselineGrade] || 'Invalid Grade'}). Treatment Success: ${treatmentSuccess}.`;
      } else {
          interpretation += "Baseline not provided or N/A for treatment success assessment.";
      }

      return { score: currentGrade, interpretation, details: { current_grade_text: gradeMap[currentGrade] || 'Invalid Grade', baseline_grade: baselineGrade === -1 ? 'N/A' : baselineGrade, baseline_grade_text: gradeMap[baselineGrade] || 'Invalid Grade', treatment_success: treatmentSuccess } };
  },
  references: ["FDA guidance documents for acne clinical trials. Example: Guidance for Industry Acne Vulgaris: Developing Drugs for Treatment."]
};
