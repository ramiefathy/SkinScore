
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const aasSwellingCountOptions: InputOption[] = [
  { value: 0, label: "0 swellings" },
  { value: 1, label: "1 swelling" },
  { value: 2, label: "2–3 swellings" },
  { value: 3, label: "≥4 swellings" }
];
const aasDurationOptions: InputOption[] = [
  { value: 0, label: "<1 hour" },
  { value: 1, label: "1–6 hours" },
  { value: 2, label: "6–12 hours" },
  { value: 3, label: ">12 hours" }
];
const aasSeverityOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Mild" },
  { value: 2, label: "2 - Moderate" },
  { value: 3, label: "3 - Severe" }
];
const aasTreatmentOptions: InputOption[] = [
    { value: 0, label: "No extra treatment" },
    { value: 1, label: "Antihistamine dose increase" },
    { value: 2, label: "ER visit or corticosteroids" },
    { value: 3, label: "Hospitalization required" }
];
const aasImpactOptions: InputOption[] = [
    { value: 0, label: "No impact" },
    { value: 1, label: "Mild inconvenience" },
    { value: 2, label: "Moderate, some tasks avoided" },
    { value: 3, label: "Severe, unable to perform many tasks" }
];


export const aasTool: Tool = {
  id: "aas",
  name: "Angioedema Activity Score (AAS)",
  acronym: "AAS",
  condition: "Angioedema",
  keywords: ["aas", "angioedema", "activity score", "patient reported", "urticaria", "swelling"],
  description: "The AAS is a patient-reported daily diary tool used to quantify disease activity in recurrent angioedema (with or without chronic urticaria). Developed by Weller et al. (2013), it captures daily angioedema burden. It's recommended by international urticaria guidelines. Scores can be aggregated (AAS7, AAS28) for longer-term activity.",
  sourceType: 'Research',
  icon: Activity,
  formSections: [
    {id:"swellingCount", label:"1. Number of angioedema swellings today?", type:"select", options:aasSwellingCountOptions, defaultValue:0, validation:getValidationSchema('select',aasSwellingCountOptions,0,3)},
    {id:"duration", label:"2. Longest swelling duration today?", type:"select", options:aasDurationOptions, defaultValue:0, validation:getValidationSchema('select',aasDurationOptions,0,3)},
    {id:"severity", label:"3. Severity of swelling(s) (pain/functional impact) today?", type:"select", options:aasSeverityOptions, defaultValue:0, validation:getValidationSchema('select',aasSeverityOptions,0,3)},
    {id:"treatment", label:"4. Extra medications needed for angioedema today?", type:"select", options:aasTreatmentOptions, defaultValue:0, validation:getValidationSchema('select',aasTreatmentOptions,0,3)},
    {id:"impact", label:"5. Impact on daily activities today?", type:"select", options:aasImpactOptions, defaultValue:0, validation:getValidationSchema('select',aasImpactOptions,0,3)}
  ],
  calculationLogic: (inputs) => {
      const dailyScore = (Number(inputs.swellingCount)||0) + (Number(inputs.duration)||0) + (Number(inputs.severity)||0) + (Number(inputs.treatment)||0) + (Number(inputs.impact)||0);
      const interpretation = `Daily AAS Score: ${dailyScore} (Range for one day: 0-15).
Higher score indicates more angioedema activity.
Scores are typically summed over a period (e.g., AAS7 for 7 days, range 0-105; AAS28 for 28 days, range 0-420).
Example AAS7 interpretation: <6 low activity, ≥30 severe activity. A 50% drop in AAS28 is a meaningful clinical response.`;
      return {
        score: dailyScore,
        interpretation,
        details: {
          Swelling_Count_Score: inputs.swellingCount,
          Duration_Score: inputs.duration,
          Severity_Score: inputs.severity,
          Treatment_Needed_Score: inputs.treatment,
          Impact_on_Activities_Score: inputs.impact,
          Daily_AAS_Total: dailyScore
        }
      };
  },
  references: [
    "Weller K, Groffik A, Magerl M, et al. Development and validation of the Angioedema Activity Score. Allergy. 2013;68(9):1185-1192.",
    "Zuberbier T, Aberer W, Asero R, et al. The EAACI/GA²LEN/EDF/WAO guideline for the definition, classification, diagnosis and management of urticaria. Allergy. 2018;73(7):1393-1414.",
    "Kulthanan K, Chularojanamontri L, Tuchinda P, et al. Angioedema Activity Score: Validity and reliability in a Thai population. Asian Pac J Allergy Immunol. 2019;37(2):90-95."
    ]
};

    