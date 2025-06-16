
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const hiscrTool: Tool = {
  id: "hiscr",
  name: "HiSCR (Hidradenitis Suppurativa Clinical Response)",
  acronym: "HiSCR",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hiscr", "hs", "hidradenitis suppurativa", "treatment response", "clinical trial", "an count"],
  description: "The Hidradenitis Suppurativa Clinical Response (HiSCR) is the most widely used dynamic outcome measure in HS trials. It is defined as at least a 50% reduction in the combined count of abscesses and inflammatory nodules (AN count) from baseline, with no increase in abscess or draining fistula count. HiSCR is dichotomous (responder/non-responder) and is recommended by the United States Hidradenitis Suppurativa Foundation and Canadian Hidradenitis Suppurativa Foundation for research settings due to its responsiveness and ease of use. However, it does not capture changes in draining tunnels, which is a limitation compared to newer instruments.",
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

    // Handle baselineAN = 0 case for reduction percentage correctly
    let anReductionPercentage = 0;
    if (baselineAN > 0) {
      anReductionPercentage = ((baselineAN - currentAN) / baselineAN) * 100;
    } else if (currentAN === 0) { // If baseline was 0 and current is 0, it's 100% reduction effectively for the purpose of "no worsening"
      anReductionPercentage = 100;
    }


    const anReductionMet = baselineAN > 0 ? anReductionPercentage >= 50 : currentAN === 0; // If baselineAN is 0, then currentAN must also be 0 to meet this.
    const noAbscessIncrease = currentAbscesses <= baselineAbscesses;
    const noFistulaIncrease = currentFistulas <= baselineFistulas;

    const isAchieved = anReductionMet && noAbscessIncrease && noFistulaIncrease;
    const score = isAchieved ? 1 : 0; // 1 for Achieved, 0 for Not Achieved

    const interpretation = isAchieved ?
      `HiSCR Achieved: At least 50% reduction in AN count (${anReductionPercentage.toFixed(1)}%) with no increase in abscesses and no increase in draining fistulas.` :
      `HiSCR Not Achieved.
      - AN count reduction ≥50%: ${anReductionMet ? 'Yes' : 'No'} (${anReductionPercentage.toFixed(1)}% reduction from baseline of ${baselineAN})
      - No increase in abscess count from baseline: ${noAbscessIncrease ? 'Yes' : 'No'} (Baseline: ${baselineAbscesses}, Follow-up: ${currentAbscesses})
      - No increase in draining fistula count from baseline: ${noFistulaIncrease ? 'Yes' : 'No'} (Baseline: ${baselineFistulas}, Follow-up: ${currentFistulas})`;

    return {
      score,
      interpretation,
      details: {
        Baseline_AN_Count: baselineAN,
        Followup_AN_Count: currentAN,
        AN_Reduction_Met: anReductionMet,
        Percent_AN_Reduction: parseFloat(anReductionPercentage.toFixed(1)),
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
    "The HiSCR was validated in the PIONEER I and II trials for adalimumab (e.g., Kimball AB, et al. Adalimumab for the treatment of moderate to severe Hidradenitis Suppurativa: A phase II, randomized, double-blind, placebo-controlled study. J Am Acad Dermatol. 2012 Dec;67(6):1370-7. See also later Phase III publications for PIONEER trials such as Kimball AB, et al. JAMA Dermatol. 2015 Oct;151(10):1070-8)."
  ]
};
