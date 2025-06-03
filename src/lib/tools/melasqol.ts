
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users2 } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const melasqolTool: Tool = {
  id: "melasqol",
  name: "Melasma Quality of Life Scale (MELASQOL)",
  acronym: "MELASQOL",
  condition: "Quality of Life",
  keywords: ["melasqol", "melasma", "quality of life", "patient reported"],
  description: "Assesses the impact of melasma on a patient's quality of life. Original version has 10 questions, each scored 1-7.",
  sourceType: 'Research',
  icon: Users2,
  formSections: [
    {id:"total_score", label:"Total MELASQOL Score", type:'number', min:10, max:70, defaultValue:10, description:"Enter the sum of scores from the 10 questions (each question 1-7).", validation:getValidationSchema('number', [], 10, 70)}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||10;
      const interpretation = `MELASQOL Score: ${score} (Range: 10-70). Higher score indicates worse quality of life.`;
      return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: ["Balkrishnan R, McMichael AJ, Camacho FT, et al. Development and validation of a health-related quality of life instrument for women with melasma. Br J Dermatol. 2003;149(3):572-577."]
};
