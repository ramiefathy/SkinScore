
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Type } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const mfgAreaNames = ["Upper Lip", "Chin", "Chest", "Upper Back", "Lower Back", "Upper Abdomen", "Lower Abdomen", "Arm", "Thigh"];
const mfgScoreOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${i === 0 ? 'Absent' : (i === 1 ? 'Minimal' : (i === 2 ? 'Mild' : (i === 3 ? 'Moderate' : 'Severe')))}` }));

const mfgFormSections: FormSectionConfig[] = mfgAreaNames.map(areaName => {
  const areaId = `fg_${areaName.toLowerCase().replace(/\s+/g, '_')}`;
  return {
    id: areaId,
    label: `${areaName} Score (0-4)`,
    type: 'select' as 'select',
    options: mfgScoreOptions,
    defaultValue: 0,
    description: "0=Absent, 1=Minimal, 2=Mild, 3=Moderate, 4=Severe terminal hair. Refer to mFG guide for visuals.",
    validation: getValidationSchema('select', mfgScoreOptions, 0, 4)
  } as InputConfig;
});

export const mfgScoreTool: Tool = {
  id: "mfg_score",
  name: "Ferriman-Gallwey Score (mFG)",
  acronym: "mFG Score",
  description: "Evaluates hirsutism in women by grading terminal hair growth in nine body areas.",
  condition: "Hirsutism",
  keywords: ["mfg", "ferriman-gallwey", "hirsutism", "hair growth", "women"],
  sourceType: 'Clinical Guideline',
  icon: Type,
  formSections: mfgFormSections,
  calculationLogic: (inputs) => {
      let totalScore = 0;
      const areaScores: Record<string, number> = {};
      mfgAreaNames.forEach(areaName => {
          const key = `fg_${areaName.toLowerCase().replace(/\s+/g, '_')}`;
          const score = Number(inputs[key]) || 0;
          totalScore += score;
          areaScores[areaName.replace(/\s+/g, '_')] = score;
      });

      let severityInterpretation = "";
      if (totalScore < 8) severityInterpretation = "Normal hair growth or clinically insignificant hirsutism.";
      else if (totalScore <= 15) severityInterpretation = "Mild hirsutism.";
      else severityInterpretation = "Moderate to Severe hirsutism.";

      const interpretation = `mFG Score: ${totalScore} (Range: 0-36). ${severityInterpretation} A score of ≥8 is often used to define hirsutism.`;
      return { score: totalScore, interpretation, details: areaScores };
  },
  references: ["Ferriman D, Gallwey JD. Clinical assessment of body hair growth in women. J Clin Endocrinol Metab. 1961;21:1440-7.", "Hatch R, Rosenfield RL, Kim MH, Tredway D. Hirsutism: implications, etiology, and management. Am J Obstet Gynecol. 1981;140(7):815-30."]
};
