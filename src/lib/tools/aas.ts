
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const aasPartsOptions: InputOption[] = [{value:0,label:"0"},{value:1,label:"1"},{value:2,label:"2"},{value:3,label:"3 or more"}];
const aasDurationOptions: InputOption[] = [{value:0,label:"<1 hour"},{value:1,label:"1-6 hours"},{value:2,label:"6-24 hours"},{value:3,label:">24 hours"}];
const aasSeverityOptions: InputOption[] = [{value:0,label:"0 (None)"},{value:1,label:"1 (Mild)"},{value:2,label:"2 (Moderate)"},{value:3,label:"3 (Severe)"}];
const aasImpactOptions: InputOption[] = [{value:0,label:"0 (Not at all)"},{value:1,label:"1 (A little)"},{value:2,label:"2 (Moderately)"},{value:3,label:"3 (A lot)"}];

export const aasTool: Tool = {
  id: "aas",
  name: "Angioedema Activity Score (AAS)",
  acronym: "AAS",
  condition: "Angioedema",
  keywords: ["aas", "angioedema", "activity score", "patient reported"],
  description: "Patient-reported diary to assess activity of recurrent angioedema. Can be summed over periods (e.g., AAS7, AAS28). This form is for a single representative day.",
  sourceType: 'Research',
  icon: Activity,
  formSections: [
    {id:"aas_parts", label:"1. Number of body parts affected by angioedema today?", type:"select", options:aasPartsOptions, defaultValue:0, validation:getValidationSchema('select',aasPartsOptions,0,3)},
    {id:"aas_duration", label:"2. How long did your angioedema last today (total duration of all episodes)?", type:"select", options:aasDurationOptions, defaultValue:0, validation:getValidationSchema('select',aasDurationOptions,0,3)},
    {id:"aas_severity", label:"3. How severe was your angioedema today (worst episode)?", type:"select", options:aasSeverityOptions, defaultValue:0, validation:getValidationSchema('select',aasSeverityOptions,0,3)},
    {id:"aas_function", label:"4. How much did angioedema interfere with your daily functioning today?", type:"select", options:aasImpactOptions, defaultValue:0, validation:getValidationSchema('select',aasImpactOptions,0,3)},
    {id:"aas_appearance", label:"5. How much did angioedema affect your appearance today?", type:"select", options:aasImpactOptions, defaultValue:0, validation:getValidationSchema('select',aasImpactOptions,0,3)}
  ],
  calculationLogic: (inputs) => {
      const score = (Number(inputs.aas_parts)||0) + (Number(inputs.aas_duration)||0) + (Number(inputs.aas_severity)||0) + (Number(inputs.aas_function)||0) + (Number(inputs.aas_appearance)||0);
      const interpretation = `AAS (for one day): ${score} (Range for one day: 0-15). Higher score indicates more angioedema activity. AAS7 (sum of 7 daily scores) ranges 0-105. AAS28 ranges 0-420.`;
      return { score: score, interpretation, details: { Item1_Parts: inputs.aas_parts, Item2_Duration: inputs.aas_duration, Item3_Severity: inputs.aas_severity, Item4_Function: inputs.aas_function, Item5_Appearance: inputs.aas_appearance } };
  },
  references: ["Weller K, et al. Allergy. 2012."]
};
