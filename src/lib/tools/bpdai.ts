
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const bpdaiTool: Tool = {
  id: "bpdai",
  name: "Bullous Pemphigoid Disease Area Index",
  acronym: "BPDAI",
  description: "The BPDAI quantifies disease activity in bullous pemphigoid (BP). It was introduced by Murrell et al. (J Am Acad Dermatol 2012) and is analogous to PASI for psoriasis and ABSIS for pemphigus. The BPDAI consists of objective measures for skin activity (erosions/blisters and urticaria/erythema) and mucosal activity. The total BPDAI activity score is the sum of these skin and mucosal activity subscores (range 0–252). Pruritus and damage (post-inflammatory changes) are often scored separately and are not included in this activity score calculation. Severity cut-offs based on a version (e.g., Masmoudi et al. 2021) are: mild (≤19), moderate (20–56), severe (≥57).",
  condition: "Bullous Pemphigoid",
  keywords: ["bpdai", "bullous pemphigoid", "lesion scoring", "mucosal involvement", "urticaria", "erythema", "blister", "activity index", "pruritus"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: [
    {
      id: 'bpdai_skin_blisters_group',
      title: 'Skin Activity - Blisters/Erosions',
      gridCols: 1,
      inputs: [
        {
          id: "skinBlistersErosions",
          label: "Blisters/Erosions Score (0–120)",
          type: 'number',
          min: 0,
          max: 120,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Enter the sum of scores for blisters/erosions across all body regions based on standard BPDAI methodology."
        }
      ]
    },
    {
      id: 'bpdai_skin_erythema_group',
      title: 'Skin Activity - Urticarial Plaques/Erythema',
      gridCols: 1,
      inputs: [
        {
          id: "skinUrticariaErythema",
          label: "Urticarial Plaques/Erythema Score (0–120)",
          type: 'number',
          min: 0,
          max: 120,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Enter the sum of scores for urticarial plaques/erythema across all body regions based on standard BPDAI methodology."
        }
      ]
    },
    {
      id: 'bpdai_mucosal_group',
      title: 'Mucosal Involvement',
      gridCols: 1,
      inputs: [
        {
          id: "mucosalActivity",
          label: "Mucosal Activity Score (0–12)",
          type: 'number',
          min: 0,
          max: 12,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 12),
          description: "Enter the score for mucosal involvement (blisters/erosions) based on standard BPDAI methodology."
        }
      ]
    }
  ],
  calculationLogic: (inputs) => {
    const skinBlisters = Number(inputs.skinBlistersErosions) || 0;
    const skinErythema = Number(inputs.skinUrticariaErythema) || 0;
    const mucosal = Number(inputs.mucosalActivity) || 0;
    const totalScore = skinBlisters + skinErythema + mucosal;

    let severityCategory = "Undefined";
    if (totalScore <= 19) severityCategory = "Mild BP";
    else if (totalScore <= 56) severityCategory = "Moderate BP";
    else severityCategory = "Severe BP";

    const interpretation = `Total BPDAI Activity Score: ${totalScore} (Range: 0-252).\nSeverity Category: ${severityCategory}.\n(Based on cut-offs: Mild ≤19, Moderate 20–56, Severe ≥57).`;

    return {
      score: totalScore,
      interpretation,
      details: {
        Skin_Blisters_Erosions_Subtotal: skinBlisters,
        Skin_Urticarial_Erythema_Subtotal: skinErythema,
        Mucosal_Involvement_Subtotal: mucosal,
        Total_BPDAI_Activity_Score: totalScore,
        Severity_Category: severityCategory,
      }
    };
  },
  references: [
    "Murrell DF, Daniel BS, Joly P, et al. Definitions and outcome measures for bullous pemphigoid: recommendations by an international group of experts. J Am Acad Dermatol. 2012 Mar;66(3):479-85.",
    "Murrell DF, et al. Validation of the Bullous Pemphigoid Disease Area Index. J Am Acad Dermatol. 2012;66(4):617–624.e1.",
    "Masmoudi W, Vaillant M, Vassileva S, et al. Severity strata for the Bullous Pemphigoid Disease Area Index. Br J Dermatol. 2021;184(6):1106-1112. doi:10.1111/bjd.19611."
  ]
};
