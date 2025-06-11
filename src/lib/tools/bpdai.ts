
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const bpdaiTool: Tool = {
  id: "bpdai",
  name: "Bullous Pemphigoid Disease Area Index",
  acronym: "BPDAI",
  description: "BPDAI quantifies disease severity in bullous pemphigoid (BP), distinguishing between skin activity (blisters/erosions and urticarial/erythema components) and mucosal activity. Damage (post-inflammatory changes) is recorded separately and not part of this activity score. Total BPDAI score sums skin blisters (0-120), urticarial/erythema (0-120), and mucosal involvement (0-12), with a max score of 252. It has high interobserver reliability and correlates well with anti-BP180 titers and physician global assessment.",
  condition: "Bullous Pemphigoid",
  keywords: ["bpdai", "bullous pemphigoid", "lesion scoring", "mucosal involvement", "urticaria", "erythema", "blister", "activity index"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: [
    {
      id: "bpdai_skin_activity_group",
      title: "Skin Activity Scores (Pre-calculated sub-scores)",
      description: "Enter the pre-calculated sub-scores for the skin components. Each sub-score ranges from 0-120.",
      gridCols: 1,
      inputs: [
        {
          id: "skin_blisters_score",
          label: "Skin Activity (Blisters/Erosions) Sub-Score",
          type: 'number',
          min: 0,
          max: 120,
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Calculated score for blisters/erosions (0-120)."
        },
        {
          id: "skin_erythema_score",
          label: "Skin Activity (Urticarial/Erythema) Sub-Score",
          type: 'number',
          min: 0,
          max: 120,
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 120),
          description: "Calculated score for urticarial/erythema lesions (0-120)."
        }
      ]
    },
    {
      id: 'bpdai_mucosal_activity_group',
      title: 'Mucosal Involvement Score (Pre-calculated)',
      gridCols: 1,
      inputs: [
        {
          id: `mucosal_involvement_score`,
          label: `Mucosal Involvement Sub-Score`,
          type: 'number',
          min: 0,
          max: 12, // Max 12 for mucosal component as per user's updated schema
          step: 0.1,
          defaultValue: 0,
          validation: getValidationSchema('number', [], 0, 12),
          description: "Calculated score for mucosal involvement (0-12)."
        }
      ]
    }
  ],
  calculationLogic: (inputs) => {
    const skinBlisters = Number(inputs.skin_blisters_score) || 0;
    const skinErythema = Number(inputs.skin_erythema_score) || 0;
    const mucosal = Number(inputs.mucosal_involvement_score) || 0;

    const totalActivityScore = parseFloat((skinBlisters + skinErythema + mucosal).toFixed(1));

    let severityCategory = "Undefined";
    if (totalActivityScore < 20) severityCategory = "Mild BP";
    else if (totalActivityScore <= 50) severityCategory = "Moderate BP";
    else severityCategory = "Severe BP";

    const interpretation = `Total BPDAI Score: ${totalActivityScore} (Max: 252). Severity: ${severityCategory}.
(Severity Bands: <20 Mild; 20-50 Moderate; >50 Severe BP).`;

    return {
      score: totalActivityScore,
      interpretation,
      details: {
        Skin_Blisters_Erosions_Score: skinBlisters,
        Skin_Urticarial_Erythema_Score: skinErythema,
        Mucosal_Involvement_Score: mucosal,
        Total_BPDAI_Activity_Score: totalActivityScore,
        Severity_Category: severityCategory,
      }
    };
  },
  references: [
    "Murrell DF, Daniel BS, Joly P, et al. Definitions and outcome measures for bullous pemphigoid: recommendations by an international group of experts. J Am Acad Dermatol. 2012 Mar;66(3):479-85.", // Original proposal, detailed form
    "Murrell DF, et al. Validation of the Bullous Pemphigoid Disease Area Index. J Am Acad Dermatol. 2012;66(4):617–624.e1.", // Validation
    "Masmoudi W, et al. International validation of BPDAI and calculation of cut-off values defining mild, moderate, and severe BP. Br J Dermatol. 2020;183(2):426–433." // Cut-off values
  ]
};
