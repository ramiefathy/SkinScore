
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { AlignLeft } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hurleyStageOptions: InputOption[] = [
  { value: 1, label: "Stage 1: Abscess formation (single or multiple) without sinus tracts and cicatrization (scarring)." },
  { value: 2, label: "Stage 2: Recurrent abscesses with tract formation and cicatrization. Single or multiple widely separated lesions." },
  { value: 3, label: "Stage 3: Diffuse or almost diffuse involvement, or multiple interconnected tracts and abscesses across an entire area." }
];

export const hurleyStagingHsTool: Tool = {
  id: "hurley_staging_hs",
  name: "Hurley Staging System for Hidradenitis Suppurativa (HS)",
  acronym: "Hurley Staging",
  description: "A simple clinical staging system to classify the severity of Hidradenitis Suppurativa.",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hurley", "hs", "hidradenitis suppurativa", "staging", "severity"],
  sourceType: 'Research',
  icon: AlignLeft,
  formSections: [
    {
      id: "hurley_stage",
      label: "Select Hurley Stage",
      type: 'select',
      options: hurleyStageOptions,
      defaultValue: 1,
      validation: getValidationSchema('select',hurleyStageOptions,1,3)
    }
  ],
  calculationLogic: (inputs) => {
    const stage = Number(inputs.hurley_stage);
    let interpretation = `Hurley Stage ${stage}. `;
    const stageDescriptions: Record<number, string> = {
      1: "Stage 1 indicates abscess formation (single or multiple) without sinus tracts and scarring. Typically considered Mild HS.",
      2: "Stage 2 indicates recurrent abscesses with tract formation and scarring, with single or multiple widely separated lesions. Typically considered Moderate HS.",
      3: "Stage 3 indicates diffuse or almost diffuse involvement, or multiple interconnected tracts and abscesses across an entire area. Typically considered Severe HS."
    };
    interpretation += stageDescriptions[stage] || "Invalid stage selected.";
    return { score: stage, interpretation, details: { stage_description: stageDescriptions[stage] || "N/A" } };
  },
  references: ["Hurley HJ. Dermatol Surg. 1989;15(6):557-61."]
};
