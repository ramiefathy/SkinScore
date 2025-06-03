
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { CheckCircle } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const uctQ1Options: InputOption[] = [{value:4,label:"Very much"},{value:3,label:"Much"},{value:2,label:"Moderately"},{value:1,label:"A little"},{value:0,label:"Not at all"}];
const uctQ4Options: InputOption[] = [{value:4,label:"Completely"},{value:3,label:"Well"},{value:2,label:"Moderately"},{value:1,label:"Poorly"},{value:0,label:"Not at all"}];


export const uctTool: Tool = {
  id: "uct",
  name: "Urticaria Control Test (UCT)",
  acronym: "UCT",
  condition: "Urticaria",
  keywords: ["uct", "urticaria", "control", "patient reported"],
  description: "Patient-reported questionnaire to assess urticaria control over the last 4 weeks.",
  sourceType: 'Research',
  icon: CheckCircle,
  formSections: [
    {id:"q1_symptoms", label:"Q1: How much have you suffered from the physical symptoms of urticaria (itch, wheals, swelling) in the last 4 weeks?", type:"select", options:uctQ1Options, defaultValue:0, validation: getValidationSchema('select', uctQ1Options,0,4)},
    {id:"q2_qol", label:"Q2: How much has your quality of life been affected by urticaria in the last 4 weeks?", type:"select", options:uctQ1Options, defaultValue:0, validation: getValidationSchema('select', uctQ1Options,0,4)},
    {id:"q3_treatment", label:"Q3: How often was treatment for your urticaria not enough to control your symptoms in the last 4 weeks?", type:"select", options:uctQ1Options, defaultValue:0, validation: getValidationSchema('select', uctQ1Options,0,4)},
    {id:"q4_control", label:"Q4: Overall, how well controlled would you say your urticaria was in the last 4 weeks?", type:"select", options:uctQ4Options, defaultValue:0, validation: getValidationSchema('select', uctQ4Options,0,4)}
  ],
  calculationLogic: (inputs) => {
      const q1_val = Number(inputs.q1_symptoms)||0;
      const q2_val = Number(inputs.q2_qol)||0;
      const q3_val = Number(inputs.q3_treatment)||0;
      const q4_val = Number(inputs.q4_control)||0;

      const uct_q1 = 4 - q1_val;
      const uct_q2 = 4 - q2_val;
      const uct_q3 = 4 - q3_val;
      const uct_q4 = q4_val;

      const totalScore = uct_q1 + uct_q2 + uct_q3 + uct_q4;

      let interpretation = `UCT Score: ${totalScore} (Range: 0-16). `;
      if (totalScore >= 12) interpretation += "Urticaria is well controlled.";
      else interpretation += "Urticaria is poorly controlled.";
      interpretation += " (Standard interpretation: <12 poorly controlled, ≥12 well controlled).";
      return { score: totalScore, interpretation, details: {
          Q1_Symptoms_Score: uct_q1, Q2_QoL_Score: uct_q2, Q3_Treatment_Sufficiency_Score: uct_q3, Q4_Overall_Control_Score: uct_q4,
          Raw_Input_Q1: q1_val, Raw_Input_Q2: q2_val, Raw_Input_Q3: q3_val, Raw_Input_Q4: q4_val
      }};
  },
  references: ["Weller K, et al. J Allergy Clin Immunol. 2014."]
};
