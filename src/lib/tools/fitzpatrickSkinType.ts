
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
  description: "The Fitzpatrick Skin Type Classification is a six-category system (Types I–VI) based on a patient’s self-reported tendency to burn and ability to tan after sun exposure. It is determined by a structured questionnaire or clinical interview, with Type I (always burns, never tans) through Type VI (never burns, deeply pigmented). This classification is clinically significant for predicting risk of photodamage, skin cancer, and response to phototherapy or laser procedures. While widely used, it is subjective and less precise than objective colorimetric methods, and its limitations in diverse populations have been highlighted in recent literature.",
  condition: "Skin Typing",
  keywords: ["fitzpatrick", "skin type", "sun sensitivity", "uv", "tanning", "photodamage", "phototherapy"],
  sourceType: 'Research',
  icon: Sun,
  displayType: 'staticList',
  formSections: [
    {
      id: "fitzpatrick_type", // ID for ToolInfo to potentially find options
      label: "Select Fitzpatrick Skin Type", // Not directly displayed in form but good for consistency
      type: 'select', // So ToolInfo can find the options list
      options: fitzpatrickOptions,
      defaultValue: 3, // Default, though not used for active selection in 'staticList'
      validation: getValidationSchema('select', fitzpatrickOptions,1,6) // Not used by UI if staticList
    }
  ],
  calculationLogic: (inputs) => { // Not called by UI if displayType='staticList'
    const type = Number(inputs.fitzpatrick_type); // inputs.fitzpatrick_type won't be present if displayType='staticList'
    const typeDescriptionObj = fitzpatrickOptions.find(opt => opt.value === type);
    const typeDescription = typeDescriptionObj ? typeDescriptionObj.label : "Invalid type selected.";
    const score = type;
    const interpretation = `Fitzpatrick Skin Type ${type}. Description: ${typeDescription}`;
    return { score, interpretation, details: { classification_description: typeDescription } };
  },
  references: ["Fitzpatrick TB. The validity and practicality of sun-reactive skin types I through VI. Arch Dermatol. 1988;124(6):869-71."]
};

