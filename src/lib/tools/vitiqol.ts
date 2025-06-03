
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users } from 'lucide-react'; // Assuming Users icon, adjust if needed
import { getValidationSchema } from '../toolValidation';

export const vitiqolTool: Tool = {
  id: "vitiqol",
  name: "Vitiligo-specific Quality of Life (VitiQoL)",
  acronym: "VitiQoL",
  condition: "Quality of Life",
  keywords: ["vitiqol", "vitiligo", "quality of life", "patient reported"],
  description: "Measures the impact of vitiligo on a patient's quality of life. Scores depend on the specific version used (e.g., 15-item, each 0-6, total 0-90).",
  sourceType: 'Research',
  icon: Users,
  formSections: [
    {id:"total_score", label:"Total VitiQoL Score", type:'number', defaultValue:0, description:"Enter the sum of scores from the questionnaire items. Range depends on the version (e.g., 0-90 for 15 items scored 0-6).", validation:getValidationSchema('number')}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||0;
      const interpretation = `VitiQoL Score: ${score}. Higher score indicates worse quality of life. Refer to the specific VitiQoL version for detailed interpretation and range.`;
      return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: ["Lilly E, Lu PD, Borovicka JH, et al. Development and validation of a vitiligo-specific quality-of-life instrument (VitiQoL). J Am Acad Dermatol. 2013;69(1):e11-e18."]
};
