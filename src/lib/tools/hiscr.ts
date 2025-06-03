
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const hiscrTool: Tool = {
  id: "hiscr",
  name: "HiSCR (Hidradenitis Suppurativa Clinical Response)",
  acronym: "HiSCR",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hiscr", "hs", "hidradenitis suppurativa", "treatment response", "clinical trial"],
  description: "Defines treatment response in HS clinical trials based on changes in abscesses, inflammatory nodules, and draining fistulas.",
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: [
      {
          id: "hiscr_baseline_group", title: "Baseline Assessment", gridCols: 1,
          inputs: [
              { id: "baseline_abscesses", label: "Abscesses (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "baseline_inflammatory_nodules", label: "Inflammatory Nodules (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "baseline_draining_fistulas", label: "Draining Fistulas (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      },
      {
          id: "hiscr_followup_group", title: "Follow-up Assessment", gridCols: 1,
          inputs: [
              { id: "followup_abscesses", label: "Abscesses (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "followup_inflammatory_nodules", label: "Inflammatory Nodules (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
              { id: "followup_draining_fistulas", label: "Draining Fistulas (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
          ]
      }
  ],
  calculationLogic: (inputs) => {
    const Ab = Number(inputs.baseline_abscesses) || 0;
    const INb = Number(inputs.baseline_inflammatory_nodules) || 0;
    const DFb = Number(inputs.baseline_draining_fistulas) || 0;
    const Af = Number(inputs.followup_abscesses) || 0;
    const INf = Number(inputs.followup_inflammatory_nodules) || 0;
    const DFf = Number(inputs.followup_draining_fistulas) || 0;

    const AINb = Ab + INb;
    const AINf = Af + INf;

    let reductionAIN = 0;
    if (AINb > 0) {
      reductionAIN = (AINb - AINf) / AINb;
    } else if (AINf === 0) {
      reductionAIN = 1.0;
    }

    const criterion1_reduction = reductionAIN >= 0.5;
    const criterion2_no_increase_A = Af <= Ab;
    const criterion3_no_increase_DF = DFf <= DFb;

    const achieved = criterion1_reduction && criterion2_no_increase_A && criterion3_no_increase_DF;
    const score = achieved ? 1 : 0;

    const interpretation = `HiSCR: ${achieved ? "Achieved" : "Not Achieved"}. Criteria: 1. ≥50% reduction in (Abscesses + Inflammatory Nodules) count: ${criterion1_reduction ? "Yes" : "No"} (${(reductionAIN * 100).toFixed(1)}% reduction). 2. No increase in Abscess count from baseline: ${criterion2_no_increase_A ? "Yes" : "No"}. 3. No increase in Draining Fistula count from baseline: ${criterion3_no_increase_DF ? "Yes" : "No"}.`;

    return {
      score,
      interpretation,
      details: {
        AIN_Reduction_Percent: parseFloat((reductionAIN * 100).toFixed(1)),
        Criterion1_AIN_Reduction_Met: criterion1_reduction ? "Yes" : "No",
        Criterion2_No_Abscess_Increase_Met: criterion2_no_increase_A ? "Yes" : "No",
        Criterion3_No_Fistula_Increase_Met: criterion3_no_increase_DF ? "Yes" : "No",
        Baseline_A_plus_IN: AINb,
        Followup_A_plus_IN: AINf,
      }
    };
  },
  references: ["Kimball AB, et al. Hidradenitis suppurativa: a disease with U.S. prevalence of 1% to 4% that requires new therapies. J Am Acad Dermatol. 2014.", "Original definition often cited in clinical trial protocols for HS therapies."]
};
