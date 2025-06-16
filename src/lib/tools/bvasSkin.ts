
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { HeartPulse } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bvasSkinInputs: InputConfig[] = [
    { id: "purpura", label: "Palpable purpura (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "urticaria", label: "Urticarial lesions (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "ulcers", label: "Skin ulceration (3 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "gangrene", label: "Skin gangrene (6 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "infarcts", label: "Skin infarcts (2 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }, // Assuming weight from previous implementation if not specified again
    { id: "nodules", label: "Subcutaneous nodules (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') } // Assuming weight from previous implementation if not specified again
];

export const bvasSkinTool: Tool = {
  id: "bvas_skin",
  name: "BVAS - Skin Component",
  acronym: "BVAS Skin",
  description: "The BVAS is a validated tool for assessing disease activity in systemic vasculitis, including cutaneous involvement. The skin component includes specific items such as purpura, skin ulceration, gangrene, and other vasculitic lesions. Each item is weighted. The total BVAS (version 3) score is the sum of weighted scores for all active items across nine organ systems (range 0–63). The skin sub-score is the sum of skin-related item weights.",
  condition: "Vasculitis",
  keywords: ["bvas", "vasculitis", "skin involvement", "activity score", "purpura", "ulcer", "gangrene", "infarcts", "anca"],
  sourceType: 'Clinical Guideline',
  icon: HeartPulse,
  formSections: [
    {
      id: "bvas_skin_items_group",
      title: "BVAS Skin Activity Items",
      description: "Select all active skin manifestations of vasculitis present. Points will be assigned based on the item.",
      gridCols: 1,
      inputs: bvasSkinInputs
    }
  ],
  calculationLogic: (inputs) => {
    const weights: Record<string, number> = {
      purpura: 1,
      urticaria: 1, // Kept from previous if not specified, common BVAS item
      ulcers: 3,    // Updated weight
      gangrene: 6,  // Updated weight
      infarcts: 2,  // Kept from previous if not specified
      nodules: 1    // Kept from previous if not specified
    };
    let score = 0;
    const details: Record<string, string> = {};

    for (const key in weights) {
      if (inputs[key]) {
        score += weights[key];
        details[key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')] = `Present (${weights[key]} pt/s)`;
      } else {
        details[key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')] = "Absent (0 pts)";
      }
    }

    const interpretation = `Skin BVAS Component Score: ${score}. Higher score reflects more active skin vasculitis. This score contributes to the total BVAS (v3 range 0-63).`;
    return { score, interpretation, details };
  },
  references: [
    "Mukhtyar C, Lee R, Brown D, et al. Modification and validation of the Birmingham Vasculitis Activity Score (version 3). Ann Rheum Dis. 2009;68(12):1827-32. doi:10.1136/ard.2008.101279.",
    "Luqmani RA, Bacon PA, Moots RJ, et al. Birmingham Vasculitis Activity Score (BVAS) in systemic necrotizing vasculitis. QJM. 1994;87(11):671-8.",
    "Suppiah R, et al. Performance of a new tool to assess global disease activity in ANCA-associated vasculitis. Ann Rheum Dis. 2011;70(3):491–498."
    ]
};
