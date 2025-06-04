
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const igaAcneGradeOptions: InputOption[] = [ {value:0,label:"0 - Clear: No inflammatory lesions, no comedones."}, {value:1,label:"1 - Almost Clear: Rare non-inflammatory lesions (NILs) with no more than one small inflammatory lesion (IL)."}, {value:2,label:"2 - Mild: Some NILs, no more than a few ILs (papules/pustules only, no nodules)."}, {value:3,label:"3 - Moderate: Many NILs, may have some ILs, no more than one small nodule."}, {value:4,label:"4 - Severe: Many NILs and ILs, may have a few nodules."} ];
// Note: Baseline options are removed from formSections for staticList display,
// as they are part of a calculation, not the primary grading scale.

export const igaAcneTool: Tool = {
  id: "iga_acne",
  name: "IGA for Acne Vulgaris",
  acronym: "IGA Acne",
  condition: "Acne Vulgaris",
  keywords: ["iga", "acne", "acne vulgaris", "physician global assessment", "severity"],
  description: "Static clinician assessment of overall facial acne severity. Definitions can vary.",
  sourceType: 'Research',
  icon: UserCheck,
  displayType: 'staticList', // Changed to staticList
  formSections: [
    // Simplified for staticList display: only show the main grading scale.
    // The original formSections for calculation logic would include baseline_iga_grade.
    // For static display, we only care about the primary classification options.
    {
      id: "current_iga_grade", // ID is still relevant for ToolInfo to find options
      label: "IGA Grade for Acne Vulgaris", // Label for context if ever needed
      type: 'select', // Type indicates where options are stored
      options: igaAcneGradeOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaAcneGradeOptions ,0,4)
    }
  ],
  calculationLogic: (inputs) => {
      // This logic remains for completeness or if the tool were ever used as 'form' type
      // but won't be called by the UI if displayType is 'staticList'.
      const currentGrade = Number(inputs.current_iga_grade);
      const baselineGrade = Number(inputs.baseline_iga_grade); // This input would not be available from the simplified formSections
      let treatmentSuccess = "N/A";
      const gradeMap: Record<number, string> = {"-1":"N/A"};
      igaAcneGradeOptions.forEach(opt => gradeMap[opt.value as number] = String(opt.label));


      if (baselineGrade !== undefined && baselineGrade !== -1 && baselineGrade >=0 ) {
          treatmentSuccess = (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) ? "Achieved" : "Not Achieved";
      }

      let interpretation = `Current IGA Acne Grade: ${currentGrade} (${gradeMap[currentGrade] || 'Invalid Grade'}). `;
      if (baselineGrade !== undefined && baselineGrade !== -1) {
          interpretation += `Baseline IGA Grade: ${baselineGrade} (${gradeMap[baselineGrade] || 'Invalid Grade'}). Treatment Success: ${treatmentSuccess}.`;
      } else {
          interpretation += "Baseline not provided or N/A for treatment success assessment.";
      }

      return { score: currentGrade, interpretation, details: { current_grade_text: gradeMap[currentGrade] || 'Invalid Grade', baseline_grade: baselineGrade === -1 || baselineGrade === undefined ? 'N/A' : baselineGrade, baseline_grade_text: gradeMap[baselineGrade] || 'Invalid Grade', treatment_success: treatmentSuccess } };
  },
  references: ["FDA guidance documents for acne clinical trials. Example: Guidance for Industry Acne Vulgaris: Developing Drugs for Treatment.", "Cook D, et al. A new investigator's global assessment scale for acne vulgaris: a more sensitive instrument for measuring treatment effect. J Drugs Dermatol. 2004 May-Jun;3(3):262-6."]
};

