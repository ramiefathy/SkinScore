
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Assuming this icon is appropriate
import { getValidationSchema } from '../toolValidation';

const pushExudateOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Light" },
  { value: 2, label: "2 - Moderate" },
  { value: 3, label: "3 - Heavy" }
];

const pushTissueTypeOptions: InputOption[] = [
  { value: 0, label: "0 - Closed (Resurfaced/Epithelialized)" },
  { value: 1, label: "1 - Epithelial Tissue" },
  { value: 2, label: "2 - Granulation Tissue" },
  { value: 3, label: "3 - Slough" },
  { value: 4, label: "4 - Necrotic Tissue" }
];

const pushFormSections: FormSectionConfig[] = [
  {
    id: "push_length_cm",
    label: "Greatest Wound Length (cm) – measure head to toe",
    type: 'number',
    min: 0.0,
    max: 100.0,
    step: 0.1,
    defaultValue: 0,
    validation: getValidationSchema('number', [], 0, 100),
    description: "Measure the greatest head-to-toe length of the wound in centimeters."
  },
  {
    id: "push_width_cm",
    label: "Greatest Wound Width (cm) – measure side to side",
    type: 'number',
    min: 0.0,
    max: 100.0,
    step: 0.1,
    defaultValue: 0,
    validation: getValidationSchema('number', [], 0, 100),
    description: "Measure the greatest side-to-side width of the wound in centimeters."
  },
  {
    id: "push_exudate_amount",
    label: "Exudate Amount",
    type: 'select',
    options: pushExudateOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pushExudateOptions, 0, 3),
    description: "Select the category that best describes the amount of wound exudate."
  },
  {
    id: "push_tissue_type",
    label: "Tissue Type",
    type: 'select',
    options: pushTissueTypeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pushTissueTypeOptions, 0, 4),
    description: "Select the category that best describes the predominant tissue type in the wound bed."
  }
];

export const pushTool: Tool = {
  id: "push",
  name: "Pressure Ulcer Scale for Healing",
  acronym: "PUSH",
  description: "The Pressure Ulcer Scale for Healing (PUSH Tool) is a quick, reliable instrument developed by the National Pressure Injury Advisory Panel (NPIAP) to monitor changes in pressure ulcer status over time by scoring three wound parameters: surface area, exudate amount, and tissue type.",
  condition: "Pressure Ulcer, Chronic Wound, Diabetic Foot Ulcer, Venous Leg Ulcer, Surgical Wound",
  keywords: ["push", "pressure ulcer", "wound healing", "monitoring", "score", "exudate", "tissue type", "surface area"],
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  formSections: pushFormSections,
  calculationLogic: (inputs) => {
    const lengthCm = Number(inputs.push_length_cm) || 0;
    const widthCm = Number(inputs.push_width_cm) || 0;
    const areaCm2 = parseFloat((lengthCm * widthCm).toFixed(2));

    let areaSubScore = 0;
    if (areaCm2 === 0) areaSubScore = 0;
    else if (areaCm2 <= 0.3) areaSubScore = 1;
    else if (areaCm2 <= 0.6) areaSubScore = 2;
    else if (areaCm2 <= 1.0) areaSubScore = 3;
    else if (areaCm2 <= 2.0) areaSubScore = 4;
    else if (areaCm2 <= 3.0) areaSubScore = 5;
    else if (areaCm2 <= 4.0) areaSubScore = 6;
    else if (areaCm2 <= 8.0) areaSubScore = 7;
    else if (areaCm2 <= 12.0) areaSubScore = 8;
    else if (areaCm2 <= 24.0) areaSubScore = 9;
    else if (areaCm2 > 24.0) areaSubScore = 10;

    const exudateSubScore = Number(inputs.push_exudate_amount) || 0;
    const tissueTypeSubScore = Number(inputs.push_tissue_type) || 0;

    const totalPushScore = areaSubScore + exudateSubScore + tissueTypeSubScore;

    let healingStatus = "Undefined";
    if (totalPushScore === 0) healingStatus = "Closed/Healed";
    else if (totalPushScore <= 5) healingStatus = "Minimal impairment (healing well)";
    else if (totalPushScore <= 10) healingStatus = "Moderate impairment (slow/delayed healing)";
    else if (totalPushScore <= 17) healingStatus = "Severe impairment (non-healing or worsening)";


    const interpretation = `Total PUSH Score: ${totalPushScore} (Range: 0–17). Healing Status: ${healingStatus}.
A decreasing score over time indicates improvement.
Area: ${areaCm2.toFixed(2)} cm² (Sub-score: ${areaSubScore}). Exudate: ${exudateSubScore}. Tissue Type: ${tissueTypeSubScore}.`;

    return {
      score: totalPushScore,
      interpretation,
      details: {
        area_cm2: areaCm2.toFixed(2),
        area_sub_score: areaSubScore,
        exudate_amount_sub_score: exudateSubScore,
        tissue_type_sub_score: tissueTypeSubScore,
        total_push_score: totalPushScore,
        healing_status_category: healingStatus
      }
    };
  },
  references: [
    "National Pressure Injury Advisory Panel. Pressure Ulcer Scale for Healing (PUSH) Tool Version 3.0. Published 9/15/98.",
    "Stotts NA, Rodeheaver GT, Edsberg LE, Moore T. A prospective study of the Pressure Ulcer Scale for Healing (PUSH). Adv Wound Care. 2005;18(5):367–373.",
    "Choi EPH, Chin WY, Wan EYF, Lam CLK. Evaluation of the internal and external responsiveness of the Pressure Ulcer Scale for Healing (PUSH) tool for assessing acute and chronic wounds. J Adv Nurs. 2016;72(3):234–243."
  ]
};
