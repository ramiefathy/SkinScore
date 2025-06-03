
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
  description: "Patient-reported assessment of chronic spontaneous urticaria (CSU) activity over 7 consecutive days. It combines scores for number of wheals and intensity of itch.",
  sourceType: 'Research',
  icon: Calendar,
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
      if (totalScore === 0) interpretation += "Urticaria-free.";
      else if (totalScore <= 6) interpretation += "Well-controlled urticaria (or mild activity).";
      else if (totalScore <= 15) interpretation += "Mildly active urticaria.";
      else if (totalScore <= 27) interpretation += "Moderately active urticaria.";
      else interpretation += "Severely active urticaria.";
      interpretation += " (Severity bands: 0 Urticaria-free, 1-6 Well-controlled/Mild, 7-15 Mild, 16-27 Moderate, 28-42 Severe)";
      return { score: totalScore, interpretation, details: dailyScores };
  },
  references: ["Zuberbier T, et al. Allergy. 2009.", "Mathias SD, et al. Ann Allergy Asthma Immunol. 2012."]
};
