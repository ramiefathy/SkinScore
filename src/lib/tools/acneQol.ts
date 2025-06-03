
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { MessageSquare } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const acneQolTool: Tool = {
  id: "acneqol",
  name: "Acne-Specific Quality of Life (Acne-QoL)",
  acronym: "Acne-QoL",
  condition: "Quality of Life",
  keywords: ["acneqol", "acne", "quality of life", "patient reported"],
  description: "Measures the impact of facial acne on quality of life across several domains. Total score interpretation depends on the specific version and scoring.",
  sourceType: 'Research',
  icon: MessageSquare,
  formSections: [
    { id:"total_score", label: "Total Acne-QoL Score", type:'number', defaultValue:0, description:"Enter the calculated total score from the questionnaire. Range and interpretation depend on the version used (e.g., original 19-item sum, or standardized 0-100).", validation: getValidationSchema('number')}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||0;
      const interpretation = `Acne-QoL Total Score: ${score}. For the original 19-item version (sum of item scores), a lower score indicates better QoL. For standardized versions (e.g., 0-100 scale), a higher score often indicates worse QoL. Check specific version guidelines for interpretation.`;
      return { score, interpretation, details: { score_type: "User-entered total score" } };
  },
  references: ["Martin AR, Lookingbill DP, Botek A, et al. Development of a new acne-specific quality of life questionnaire (Acne-QoL). J Am Acad Dermatol. 1998;39(3):415-421.", "Fehnel SE, McLeod LD, Brandman J, et al. Responsiveness of the Acne-Specific Quality of Life Questionnaire (Acne-QoL) to treatment for acne vulgaris in a placebo-controlled clinical trial. Qual Life Res. 2002;11(8):809-816."]
};
