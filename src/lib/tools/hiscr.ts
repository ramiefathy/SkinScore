
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const hiscrTool: Tool = {
  id: "hiscr",
  name: "HiSCR (Hidradenitis Suppurativa Clinical Response)",
  acronym: "HiSCR",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hiscr", "hs", "hidradenitis suppurativa", "treatment response", "clinical trial", "an count"],
  description: "The HiSCR is a dichotomous (yes/no) outcome measure developed specifically for HS clinical trials to assess treatment response. It is considered more sensitive to change than the HS-PGA. It measures a significant reduction in inflammatory lesions without disease worsening. Requires counts of Abscesses (A), Inflammatory Nodules (IN), and Draining Fistulas (DF) at baseline and follow-up.",
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: [
      {
          id: "hiscr_baseline_group", title: "Baseline Assessment (Prior to Treatment Start)", gridCols: 1,
          inputs: [
              { id: "baselineAbscesses", label: "Baseline Abscess (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "baselineAN", label: "Baseline Total Inflammatory Lesion (AN) Count (Abscesses + Nodules)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0), description:"Sum of baseline Abscesses and Inflammatory Nodules." },
              { id: "baselineFistulas", label: "Baseline Draining Fistula (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      },
      {
          id: "hiscr_followup_group", title: "Follow-up Assessment (At Evaluation Timepoint)", gridCols: 1,
          inputs: [
              { id: "currentAbscesses", label: "Follow-up Abscess (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "currentAN", label: "Follow-up Total Inflammatory Lesion (AN) Count (Abscesses + Nodules)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0), description:"Sum of follow-up Abscesses and Inflammatory Nodules." },
              { id: "currentFistulas", label: "Follow-up Draining Fistula (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      }
  ],
  calculationLogic: (inputs) => {
    const baselineAN = Number(inputs.baselineAN) || 0;
    const currentAN = Number(inputs.currentAN) || 0;
    const baselineAbscesses = Number(inputs.baselineAbscesses) || 0;
    const currentAbscesses = Number(inputs.currentAbscesses) || 0;
    const baselineFistulas = Number(inputs.baselineFistulas) || 0;
    const currentFistulas = Number(inputs.currentFistulas) || 0;

    const anReductionMet = baselineAN > 0 ? ((baselineAN - currentAN) / baselineAN) >= 0.5 : currentAN === 0;
    const noAbscessIncrease = currentAbscesses <= baselineAbscesses;
    const noFistulaIncrease = currentFistulas <= baselineFistulas;

    const isAchieved = anReductionMet && noAbscessIncrease && noFistulaIncrease;
    const score = isAchieved ? 1 : 0; // 1 for Achieved, 0 for Not Achieved

    const interpretation = isAchieved ?
      `HiSCR Achieved: At least 50% reduction in AN count (${((baselineAN - currentAN) / (baselineAN || 1) * 100).toFixed(1)}%) with no increase in abscesses and no increase in draining fistulas.` :
      `HiSCR Not Achieved.
      - AN count reduction ≥50%: ${anReductionMet ? 'Yes' : 'No'} (${((baselineAN - currentAN) / (baselineAN || 1) * 100).toFixed(1)}% reduction)
      - No increase in abscess count: ${noAbscessIncrease ? 'Yes' : 'No'}
      - No increase in draining fistula count: ${noFistulaIncrease ? 'Yes' : 'No'}`;

    return {
      score,
      interpretation,
      details: {
        Baseline_AN_Count: baselineAN,
        Followup_AN_Count: currentAN,
        AN_Reduction_Met: anReductionMet,
        Percent_AN_Reduction: parseFloat(((baselineAN - currentAN) / (baselineAN || 1) * 100).toFixed(1)),
        Baseline_Abscess_Count: baselineAbscesses,
        Followup_Abscess_Count: currentAbscesses,
        No_Abscess_Increase_Met: noAbscessIncrease,
        Baseline_Fistula_Count: baselineFistulas,
        Followup_Fistula_Count: currentFistulas,
        No_Fistula_Increase_Met: noFistulaIncrease,
        HiSCR_Status: isAchieved ? "Achieved" : "Not Achieved"
      }
    };
  },
  references: [
    "Kimball, A. B., Sobell, J. M., Zouboulis, C. C., et al. (2016). Hidradenitis Suppurativa: A-102. Journal of Investigative Dermatology, 136(5), S17. (Abstract describing HiSCR)",
    "The HiSCR was validated in the PIONEER I and II trials for adalimumab (e.g., Kimball AB, et al. N Engl J Med. 2012;367(20):1906-15 - This reference might be for early HS trials, check specific adalimumab HS trial publications like JAMA Dermatol. 2015;151(10):1070-8 for PIONEER results)."
  ]
};
