
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { HeartPulse } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bvasRashOptions: InputOption[] = [
  { value: 0, label: "0 - Absent" },
  { value: 1, label: "1 - Persistent (present at this visit, but also at last visit without worsening)" },
  { value: 3, label: "3 - New/Worse (new onset or definite worsening since last visit)" }
];

export const bvasSkinTool: Tool = {
  id: "bvas_skin",
  name: "BVAS - Skin Component",
  acronym: "BVAS Skin",
  description: "Scores skin manifestations for the Birmingham Vasculitis Activity Score (BVAS).",
  condition: "Vasculitis",
  keywords: ["bvas", "vasculitis", "skin involvement", "activity score", "rash", "ulcer", "gangrene"],
  sourceType: 'Clinical Guideline',
  icon: HeartPulse,
  formSections: [
    {
      id: "rash_bvas",
      label: "Rash (Purpura, urticaria, other)",
      type: 'select',
      options: bvasRashOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', bvasRashOptions, 0, 3)
    },
    { id: "ulcer_bvas", label: "Skin Ulceration (non-digital, excluding major gangrene) (1 point if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "gangrene_bvas", label: "Major Digital Ischemia/Gangrene (6 points if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "other_skin_bvas", label: "Other Skin Lesions (e.g., nodules, livedo - 1 point if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
  ],
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, string> = {};
    const rashScore = Number(inputs.rash_bvas) || 0;
    score += rashScore;
    details.Rash = `Score ${rashScore}`;

    if (inputs.ulcer_bvas) { score += 1; details.Skin_Ulceration = "Present (1 pt)"; } else { details.Skin_Ulceration = "Absent (0 pts)"; }
    if (inputs.gangrene_bvas) { score += 6; details.Major_Digital_Ischemia_Gangrene = "Present (6 pts)"; } else { details.Major_Digital_Ischemia_Gangrene = "Absent (0 pts)"; }
    if (inputs.other_skin_bvas) { score += 1; details.Other_Skin_Lesions = "Present (1 pt)"; } else { details.Other_Skin_Lesions = "Absent (0 pts)"; }

    const interpretation = `BVAS Skin Component Score: ${score}. This score contributes to the total BVAS. Higher score indicates greater skin-related vasculitis activity. (Note: Scoring assumes new/worse for checkbox items if checked).`;
    return { score, interpretation, details };
  },
  references: ["Luqmani RA, et al. Birmingham Vasculitis Activity Score (BVAS) in systemic necrotizing vasculitis. QJM. 1994.", "Mukhtyar C, et al. Modification and validation of the Birmingham Vasculitis Activity Score (version 3). Ann Rheum Dis. 2009."]
};
