
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const loscatTool: Tool = {
  id: "loscat",
  name: "Localized Scleroderma Cutaneous Assessment Tool (LoSCAT)",
  acronym: "LoSCAT",
  condition: "Localized Scleroderma (Morphea)",
  keywords: ["loscat", "morphea", "localized scleroderma", "activity", "damage", "pga", "mrss"],
  description: "Assesses disease activity and damage in morphea, incorporating Physician Global Assessments (PGA) and modified Rodnan Skin Score (mRSS) components.",
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  formSections: [
    { id: "pga_activity", label: "PGA of Activity (PGA-A, 0-100mm VAS)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
    { id: "pga_damage", label: "PGA of Damage (PGA-D, 0-100mm VAS)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
    { id: "mrss_sum_affected", label: "mRSS Sum of Affected Sites (0-51 for full body, or sum of only affected sites)", type: 'number', min: 0, defaultValue: 0, description: "Sum of mRSS scores from affected sites.", validation: getValidationSchema('number',[],0) },
    { id: "loscat_activity_score", label: "LoSCAT Activity Score (Calculated Externally)", type: 'number', min: 0, defaultValue: 0, description: "Enter the calculated LoSCAT activity score based on its specific items.", validation: getValidationSchema('number',[],0) },
    { id: "loscat_damage_score", label: "LoSCAT Damage Score (Calculated Externally)", type: 'number', min: 0, defaultValue: 0, description: "Enter the calculated LoSCAT damage score based on its specific items.", validation: getValidationSchema('number',[],0) },
  ],
  calculationLogic: (inputs) => {
    const pgaA = Number(inputs.pga_activity) || 0;
    const pgaD = Number(inputs.pga_damage) || 0;
    const mrss = Number(inputs.mrss_sum_affected) || 0;
    const loscatAct = Number(inputs.loscat_activity_score) || 0;
    const loscatDam = Number(inputs.loscat_damage_score) || 0;

    const score = loscatAct; // Primarily reports the LoSCAT activity score as the main "score"
    const interpretation = `LoSCAT Assessment: PGA-Activity: ${pgaA}, PGA-Damage: ${pgaD}. mRSS (Affected Sites Sum): ${mrss}. LoSCAT Activity Score: ${loscatAct}, LoSCAT Damage Score: ${loscatDam}. Higher scores generally indicate greater activity or damage respectively.`;

    return {
      score,
      interpretation,
      details: {
        PGA_Activity: pgaA,
        PGA_Damage: pgaD,
        mRSS_Affected_Sites_Sum: mrss,
        LoSCAT_Activity_Score: loscatAct,
        LoSCAT_Damage_Score: loscatDam
      }
    };
  },
  references: ["Kelsey CE, Torok KS. The Localized Scleroderma Cutaneous Assessment Tool: responsiveness to change in a pediatric clinical population. J Rheumatol. 2013.", "Arkachaisri T, et al. Development and initial validation of the localized scleroderma skin damage index and physician global assessment of disease damage: a proof-of-concept study. Rheumatology (Oxford). 2010."]
};
