
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { AlignLeft } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hurleyStageOptions: InputOption[] = [
  { value: 1, label: "Stage I: Solitary or multiple abscesses without sinus tracts or scarring." },
  { value: 2, label: "Stage II: Recurrent abscesses with sinus tracts and scarring, single or multiple widely separated lesions." },
  { value: 3, label: "Stage III: Diffuse or near-diffuse involvement, or multiple interconnected sinus tracts and abscesses across an entire area." }
];

export const hurleyStagingHsTool: Tool = {
  id: "hurley_staging_hs",
  name: "Hurley Staging System for Hidradenitis Suppurativa (HS)",
  acronym: "Hurley Staging",
  description: "Developed by H.J. Hurley in 1989, this is a simple, widely used system to classify the long-term, anatomical severity of Hidradenitis Suppurativa based on the presence and extent of scarring and sinus tract formation. It helps guide prognosis and treatment strategy (e.g., medical vs. surgical).",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hurley", "hs", "hidradenitis suppurativa", "staging", "severity", "abscess", "sinus tract", "scarring"],
  sourceType: 'Research',
  icon: AlignLeft,
  displayType: 'staticList',
  formSections: [
    {
      id: "hurley_stage_display", // ID for ToolInfo to potentially find options
      label: "Hurley Stages", // Not directly displayed in form but good for consistency
      type: 'select', // So ToolInfo can find the options list
      options: hurleyStageOptions,
      defaultValue: 1, // Default, though not used for active selection in 'staticList'
      validation: getValidationSchema('select', hurleyStageOptions, 1, 3) // Not used by UI if staticList
    }
  ],
  calculationLogic: (inputs) => { // Not called by UI if displayType='staticList'
    const stage = Number(inputs.hurley_stage) || 1; // inputs.hurley_stage won't be present if displayType='staticList'
    let stageDescription = hurleyStageOptions.find(opt => opt.value === stage)?.label || "Invalid stage selected.";
    let interpretationText = "";
    if (stage === 1) interpretationText = "Mild disease, typically managed medically.";
    else if (stage === 2) interpretationText = "Moderate disease; may require localized surgical intervention in addition to medical therapy.";
    else if (stage === 3) interpretationText = "Severe disease, often requiring extensive surgery and systemic medical treatment.";
    else interpretationText = "Stage not clearly defined.";

    return { score: stage, interpretation: `${stageDescription}\nInterpretation: ${interpretationText}`, details: { stage_description: stageDescription, clinical_implication: interpretationText } };
  },
  references: [
    "Hurley, H. J. (1989). Axillary hyperhidrosis, apocrine bromhidrosis, hidradenitis suppurativa, and familial benign pemphigus: surgical approach. In Dermatologic Surgery (pp. 729-739). Marcel Dekker."
  ]
};
