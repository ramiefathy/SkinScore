
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const bpdaiTool: Tool = {
  id: "bpdai",
  name: "Bullous Pemphigoid Disease Area Index",
  acronym: "BPDAI",
  description: "BPDAI was developed to quantify disease severity in bullous pemphigoid (BP), distinguishing between skin activity (blisters/erosions and urticarial/erythema components) and mucosal activity. The total score ranges from 0-252. It has high interobserver reliability and correlates well with anti-BP180 titers and physician global assessment.",
  condition: "Bullous Pemphigoid",
  keywords: ["bpdai", "bullous pemphigoid", "lesion scoring", "mucosal involvement", "urticaria", "erythema", "blister", "activity index", "pruritus"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: [
    {
      id: 'bpdai_skin_blisters_group',
      title: 'Skin Activity - Blisters/Erosions (Max 120)',
      gridCols: 1,
      inputs: [
        {
          id: "skinBlisters",
          label: "Skin activity (blisters/erosions score)",
          type: 'number',
          min: 0,
          max: 120,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Enter the sum of scores for blisters/erosions across all body regions."
        }
      ]
    },
    {
      id: 'bpdai_skin_erythema_group',
      title: 'Skin Activity - Urticarial Plaques/Erythema (Max 120)',
      gridCols: 1,
      inputs: [
        {
          id: "skinErythema",
          label: "Skin activity (urticarial/erythema score)",
          type: 'number',
          min: 0,
          max: 120,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Enter the sum of scores for urticarial plaques/erythema across all body regions."
        }
      ]
    },
    {
      id: 'bpdai_mucosal_group',
      title: 'Mucosal Involvement (Max 12)',
      gridCols: 1,
      inputs: [
        {
          id: "mucosal",
          label: "Mucosal involvement score",
          type: 'number',
          min: 0,
          max: 12,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 12),
          description: "Enter the score for mucosal involvement."
        }
      ]
    }
  ],
  calculationLogic: (inputs) => {
    const skinBlisters = Number(inputs.skinBlisters) || 0;
    const skinErythema = Number(inputs.skinErythema) || 0;
    const mucosal = Number(inputs.mucosal) || 0;
    const totalScore = skinBlisters + skinErythema + mucosal; // Max 120 + 120 + 12 = 252

    let severityCategory = "Undefined";
    if (totalScore === 0) severityCategory = "No activity/Remission";
    else if (totalScore < 20) severityCategory = "Mild BP";
    else if (totalScore <= 50) severityCategory = "Moderate BP";
    else severityCategory = "Severe BP";

    const interpretation = `Total BPDAI Score: ${totalScore} (Range: 0-252).\nSeverity Category (Example): ${severityCategory}.\n(Bands example: <20 Mild; 20-50 Moderate; >50 Severe).`;

    return {
      score: totalScore,
      interpretation,
      details: {
        Skin_Blisters_Erosions_Subtotal: skinBlisters,
        Skin_Urticarial_Erythema_Subtotal: skinErythema,
        Mucosal_Involvement_Subtotal: mucosal,
        Total_BPDAI_Activity_Score: totalScore,
        Severity_Category_Example: severityCategory,
      }
    };
  },
  references: [
    "Murrell DF, Daniel BS, Joly P, et al. Definitions and outcome measures for bullous pemphigoid: recommendations by an international group of experts. J Am Acad Dermatol. 2012 Mar;66(3):479-85.",
    "Murrell DF, et al. Validation of the Bullous Pemphigoid Disease Area Index. J Am Acad Dermatol. 2012;66(4):617–624.e1."
    // Masmoudi et al. 2020 referenced severity bands for the 0-62 BPDAI version, not this 0-252 one.
  ]
};
