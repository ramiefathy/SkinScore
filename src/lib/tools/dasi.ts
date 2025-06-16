
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Waves } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const dasiSignSeverityOptions: InputOption[] = [
  {value:0, label:"0 - None"}, {value:1, label:"1 - Mild"},
  {value:2, label:"2 - Moderate"}, {value:3, label:"3 - Severe"}
];
const dasiVesiclesOptions: InputOption[] = [
  {value:0, label:"0 - None"}, {value:1, label:"1 - Sparse"},
  {value:2, label:"2 - Numerous"}, {value:3, label:"3 - Confluent"}
];
const dasiAreaOptions: InputOption[] = [
  {value:1, label:"1 (<10%)"}, {value:2, label:"2 (10-25%)"},
  {value:3, label:"3 (26-50%)"}, {value:4, label:"4 (51-75%)"},
  {value:5, label:"5 (>75%)"}
];


export const dasiTool: Tool = {
  id: "dasi",
  name: "Dyshidrotic Eczema Area and Severity Index (DASI)",
  acronym: "DASI",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["dasi", "dyshidrotic eczema", "pompholyx", "eczema", "atopic dermatitis", "severity"],
  description: "The DASI is a validated scoring system for quantifying the severity of dyshidrotic eczema, particularly on the hands and feet. It assesses four clinical features: number of vesicles per cm² (V), erythema (E), desquamation (S), and itch (I), each scored 0–3. The area of involvement (A) is scored 1–5 based on percentage of affected skin. Formula: DASI = (pV + pE + pS +pI) × pA.",
  sourceType: 'Clinical Guideline',
  icon: Waves,
  formSections: [
    { id:"vesicleScore", label:"Vesicles (V) Score (0-3)", type:'select', options: dasiVesiclesOptions, defaultValue:0, validation: getValidationSchema('select', dasiVesiclesOptions, 0,3) },
    { id:"erythemaScore", label:"Erythema (E) Score (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"scalingScore", label:"Desquamation (S) Score (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"itchScore", label:"Pruritus (I) Score (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"areaScore", label:"Affected Area (A) Score (1-5)", type:'select', options: dasiAreaOptions, defaultValue:1, description:"Area score based on % of hands/feet: 1 (<10%), 2 (10-25%), 3 (26-50%), 4 (51-75%), 5 (>75%)", validation: getValidationSchema('select', dasiAreaOptions, 1,5)}
  ],
  calculationLogic: (inputs) => {
      const vesicleScore = Number(inputs.vesicleScore) || 0;
      const erythemaScore = Number(inputs.erythemaScore) || 0;
      const scalingScore = Number(inputs.scalingScore) || 0;
      const itchScore = Number(inputs.itchScore) || 0;
      const areaScore = Number(inputs.areaScore) || 1; // Default to 1 if not selected to avoid multiplying by 0

      const sumOfSigns = vesicleScore + erythemaScore + scalingScore + itchScore;
      const totalDasiScore = sumOfSigns * areaScore;

      const interpretation = `DASI score: ${totalDasiScore} (Range: 0-60). Higher scores indicate greater severity. Validated severity strata (mild/moderate/severe) are not consistently defined in literature.`;

      return {
        score: totalDasiScore,
        interpretation,
        details: {
          Vesicles_Score_pV: vesicleScore,
          Erythema_Score_pE: erythemaScore,
          Scaling_Score_pS: scalingScore,
          Itch_Score_pI: itchScore,
          Sum_of_Signs: sumOfSigns,
          Area_Score_Multiplier_pA: areaScore,
          Total_DASI_Score: totalDasiScore
        }
      };
  },
  references: [
    "Vocks E, Plötz SG, Ring J. The Dyshidrotic Eczema Area and Severity Index - A Score Developed for the Assessment of Dyshidrotic Eczema. Dermatology (Basel, Switzerland). 1999;198(3):265-9. doi:10.1159/000018127."
    ]
};
