
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Calendar } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const uas7WhealsOptions: InputOption[] = [{value:0,label:"0 (<20/24h)"},{value:1,label:"1 (<20/24h)"},{value:2,label:"2 (20-50/24h)"},{value:3,label:"3 (>50/24h or large confluent areas)"}];
const uas7ItchOptions: InputOption[] = [{value:0,label:"0 (None)"},{value:1,label:"1 (Mild - present but not annoying/troublesome)"},{value:2,label:"2 (Moderate - troublesome but does not interfere with normal daily activity/sleep)"},{value:3,label:"3 (Intense - severe, annoying, interferes with normal daily activity/sleep)"}];

export const uas7Tool: Tool = {
  id: "uas7",
  name: "Urticaria Activity Score over 7 days (UAS7)",
  acronym: "UAS7",
  condition: "Urticaria",
  keywords: ["uas7", "urticaria", "csu", "hives", "itch", "wheals", "patient reported"],
  description: "The UAS7 is a validated, patient-reported outcome measure designed to quantify disease activity in chronic urticaria. It is calculated as the sum of daily scores for wheals and pruritus over seven consecutive days.",
  sourceType: 'Research',
  icon: Calendar,
  rationale: "The UAS7 is calculated as the sum of daily urticaria activity scores over seven consecutive days. Each day's score is composed of two subscores: Number of wheals (0–3) and Intensity of pruritus (0–3). The daily score (0–6) is summed over seven days, yielding a total score from 0 to 42. Higher scores indicate greater disease activity. The UAS7 can be calculated using once-daily or twice-daily diaries, with both versions demonstrating high correlation and similar clinical utility.",
  clinicalPerformance: "The UAS7 is endorsed by the American Academy of Dermatology and the European Academy of Allergy and Clinical Immunology (EAACI) as the gold standard for urticaria activity assessment. Multiple studies have demonstrated its robust psychometric properties including strong internal consistency, test-retest reliability, convergent validity, and responsiveness to change. The minimal important difference (MID) is 7–8 points. Categorical UAS7 states (none, mild, moderate, severe) accurately predict differences in patient-reported outcomes and treatment response.",
  formSections:
    Array.from({length:7},(_,i)=> i + 1).map(dayNum => ({
        id: `uas7_day_${dayNum}_group`,
        title: `Day ${dayNum}`,
        gridCols: 2,
        inputs: [
          { id:`d${dayNum}_wheals`, label:`Wheals (Number)`, type:'select', options: uas7WhealsOptions, defaultValue:0, description:"Score for number of wheals in the last 24 hours.", validation: getValidationSchema('select', uas7WhealsOptions,0,3) },
          { id:`d${dayNum}_itch`, label:`Itch Severity`, type:'select', options: uas7ItchOptions, defaultValue:0, description:"Score for intensity of itch in the last 24 hours.", validation: getValidationSchema('select', uas7ItchOptions,0,3) },
        ]
    }))
  ,
  calculationLogic: (inputs) => {
      let totalScore = 0;
      const dailyScores: Record<string, {wheals: number, itch: number, total: number}> = {};
      for(let d=1;d<=7;d++){
          const wheals = Number(inputs[`d${d}_wheals`])||0;
          const itch = Number(inputs[`d${d}_itch`])||0;
          const dailyTotal = wheals + itch;
          totalScore += dailyTotal;
          dailyScores[`Day ${d}`] = {wheals, itch, total: dailyTotal};
      }
      let interpretation = `Total UAS7 Score: ${totalScore} (Range: 0-42). `;
      if (totalScore <= 6) interpretation += "Well-controlled urticaria / No activity (0-6).";
      else if (totalScore <= 15) interpretation += "Mildly active urticaria (7-15).";
      else if (totalScore <= 27) interpretation += "Moderately active urticaria (16-27).";
      else interpretation += "Severely active urticaria (28-42).";
      interpretation += " (Guideline severity bands: 0-6 None, 7-15 Mild, 16-27 Moderate, 28-42 Severe)";
      return { score: totalScore, interpretation, details: dailyScores };
  },
  references: [
    "Zuberbier T, Aberer W, Asero R, et al. The EAACI/GA²LEN/EDF/WAO Guideline for the Definition, Classification, Diagnosis and Management of Urticaria. Allergy. 2018;73(7):1393-1414. doi:10.1111/all.13397.",
    "Hawro T, Ohanyan T, Schoepke N, et al. Comparison and Interpretability of the Available Urticaria Activity Scores. Allergy. 2018;73(1):251-255. doi:10.1111/all.13271.",
    "Hollis K, Proctor C, McBride D, et al. Comparison of Urticaria Activity Score Over 7 Days (UAS7) Values Obtained From Once-Daily and Twice-Daily Versions: Results From the ASSURE-CSU Study. American Journal of Clinical Dermatology. 2018;19(2):267-274. doi:10.1007/s40257-017-0331-8.",
    "Hawro T, Ohanyan T, Schoepke N, et al. The Urticaria Activity Score-Validity, Reliability, and Responsiveness. The Journal of Allergy and Clinical Immunology. In Practice. 2018 Jul - Aug;6(4):1185-1190.e1. doi:10.1016/j.jaip.2017.10.001.",
    "Jauregui I, Gimenez-Arnau A, Bartra J, et al. Psychometric Properties of the Spanish Version of the Once-Daily Urticaria Activity Score (UAS) in Patients With Chronic Spontaneous Urticaria Managed in Clinical Practice (The EVALUAS Study). Health and Quality of Life Outcomes. 2019;17(1):23. doi:10.1186/s12955-019-1087-z.",
    "Mathias SD, Crosby RD, Zazzali JL, Maurer M, Saini SS. Evaluating the Minimally Important Difference of the Urticaria Activity Score and Other Measures of Disease Activity in Patients With Chronic Idiopathic Urticaria. Annals of Allergy, Asthma & Immunology. 2012;108(1):20-24. doi:10.1016/j.anai.2011.09.008.",
    "Stull D, McBride D, Tian H, et al. Analysis of Disease Activity Categories in Chronic Spontaneous/Idiopathic Urticaria. The British Journal of Dermatology. 2017;177(4):1093-1101. doi:10.1111/bjd.15454.",
    "Yong SS, Robinson S, Kwan Z, et al. Psychological Well-Being, Quality of Life and Patient Satisfaction Among Adults With Chronic Spontaneous Urticaria in a Multi-Ethnic Asian Population. Psychology, Health & Medicine. 2023;28(2):324-335. doi:10.1080/13548506.2022.2029914."
  ]
};
