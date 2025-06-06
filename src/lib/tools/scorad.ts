
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ScalingIcon } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scoradIntensityOptions: InputOption[] = [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}];

export const scoradTool: Tool = {
  id: "scorad",
  name: "SCORing Atopic Dermatitis (SCORAD)",
  acronym: "SCORAD",
  description: "Comprehensive assessment of extent and severity of atopic dermatitis (AD). Uses Rule of Nines for extent.",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["scorad", "atopic dermatitis", "ad", "eczema", "severity", "extent"],
  sourceType: 'Expert Consensus',
  icon: ScalingIcon,
  formSections: [
    {
      id: "scorad_group_a", title: "Part A: Extent (BSA %)", gridCols: 1,
      inputs: [
          { id: "A_extent", label: "Body Surface Area Involved (%)", type: 'number', min: 0, max: 100, defaultValue: 0, description: "Use Rule of Nines to estimate total % BSA affected by eczema.", validation: getValidationSchema('number',undefined,0,100) }
      ]
    },
    {
      id: "scorad_group_b", title: "Part B: Intensity (Average of 6 Signs)", gridCols:3,
      description: "Assess the average intensity of each sign over affected areas (0=None, 1=Mild, 2=Moderate, 3=Severe).",
      inputs: [
          { id: "B_erythema", label: "Erythema", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "B_oedema", label: "Oedema/Papulation", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "B_oozing", label: "Oozing/Crusting", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "B_excoriations", label: "Excoriations", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "B_lichenification", label: "Lichenification", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "B_dryness", label: "Dryness (non-inflamed)", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
      ]
    },
    {
      id: "scorad_group_c", title: "Part C: Subjective Symptoms (VAS 0-10)", gridCols:2,
      description: "Patient to rate average over last 3 days/nights (0=None, 10=Maximal).",
      inputs: [
          { id: "C_pruritus", label: "Pruritus (Itch)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
          { id: "C_sleeplessness", label: "Sleeplessness", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
      ]
    }
  ],
  calculationLogic: (inputs) => {
      const A = Number(inputs.A_extent) || 0;
      const B_sum = (Number(inputs.B_erythema)||0) + (Number(inputs.B_oedema)||0) + (Number(inputs.B_oozing)||0) + (Number(inputs.B_excoriations)||0) + (Number(inputs.B_lichenification)||0) + (Number(inputs.B_dryness)||0);
      const C_sum = (Number(inputs.C_pruritus)||0) + (Number(inputs.C_sleeplessness)||0);
      const scorad = (A/5) + (7*B_sum/2) + C_sum;
      const oScorad = (A/5) + (7*B_sum/2);

      const score = parseFloat(scorad.toFixed(2));
      let interpretation = `SCORAD: ${score} (Range: 0-103). oSCORAD: ${oScorad.toFixed(2)} (Range: 0-83). `;
      if (score < 25) interpretation += "Severity (SCORAD): Mild. "; else if (score < 50) interpretation += "Severity (SCORAD): Moderate. "; else interpretation += "Severity (SCORAD): Severe. ";
      if (oScorad < 15) interpretation += "Severity (oSCORAD): Mild."; else if (oScorad < 40) interpretation += "Severity (oSCORAD): Moderate."; else interpretation += "Severity (oSCORAD): Severe.";

      return { score, interpretation, details: { Part_A_Extent_BSA: A, Part_B_Intensity_Sum_of_6_signs: B_sum, Part_C_Subjective_Symptoms_Sum: C_sum, Calculated_oSCORAD: parseFloat(oScorad.toFixed(2)) } };
  },
  references: ["European Task Force on Atopic Dermatitis. Dermatology. 1993."]
};
