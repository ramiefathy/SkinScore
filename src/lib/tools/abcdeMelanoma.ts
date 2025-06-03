
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SearchCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const abcdeMelanomaTool: Tool = {
  id: "abcde_melanoma",
  name: "ABCDE Rule for Melanoma",
  acronym: "ABCDE",
  description: "A mnemonic for common signs of melanoma. If any are present, further evaluation is recommended.",
  condition: "Melanoma Screening",
  keywords: ["abcde", "melanoma", "skin cancer", "screening", "mole"],
  sourceType: 'Research',
  icon: SearchCheck,
  formSections: [
    { id: "A_asymmetry", label: "A - Asymmetry (one half of the mole doesn't match the other)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "B_border", label: "B - Border irregularity (edges are ragged, notched, or blurred)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "C_color", label: "C - Color variegation (color is not uniform, with shades of tan, brown, black, or sometimes white, red, or blue)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "D_diameter", label: "D - Diameter greater than 6mm (about the size of a pencil eraser)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "E_evolving", label: "E - Evolving (mole changes in size, shape, color, elevation, or another trait, or any new symptom such as bleeding, itching or crusting)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
  ],
  calculationLogic: (inputs) => {
    const features: string[] = [];
    if (inputs.A_asymmetry) features.push("Asymmetry");
    if (inputs.B_border) features.push("Border irregularity");
    if (inputs.C_color) features.push("Color variegation");
    if (inputs.D_diameter) features.push("Diameter >6mm");
    if (inputs.E_evolving) features.push("Evolving");

    const score = features.length;
    let interpretation = "";
    if (score > 0) {
      interpretation = `Warning: ${features.join(', ')} present. ${score} feature(s) noted. Lesion requires further evaluation by a healthcare professional.`;
    } else {
      interpretation = "No ABCDE signs noted. Continue regular skin checks.";
    }
    return { score, interpretation, details: { positive_features: features.join(', ') || 'None' } };
  },
  references: ["Rigel DS, et al. J Am Acad Dermatol. 1985. American Academy of Dermatology recommendations."]
};
