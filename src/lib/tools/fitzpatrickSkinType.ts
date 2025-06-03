
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Sun } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const fitzpatrickOptions: InputOption[] = [
  { value: 1, label: "Type I: Always burns, never tans (pale white skin; blond or red hair; blue eyes; freckles)." },
  { value: 2, label: "Type II: Usually burns, tans minimally (white skin; fair; blond or red hair; blue, green, or hazel eyes)." },
  { value: 3, label: "Type III: Sometimes mild burn, tans uniformly (cream white skin; fair with any eye or hair color; very common)." },
  { value: 4, label: "Type IV: Burns minimally, always tans well (moderate brown skin; typical Mediterranean Caucasian skin)." },
  { value: 5, label: "Type V: Very rarely burns, tans very easily (dark brown skin; Middle Eastern skin types)." },
  { value: 6, label: "Type VI: Never burns, tans very easily (deeply pigmented dark brown to black skin)." }
];

export const fitzpatrickSkinTypeTool: Tool = {
  id: "fitzpatrick_skin_type",
  name: "Fitzpatrick Skin Type Classification",
  acronym: "Fitzpatrick Scale",
  description: "Classifies skin type based on its reaction to UV light exposure (sunburning and tanning ability).",
  condition: "Skin Typing",
  keywords: ["fitzpatrick", "skin type", "sun sensitivity", "uv", "tanning"],
  sourceType: 'Research',
  icon: Sun,
  formSections: [
    {
      id: "fitzpatrick_type",
      label: "Select Fitzpatrick Skin Type",
      type: 'select',
      options: fitzpatrickOptions,
      defaultValue: 3,
      validation: getValidationSchema('select', fitzpatrickOptions,1,6)
    }
  ],
  calculationLogic: (inputs) => {
    const type = Number(inputs.fitzpatrick_type);
    const typeDescription = fitzpatrickOptions.find(opt => opt.value === type)?.label || "Invalid type selected.";
    const score = type;
    const interpretation = `Fitzpatrick Skin Type ${type}. ${typeDescription}`;
    return { score, interpretation, details: { classification_description: typeDescription } };
  },
  references: ["Fitzpatrick TB. Arch Dermatol. 1988;124(6):869-71."]
};
