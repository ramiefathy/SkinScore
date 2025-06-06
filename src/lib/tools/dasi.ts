
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Waves } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const dasiSeverityOptions: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];
const dasiVesiclesOptions: InputOption[] = [{value:0,label:"0 (None)"},{value:1,label:"1 (1-10/cm²)"},{value:2,label:"2 (11-30/cm²)"},{value:3,label:"3 (>30/cm²)"}];

export const dasiTool: Tool = {
  id: "dasi",
  name: "Dyshidrotic Eczema Area and Severity Index (DASI)",
  acronym: "DASI",
  condition: "Atopic Dermatitis / Eczema", // Updated condition
  keywords: ["dasi", "dyshidrotic eczema", "pompholyx", "eczema", "atopic dermatitis", "severity"], // Added keywords
  description: "Assesses severity of dyshidrotic eczema (pompholyx).",
  sourceType: 'Clinical Guideline',
  icon: Waves,
  formSections: [
    { id:"vesicles_cm2", label:"Vesicles/cm² (V)", type:'select', options: dasiVesiclesOptions, defaultValue:0, validation: getValidationSchema('select', dasiVesiclesOptions, 0,3) },
    { id:"erythema", label:"Erythema (E)", type:'select', options: dasiSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSeverityOptions, 0,3) },
    { id:"desquamation", label:"Desquamation (D)", type:'select', options: dasiSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSeverityOptions, 0,3) },
    { id:"itching", label:"Itching (I) - past 24h", type:'select', options: dasiSeverityOptions, defaultValue:0, validation: getValidationSchema('select', dasiSeverityOptions, 0,3) },
    { id:"extension_percent", label:"Extension % (Ext)", type:'number', min:0, max:100, defaultValue:0, description:"Percentage of hands/feet affected.", validation: getValidationSchema('number',undefined,0,100)}
  ],
  calculationLogic: (inputs) => {
      const V = Number(inputs.vesicles_cm2) || 0;
      const E = Number(inputs.erythema) || 0;
      const D = Number(inputs.desquamation) || 0;
      const I = Number(inputs.itching) || 0;
      const Ext_raw = Number(inputs.extension_percent) || 0;

      let Ext_score = 0;
      if (Ext_raw === 0) Ext_score = 0;
      else if (Ext_raw <= 10) Ext_score = 1;
      else if (Ext_raw <= 25) Ext_score = 2;
      else if (Ext_raw <= 50) Ext_score = 3;
      else if (Ext_raw <= 75) Ext_score = 4;
      else Ext_score = 5;

      const dasiScore = (V + E + D + I) * Ext_score;

      let interpretation = `DASI Score: ${dasiScore} (Range: 0-60). `;
      if (dasiScore === 0) interpretation += "Clear.";
      else if (dasiScore <= 15) interpretation += "Mild dyshidrotic eczema.";
      else if (dasiScore <= 30) interpretation += "Moderate dyshidrotic eczema.";
      else interpretation += "Severe dyshidrotic eczema.";
      interpretation += " (Severity bands: 0 Clear, 1-15 Mild, 16-30 Moderate, 31-60 Severe)";

      return { score: dasiScore, interpretation, details: { V, E, D, I, Ext_raw_Percentage: Ext_raw, Extension_Score_0_5: Ext_score } };
  },
  references: ["Vocks E, et al. Dermatology. 2000;201(3):200-4."]
};
