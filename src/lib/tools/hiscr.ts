import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const hiscrTool: Tool = {
  id: "hiscr",
  name: "HiSCR (Hidradenitis Suppurativa Clinical Response)",
  acronym: "HiSCR",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hiscr", "hs", "hidradenitis suppurativa", "treatment response", "clinical trial", "an count"],
  description: "The Hidradenitis Suppurativa Clinical Response (HiSCR) is a dynamic, validated endpoint for clinical trials, specifically designed to measure treatment response in HS. It provides a sensitive, binary outcome that reflects meaningful clinical improvement by focusing on the reduction of inflammatory lesions while ensuring that new abscesses or draining tunnels do not develop.",
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  rationale: "The HiSCR was developed as a dynamic, validated endpoint for clinical trials, specifically to measure treatment response in HS. It provides a sensitive, binary outcome that reflects meaningful clinical improvement, focusing on the reduction of inflammatory lesions while ensuring that new abscesses or draining tunnels do not develop.",
  clinicalPerformance: "HiSCR has been validated as a sensitive and meaningful measure of clinical improvement, with strong correlation to both physician- and patient-reported outcomes. Test-retest reliability of the AN count is high (0.91), and HiSCR is more responsive to change than the HS-PGA in clinical trial populations. Achieving HiSCR is associated with significant improvements in quality of life (DLQI, HiSQOL) and pain scores. However, HiSCR is limited to patients with at least three ANs at baseline and does not account for non-inflammatory lesions, scarring, or quality of life. It may not fully capture the burden of disease in patients with predominantly draining tunnels or extensive scarring.",
  formSections: [
      {
          id: "hiscr_baseline_group", title: "Baseline Assessment (Prior to Treatment Start)", gridCols: 1,
          inputs: [
              { id: "baselineAbscesses", label: "Baseline Abscess (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "baselineNodules", label: "Baseline Inflammatory Nodule (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "baselineFistulas", label: "Baseline Draining Fistula (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      },
      {
          id: "hiscr_followup_group", title: "Follow-up Assessment (At Evaluation Timepoint)", gridCols: 1,
          inputs: [
              { id: "followupAbscesses", label: "Follow-up Abscess (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "followupNodules", label: "Follow-up Inflammatory Nodule (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "followupFistulas", label: "Follow-up Draining Fistula (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      }
  ],
  calculationLogic: (inputs) => {
    const baselineAbscesses = Number(inputs.baselineAbscesses) || 0;
    const baselineNodules = Number(inputs.baselineNodules) || 0;
    const baselineFistulas = Number(inputs.baselineFistulas) || 0;
    const followupAbscesses = Number(inputs.followupAbscesses) || 0;
    const followupNodules = Number(inputs.followupNodules) || 0;
    const followupFistulas = Number(inputs.followupFistulas) || 0;

    const baselineAN = baselineAbscesses + baselineNodules;
    const followupAN = followupAbscesses + followupNodules;

    let anReductionPercentage = 0;
    if (baselineAN > 0) {
      anReductionPercentage = ((baselineAN - followupAN) / baselineAN) * 100;
    } else if (followupAN === 0) {
      anReductionPercentage = 100;
    }

    const anReductionMet = anReductionPercentage >= 50;
    const noAbscessIncrease = followupAbscesses <= baselineAbscesses;
    const noFistulaIncrease = followupFistulas <= baselineFistulas;

    const isAchieved = anReductionMet && noAbscessIncrease && noFistulaIncrease;
    const score = isAchieved ? 1 : 0; // 1 for Achieved, 0 for Not Achieved

    const interpretation = isAchieved ?
      `HiSCR Achieved: At least 50% reduction in AN count (${anReductionPercentage.toFixed(1)}%) with no increase in abscesses and no increase in draining fistulas.` :
      `HiSCR Not Achieved.
      - AN count reduction ≥50%: ${anReductionMet ? 'Yes' : 'No'} (${anReductionPercentage.toFixed(1)}% reduction from baseline AN count of ${baselineAN})
      - No increase in abscess count: ${noAbscessIncrease ? 'Yes' : 'No'} (Baseline: ${baselineAbscesses}, Follow-up: ${followupAbscesses})
      - No increase in draining fistula count: ${noFistulaIncrease ? 'Yes' : 'No'} (Baseline: ${baselineFistulas}, Follow-up: ${followupFistulas})`;

    return {
      score,
      interpretation,
      details: {
        Baseline_AN_Count: baselineAN,
        Followup_AN_Count: followupAN,
        AN_Reduction_Met: anReductionMet ? "Yes" : "No",
        Percent_AN_Reduction: parseFloat(anReductionPercentage.toFixed(1)),
        No_Abscess_Increase_Met: noAbscessIncrease ? "Yes" : "No",
        No_Fistula_Increase_Met: noFistulaIncrease ? "Yes" : "No",
        HiSCR_Status: isAchieved ? "Achieved" : "Not Achieved"
      }
    };
  },
  references: [
    "Kimball AB, Sobell JM, Zouboulis CC, et al. HiSCR (Hidradenitis Suppurativa Clinical Response): a novel clinical endpoint to evaluate therapeutic outcomes in patients with hidradenitis suppurativa from the placebo-controlled portion of a phase 2 adalimumab study. J Eur Acad Dermatol Venereol. 2016;30(6):989-94.",
    "Kimball AB, Jemec GB, Yang M, et al. Assessing the validity, responsiveness and meaningfulness of the Hidradenitis Suppurativa Clinical Response (HiSCR) as the clinical endpoint for hidradenitis suppurativa treatment. Br J Dermatol. 2014;171(6):1434-42."
  ]
};
