
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
  description: "The DASI was developed by Vocks et al. (1999) to provide a standardized, reproducible measure for the severity of dyshidrotic eczema (pompholyx), which primarily affects the palms and soles. It assesses a combination of clinical signs and the total area of involvement on the hands and feet.",
  sourceType: 'Clinical Guideline',
  icon: Waves,
  formSections: [
    { id:"vesicleScore", label:"Vesicles (0-3)", type:'select', options: dasiVesiclesOptions, defaultValue:0, validation: getValidationSchema('select', dasiVesiclesOptions, 0,3) },
    { id:"erythemaScore", label:"Erythema (Redness) (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"scalingScore", label:"Desquamation (Scaling) (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"itchScore", label:"Pruritus (Itch) (0-3)", type:'select', options: dasiSignSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSignSeverityOptions, 0,3) },
    { id:"areaScore", label:"Affected Area on Hands/Feet (1-5)", type:'select', options: dasiAreaOptions, defaultValue:1, description:"Area score: 1 (<10%), 2 (10-25%), 3 (26-50%), 4 (51-75%), 5 (>75%)", validation: getValidationSchema('select', dasiAreaOptions, 1,5)}
  ],
  calculationLogic: (inputs) => {
      const vesicleScore = Number(inputs.vesicleScore) || 0;
      const erythemaScore = Number(inputs.erythemaScore) || 0;
      const scalingScore = Number(inputs.scalingScore) || 0;
      const itchScore = Number(inputs.itchScore) || 0;
      const areaScore = Number(inputs.areaScore) || 1;

      const sumOfSigns = vesicleScore + erythemaScore + scalingScore + itchScore;
      const totalDasiScore = sumOfSigns * areaScore;

      let interpretation = `DASI Score: ${totalDasiScore} (Range: 0-60). Higher scores indicate greater severity. Validated severity bands (mild/moderate/severe) are not consistently defined in literature.`;

      return {
        score: totalDasiScore,
        interpretation,
        details: {
          Vesicles_Score: vesicleScore,
          Erythema_Score: erythemaScore,
          Scaling_Score: scalingScore,
          Itch_Score: itchScore,
          Sum_of_Signs: sumOfSigns,
          Area_Score_Multiplier: areaScore,
          Total_DASI_Score: totalDasiScore
        }
      };
  },
  references: ["Vocks, E., Plötz, S. G., & Ring, J. (1999). The Dyshidrotic Eczema Area and Severity Index (DASI) - a new scoring system for pompholyx. Dermatology, 198(3), 265–269."]
};
