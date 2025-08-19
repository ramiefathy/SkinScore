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
  description: "The modified Ferriman-Gallwey (mFG) Score quantifies hirsutism by visually assessing terminal hair growth in nine androgen-sensitive body areas: upper lip, chin, chest, upper back, lower back, upper abdomen, lower abdomen, upper arms, and thighs. Each area is scored from 0 (no terminal hair) to 4 (extensive terminal hair), and the total mFG score is the sum of all nine sites (range: 0–36). A score of ≥8 is generally considered diagnostic for hirsutism in White and Black women in the US and UK, but cutoffs vary by ethnicity (e.g., 4–6 in Asian populations). The mFG does not weight sites differently; all are summed equally. The Endocrine Society recommends the mFG as the gold standard for hirsutism assessment. Compared to ISS, VIS, and LoSCAT, the mFG is a single-dimension, site-based, unweighted sum, whereas ISS and LoSCAT use site-specific weightings and multidimensional scoring.",
  condition: "Hirsutism",
  keywords: ["mfg", "ferriman-gallwey", "hirsutism", "hair growth", "women", "endocrine"],
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
      if (totalScore < 8) severityInterpretation = "Normal hair growth or clinically insignificant hirsutism (for White/Black women).";
      else if (totalScore <= 15) severityInterpretation = "Mild hirsutism.";
      else severityInterpretation = "Moderate to Severe hirsutism.";

      const interpretation = `mFG Score: ${totalScore} (Range: 0-36). ${severityInterpretation} A score of ≥8 is often used to define hirsutism in White and Black women; cutoffs may be lower for other ethnicities (e.g., 4-6 for some Asian populations).`;
      return { score: totalScore, interpretation, details: areaScores };
  },
  references: ["Ferriman D, Gallwey JD. Clinical assessment of body hair growth in women. J Clin Endocrinol Metab. 1961;21:1440-7.", "Hatch R, Rosenfield RL, Kim MH, Tredway D. Hirsutism: implications, etiology, and management. Am J Obstet Gynecol. 1981;140(7):815-30.", "Martin KA, Chang RJ, Ehrmann DA, et al. Evaluation and Treatment of Hirsutism in Premenopausal Women: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2018 Apr 1;103(4):1233-1257."]
};
