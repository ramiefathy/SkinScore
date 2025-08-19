import type { Tool, InputConfig, FormSectionConfig, InputGroupConfig } from '../types';
import { SearchCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const abcdeCriteriaInputs: InputConfig[] = [
  { id: "A_asymmetry", label: "A - Asymmetry (one half of the mole doesn't match the other)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "B_border", label: "B - Border irregularity (edges are ragged, notched, or blurred)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "C_color", label: "C - Color variegation (color is not uniform, with shades of tan, brown, black, or sometimes white, red, or blue)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "D_diameter", label: "D - Diameter greater than 6mm (about the size of a pencil eraser)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "E_evolving", label: "E - Evolving (mole changes in size, shape, color, elevation, or any new symptom such as bleeding, itching or crusting)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
];

export const abcdeMelanomaTool: Tool = {
  id: "abcde_melanoma",
  name: "ABCDE Rule for Melanoma",
  acronym: "ABCDE",
  description: "A clinical screening mnemonic for common signs of melanoma (Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolving). The presence of one or more features raises suspicion. Sensitivity is ~90% overall, but specificity is moderate. Diameter and Evolution are highly sensitive features (~84-90%).",
  condition: "Melanoma Screening",
  keywords: ["abcde", "melanoma", "skin cancer", "screening", "mole", "nevus", "early detection", "friedman"],
  sourceType: 'Research',
  icon: SearchCheck,
  formSections: [
    {
      id: 'abcde_criteria_group',
      title: 'ABCDE Criteria Evaluation',
      gridCols: 1,
      inputs: abcdeCriteriaInputs
    } as InputGroupConfig
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
      interpretation = `Warning: ${features.join(', ')} present. ${score} feature(s) noted. Lesion requires further evaluation by a healthcare professional. Presence of ≥1 criterion warrants evaluation; ≥2 criteria suggests high suspicion.`;
    } else {
      interpretation = "No ABCDE signs noted. Continue regular skin checks.";
    }
    return { score, interpretation, details: { positive_features: features.join(', ') || 'None', criteria_met_count: score } };
  },
  references: [
    "Friedman RJ, Rigel DS, Kopf AW. Early detection of malignant melanoma: the role of physician examination and self-examination of the skin. CA Cancer J Clin. 1985;35(3):130-51.",
    "Rigel DS, Friedman RJ, Kopf AW, et al. ABCDE--an evolving concept for the early detection of melanoma. Arch Dermatol. 2004;140(8):1030-1031. (Incorrect reference for E, was Abbasi et al. JAMA. 2004 Dec 8;292(22):2771-6.)",
    "Abbasi NR, Shaw HM, Rigel DS, et al. Early diagnosis of cutaneous melanoma: revisiting the ABCD criteria. JAMA. 2004 Dec 8;292(22):2771-6.",
    "American Academy of Dermatology recommendations.",
    "Simpson S. Expanding the ABCDEs of melanoma: a guide to recognizing suspicious skin lesions. AMA J Ethics. 2006;8(11):755-758."
  ]
};
