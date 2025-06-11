
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { HeartPulse } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bvasSkinInputs: InputConfig[] = [
    { id: "purpura", label: "Palpable purpura (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "urticaria", label: "Urticarial lesions (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "ulcers", label: "Skin ulceration (2 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "gangrene", label: "Skin gangrene (3 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "infarcts", label: "Skin infarcts (2 pts)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "nodules", label: "Subcutaneous nodules (1 pt)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
];

export const bvasSkinTool: Tool = {
  id: "bvas_skin",
  name: "BVAS - Skin Component",
  acronym: "BVAS Skin",
  description: "Scores skin manifestations for the Birmingham Vasculitis Activity Score (BVAS), a validated instrument to score disease activity in systemic vasculitis, especially ANCA-associated vasculitis. The skin component evaluates lesions attributed to vasculitis. BVAS (version 3) includes multiple skin-related items. Each item carries a point value if present and considered active.",
  condition: "Vasculitis",
  keywords: ["bvas", "vasculitis", "skin involvement", "activity score", "purpura", "ulcer", "gangrene", "infarcts", "anca"],
  sourceType: 'Clinical Guideline',
  icon: HeartPulse,
  formSections: [
    {
      id: "bvas_skin_items_group",
      title: "BVAS Skin Activity Items",
      description: "Select all active skin manifestations of vasculitis present.",
      gridCols: 1, // Or 2 for a wider layout
      inputs: bvasSkinInputs
    }
  ],
  calculationLogic: (inputs) => {
    const weights: Record<string, number> = {
      purpura: 1,
      urticaria: 1,
      ulcers: 2,
      gangrene: 3,
      infarcts: 2,
      nodules: 1
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

    const interpretation = `Skin BVAS Component Score: ${score}. Higher score reflects more active skin vasculitis. This score contributes to the total BVAS.`;
    return { score, interpretation, details };
  },
  references: [
    "Luqmani RA, Bacon PA, Moots RJ, et al. Birmingham Vasculitis Activity Score (BVAS) in systemic necrotizing vasculitis. QJM. 1994;87(11):671-8.",
    "Mukhtyar C, Lee R, Brown D, et al. Modification and validation of the Birmingham Vasculitis Activity Score (version 3). Ann Rheum Dis. 2009;68(12):1827-32.",
    "Suppiah R, et al. Performance of a new tool to assess global disease activity in ANCA-associated vasculitis. Ann Rheum Dis. 2011;70(3):491–498." // References OMERACT Vasculitis Working Group tool
    ]
};
