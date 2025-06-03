
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ShieldHalf } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const mswatTool: Tool = {
  id: "mswat",
  name: "Modified Severity-Weighted Assessment Tool (mSWAT)",
  acronym: "mSWAT",
  condition: "Cutaneous T-Cell Lymphoma (CTCL)",
  keywords: ["mswat", "ctcl", "mycosis fungoides", "sezary syndrome", "skin severity"],
  description: "Assesses skin severity in Mycosis Fungoides (MF) and Sézary Syndrome (SS) by evaluating percentage of BSA involved by patches (x1), plaques (x2), and tumors/ulcers (x4). Sum of BSA percentages should ideally not exceed 100%.",
  sourceType: 'Clinical Guideline',
  icon: ShieldHalf,
  formSections: [
    { id: "bsa_patches", label: "BSA % Covered by Patches (Weight x1)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
    { id: "bsa_plaques", label: "BSA % Covered by Plaques (Weight x2)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
    { id: "bsa_tumors_ulcers", label: "BSA % Covered by Tumors/Ulcers (Weight x4)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) }
  ],
  calculationLogic: (inputs) => {
    const bsaPatches = Number(inputs.bsa_patches) || 0;
    const bsaPlaques = Number(inputs.bsa_plaques) || 0;
    const bsaTumorsUlcers = Number(inputs.bsa_tumors_ulcers) || 0;

    const patchScore = bsaPatches * 1;
    const plaqueScore = bsaPlaques * 2;
    const tumorScore = bsaTumorsUlcers * 4;

    const totalScore = patchScore + plaqueScore + tumorScore;
    const totalBSAInvolved = bsaPatches + bsaPlaques + bsaTumorsUlcers;

    let interpretation = `mSWAT Score: ${totalScore.toFixed(1)} (Range: 0-400 theoretically, based on 100% BSA for each category). `
                       + `Calculated from: Patches (${bsaPatches}% BSA x1 = ${patchScore.toFixed(1)}), `
                       + `Plaques (${bsaPlaques}% BSA x2 = ${plaqueScore.toFixed(1)}), `
                       + `Tumors/Ulcers (${bsaTumorsUlcers}% BSA x4 = ${tumorScore.toFixed(1)}). `
                       + `Total BSA involved by lesions: ${totalBSAInvolved.toFixed(1)}%. Higher score indicates greater skin tumor burden.`;
    if (totalBSAInvolved > 100) {
        interpretation += " Note: Sum of BSA percentages exceeds 100%. Please verify inputs if this is not intended due to overlapping assessments."
    }

    return {
      score: parseFloat(totalScore.toFixed(1)),
      interpretation,
      details: {
        BSA_Patches_Percent: bsaPatches,
        BSA_Plaques_Percent: bsaPlaques,
        BSA_Tumors_Ulcers_Percent: bsaTumorsUlcers,
        Weighted_Patch_Score: patchScore,
        Weighted_Plaque_Score: plaqueScore,
        Weighted_Tumor_Ulcer_Score: tumorScore,
        Total_BSA_Involved_Percent: totalBSAInvolved,
      }
    };
  },
  references: ["Olsen E, Whittaker S, Kim YH, et al. Clinical end points and response criteria in mycosis fungoides and Sézary syndrome: a consensus statement of the International Society for Cutaneous Lymphomas, the United States Cutaneous Lymphoma Consortium, and the Cutaneous Lymphoma Task Force of the European Organisation for Research and Treatment of Cancer. J Clin Oncol. 2011."]
};
