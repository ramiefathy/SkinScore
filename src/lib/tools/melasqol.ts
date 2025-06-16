
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users2 } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const melasqolTool: Tool = {
  id: "melasqol",
  name: "Melasma Quality of Life Scale (MELASQOL)",
  acronym: "MELASQOL",
  condition: "Quality of Life",
  keywords: ["melasqol", "melasma", "quality of life", "patient reported", "psychosocial impact"],
  description: "The MELASQOL (Melasma Quality of Life Scale) is a 10-item patient-reported outcome measure specifically designed to assess the psychosocial impact of melasma. Each item is scored from 1 (not bothered at all) to 7 (bothered all the time), yielding a total score ranging from 7 to 70, where higher scores indicate worse quality of life. It is validated, correlates with the Dermatology Life Quality Index (DLQI), and is more disease-specific than generic QoL tools. MELASQOL complements clinical severity measures like MASI/mMASI by capturing the patient's experience. Notably, MELASQOL and MASI/mMASI scores may not always correlate, highlighting the importance of assessing both clinical severity and patient-reported outcomes in managing pigmentary disorders.",
  sourceType: 'Research',
  icon: Users2,
  formSections: [
    {id:"total_score", label:"Total MELASQOL Score (7-70)", type:'number', min:7, max:70, defaultValue:7, description:"Enter the sum of scores from the 10 questions (each question 1-7).", validation:getValidationSchema('number', [], 7, 70)}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||7;
      const interpretation = `MELASQOL Score: ${score} (Range: 7-70). Higher score indicates worse quality of life.`;
      return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: ["Balkrishnan R, McMichael AJ, Camacho FT, et al. Development and validation of a health-related quality of life instrument for women with melasma. Br J Dermatol. 2003;149(3):572-577."]
};

