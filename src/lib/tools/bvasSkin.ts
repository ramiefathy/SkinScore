
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
  description: "BVAS is a validated instrument to score disease activity in systemic vasculitis, especially ANCA-associated vasculitis. The skin component evaluates lesions attributed to vasculitis (e.g. purpura, ulcers, gangrene, infarcts). BVAS (version 3) includes up to 9 skin-related items. Each item carries a point value if present and considered active. This tool represents common skin items.",
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
    "Suppiah R, et al. Performance of a new tool to assess global disease activity in ANCA-associated vasculitis. Ann Rheum Dis. 2011;70(3):491–498." // References OMERACT Vasculitis Working Group tool
    ]
};
