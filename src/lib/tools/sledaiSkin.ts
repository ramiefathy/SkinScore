
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { FileHeart } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const sledaiSkinTool: Tool = {
  id: "sledai_skin",
  name: "SLEDAI - Skin Descriptors",
  acronym: "SLEDAI Skin",
  description: "Scores specific skin manifestations as part of the Systemic Lupus Erythematosus Disease Activity Index (SLEDAI).",
  condition: "Lupus",
  keywords: ["sledai", "lupus", "sle", "skin descriptors", "disease activity", "rash", "alopecia", "mucosal ulcers", "vasculitis"],
  sourceType: 'Clinical Guideline',
  icon: FileHeart,
  formSections: [
    { id: "rash", label: "Rash (New/Recurrent inflammatory type - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "alopecia", label: "Alopecia (New/Recurrent abnormal, diffuse, or patchy hair loss - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "mucosal_ulcers", label: "Mucosal Ulcers (New/Recurrent oral or nasal - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "vasculitis", label: "Cutaneous Vasculitis (Ulceration, gangrene, tender nodules, purpura, splinter hemorrhages, periungual lesions - 8 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
  ],
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, string> = {};
    if (inputs.rash) { score += 4; details.Rash = "Present (4 pts)"; } else { details.Rash = "Absent (0 pts)"; }
    if (inputs.alopecia) { score += 4; details.Alopecia = "Present (4 pts)"; } else { details.Alopecia = "Absent (0 pts)"; }
    if (inputs.mucosal_ulcers) { score += 4; details.Mucosal_Ulcers = "Present (4 pts)"; } else { details.Mucosal_Ulcers = "Absent (0 pts)"; }
    if (inputs.vasculitis) { score += 8; details.Cutaneous_Vasculitis = "Present (8 pts)"; } else { details.Cutaneous_Vasculitis = "Absent (0 pts)"; }

    const interpretation = `SLEDAI Skin Descriptors Score: ${score}. This score contributes to the total SLEDAI. Higher score indicates greater skin-related disease activity.`;
    return { score, interpretation, details };
  },
  references: ["Bombardier C, et al. Derivation of the SLEDAI. A disease activity index for lupus patients. Arthritis Rheum. 1992.", "Gladman DD, et al. Systemic Lupus Erythematosus Disease Activity Index 2000. J Rheumatol. 2002."]
};
