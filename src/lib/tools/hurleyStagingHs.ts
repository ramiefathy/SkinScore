
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { AlignLeft } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hurleyStageOptions: InputOption[] = [
  { value: 1, label: "Stage I: Recurrent abscesses/nodules, no scarring or sinus tracts." },
  { value: 2, label: "Stage II: Single or multiple widely separated lesions, with sinus tracts and scarring." },
  { value: 3, label: "Stage III: Diffuse or near-diffuse involvement, with multiple interconnected sinus tracts and abscesses." }
];

export const hurleyStagingHsTool: Tool = {
  id: "hurley_staging_hs",
  name: "Hurley Staging System for Hidradenitis Suppurativa (HS)",
  acronym: "Hurley Staging",
  description: "Developed by H.J. Hurley in 1989, this is a simple, widely used system to classify the long-term, anatomical severity of Hidradenitis Suppurativa. It is a static, three-stage classification based on the presence and extent of sinus tracts, scarring, and coalescent lesions. Hurley staging helps guide prognosis and therapeutic decisions, but lacks sensitivity to change and does not quantify inflammatory burden.",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hurley", "hs", "hidradenitis suppurativa", "staging", "severity", "abscess", "sinus tract", "scarring"],
  sourceType: 'Research',
  icon: AlignLeft,
  displayType: 'staticList',
  formSections: [
    {
      id: "hurley_stage_display",
      label: "Hurley Stages",
      type: 'select',
      options: hurleyStageOptions,
      defaultValue: 1,
      validation: getValidationSchema('select', hurleyStageOptions, 1, 3)
    }
  ],
  calculationLogic: (inputs) => {
    const stage = Number(inputs.hurley_stage) || 1;
    let stageDescriptionObj = hurleyStageOptions.find(opt => opt.value === stage);
    let stageDescription = stageDescriptionObj ? stageDescriptionObj.label : "Invalid stage selected.";
    
    let clinicalImplication = "";
    if (stage === 1) clinicalImplication = "Mild disease, typically managed medically.";
    else if (stage === 2) clinicalImplication = "Moderate disease; may require localized surgical intervention in addition to medical therapy.";
    else if (stage === 3) clinicalImplication = "Severe disease, often requiring extensive surgery and systemic medical treatment.";
    else clinicalImplication = "Stage not clearly defined.";

    const interpretation = `${stageDescription}\nClinical Implication: ${clinicalImplication}`;
    return { score: stage, interpretation, details: { stage_description: stageDescription, clinical_implication: clinicalImplication } };
  },
  references: [
    "Hurley, H. J. (1989). Axillary hyperhidrosis, apocrine bromhidrosis, hidradenitis suppurativa, and familial benign pemphigus: surgical approach. In Dermatologic Surgery (pp. 729-739). Marcel Dekker."
  ]
};

