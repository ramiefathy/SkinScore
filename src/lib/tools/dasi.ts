
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
  description: "The DASI is a validated scoring system for quantifying the severity of dyshidrotic eczema. It assesses vesicles, erythema, desquamation, and itch (each 0–3), plus affected area (1–5).",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["dasi", "dyshidrotic eczema", "pompholyx", "eczema", "atopic dermatitis", "severity"],
  sourceType: 'Clinical Guideline',
  icon: Waves,
  rationale: "The DASI was developed to provide a standardized, quantitative assessment of dyshidrotic eczema, a form of hand eczema characterized by vesicular eruptions on the palms and soles. The rationale for its development was the lack of specific, validated severity indices for this condition, which is often resistant to treatment and requires objective outcome measures for both clinical practice and research. The DASI incorporates both objective and subjective parameters: the number of vesicles per square centimeter, erythema, desquamation, itch, and the extent of the affected area. The calculation is as follows: DASI = (pV + pE + pS + pI) × pA where pV is the score for vesicles, pE for erythema, pS for desquamation, pI for itch, and pA for area. Each component is scored, and the sum is multiplied by the area score to yield the total DASI score.",
  clinicalPerformance: "The original study by Vocks et al. found the DASI to be simple and useful for assessing disease severity and treatment response, but did not provide formal psychometric validation data such as sensitivity, specificity, or inter- and intra-rater reliability. A systematic review by Weistenhöfer et al. included the DASI among 45 hand eczema scoring systems and noted the general lack of published reliability and validation data for most tools, including the DASI. No studies have reported sensitivity or specificity, and there is no evidence of pediatric validation or comparative studies with other indices in children. The DASI remains a potentially useful tool for dyshidrotic eczema in adults, but further research is needed to establish its measurement properties, especially in pediatric populations.",
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
    "Vocks E, Plötz SG, Ring J. The Dyshidrotic Eczema Area and Severity Index - A Score Developed for the Assessment of Dyshidrotic Eczema. Dermatology (Basel, Switzerland). 1999;198(3):265-9. doi:10.1159/000018127.",
    "Weistenhöfer W, Baumeister T, Drexler H, Kütting B. An Overview of Skin Scores Used for Quantifying Hand Eczema: A Critical Update According to the Criteria of Evidence-Based Medicine. The British Journal of Dermatology. 2010;162(2):239-50. doi:10.1111/j.1365-2133.2009.09463.x.",
    "Schmitt J, Langan S, Williams HC. What Are the Best Outcome Measurements for Atopic Eczema? A Systematic Review. The Journal of Allergy and Clinical Immunology. 2007;120(6):1389-98. doi:10.1016/j.jaci.2007.08.011.",
    "Gerbens LA, Prinsen CA, Chalmers JR, et al. Evaluation of the Measurement Properties of Symptom Measurement Instruments for Atopic Eczema: A Systematic Review. Allergy. 2017;72(1):146-163. doi:10.1111/all.12959."
    ]
};
