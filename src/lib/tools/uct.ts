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
  description: "The UCT is a patient-reported outcome measure developed to assess disease control in chronic urticaria from the patient's perspective. It complements the UAS7 by capturing the impact of urticaria on daily life, treatment efficacy, and overall disease control.",
  sourceType: 'Research',
  icon: CheckCircle,
  rationale: "The UCT consists of four items, each scored from 0 to 4, for a total score of 0 to 16. The items address symptom frequency, interference with daily activities, treatment efficacy, and overall disease control over the previous four weeks. Higher scores indicate better disease control. A 7-day recall version (UCT7) has also been developed and validated, with similar scoring and interpretive thresholds. A score of 12 or higher indicates well-controlled disease, while a score below 12 suggests poorly controlled urticaria. The minimal clinically important difference (MCID) for improvement is 2 points.",
  clinicalPerformance: "The UCT has demonstrated strong psychometric properties in multiple languages and populations: Internal consistency (Cronbach's alpha 0.91 (UCT7), 0.73 (pediatric UCT)), Test-retest reliability (ICC 0.83 (UCT7)), strong convergent validity with disease activity and QoL measures, and good screening accuracy (AUC 0.82 for poorly controlled disease in children). The UCT is sensitive to change and has been validated for both adult and pediatric populations, including in diverse cultural settings.",
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
  references: [
    "Zuberbier T, Aberer W, Asero R, et al. The EAACI/GA²LEN/EDF/WAO Guideline for the Definition, Classification, Diagnosis and Management of Urticaria. Allergy. 2018;73(7):1393-1414. doi:10.1111/all.13397.",
    "Weller K, Groffik A, Church MK, et al. Development and Validation of the Urticaria Control Test: A Patient-Reported Outcome Instrument for Assessing Urticaria Control. The Journal of Allergy and Clinical Immunology. 2014;133(5):1365-72, 1372.e1-6. doi:10.1016/j.jaci.2013.12.1076.",
    "Buttgereit T, Salameh P, Sydorenko O, et al. The 7-Day Recall Period Version of the Urticaria Control Test-Uct7. The Journal of Allergy and Clinical Immunology. 2023;152(5):1210-1217.e14. doi:10.1016/j.jaci.2023.03.034.",
    "Kulthanan K, Chularojanamontri L, Tuchinda P, et al. Validity, Reliability and Interpretability of the Thai Version of the Urticaria Control Test (UCT). Health and Quality of Life Outcomes. 2016;14:61. doi:10.1186/s12955-016-0466-y.",
    "Prosty C, Gabrielli S, Mule P, et al. Validation of the Urticaria Control Test (UCT) in Children With Chronic Urticaria. The Journal of Allergy and Clinical Immunology. In Practice. 2022;10(12):3293-3298.e2. doi:10.1016/j.jaip.2022.07.037."
  ]
};
