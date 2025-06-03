
import type { Tool, InputConfig, FormSectionConfig, InputGroupConfig } from '../types';
import { ShieldHalf } from 'lucide-react'; // Or another icon like Atom or LayoutList
import { getValidationSchema } from '../toolValidation';

const bodyRegionsMswat = [
  { id: 'head', name: 'Head', bsaPercent: 7 },
  { id: 'neck', name: 'Neck', bsaPercent: 2 },
  { id: 'anterior_trunk', name: 'Anterior Trunk', bsaPercent: 13 },
  { id: 'arms', name: 'Arms', bsaPercent: 8 },
  { id: 'forearms', name: 'Forearms', bsaPercent: 6 },
  { id: 'hands', name: 'Hands', bsaPercent: 5 },
  { id: 'posterior_trunk', name: 'Posterior Trunk', bsaPercent: 13 },
  { id: 'buttocks', name: 'Buttocks', bsaPercent: 5 },
  { id: 'thighs', name: 'Thighs', bsaPercent: 19 },
  { id: 'legs', name: 'Legs', bsaPercent: 14 },
  { id: 'feet', name: 'Feet', bsaPercent: 7 },
  { id: 'groin', name: 'Groin', bsaPercent: 1 },
];

const mswatFormSections: FormSectionConfig[] = bodyRegionsMswat.map(region => ({
  id: `mswat_group_${region.id}`,
  title: `${region.name} (Total ${region.bsaPercent}% BSA)`,
  gridCols: 3, // For Patch, Plaque, Tumor inputs
  description: `Enter the % of total body surface area (BSA) covered by each lesion type on the ${region.name}. Each input is capped at ${region.bsaPercent}%. The sum of Patch, Plaque, and Tumor BSA for this region should not exceed ${region.bsaPercent}%.`,
  inputs: [
    {
      id: `patch_bsa_${region.id}`,
      label: 'Patch BSA (%)',
      type: 'number',
      min: 0,
      max: region.bsaPercent,
      step: 0.1,
      defaultValue: 0,
      validation: getValidationSchema('number', [], 0, region.bsaPercent),
      description: `Patch on ${region.name}`
    },
    {
      id: `plaque_bsa_${region.id}`,
      label: 'Plaque BSA (%)',
      type: 'number',
      min: 0,
      max: region.bsaPercent,
      step: 0.1,
      defaultValue: 0,
      validation: getValidationSchema('number', [], 0, region.bsaPercent),
      description: `Plaque on ${region.name}`
    },
    {
      id: `tumor_bsa_${region.id}`,
      label: 'Tumor/Ulcer BSA (%)',
      type: 'number',
      min: 0,
      max: region.bsaPercent,
      step: 0.1,
      defaultValue: 0,
      validation: getValidationSchema('number', [], 0, region.bsaPercent),
      description: `Tumor/Ulcer on ${region.name}`
    },
  ]
} as InputGroupConfig));


export const mswatTool: Tool = {
  id: "mswat",
  name: "Modified Severity-Weighted Assessment Tool (mSWAT)",
  acronym: "mSWAT",
  condition: "Cutaneous T-Cell Lymphoma (CTCL)",
  keywords: ["mswat", "ctcl", "mycosis fungoides", "sezary syndrome", "skin severity", "body surface area"],
  description: "Assesses skin severity in Mycosis Fungoides (MF) and Sézary Syndrome (SS) by evaluating the Body Surface Area (BSA) percentage covered by patches, plaques, and tumors/ulcers across various body regions. Weighted scores are summed to produce the total mSWAT score.",
  sourceType: 'Clinical Guideline',
  icon: ShieldHalf,
  formSections: mswatFormSections,
  calculationLogic: (inputs) => {
    let totalPatchBSA = 0;
    let totalPlaqueBSA = 0;
    let totalTumorBSA = 0;
    const regionalInputs: Record<string, { patch: number, plaque: number, tumor: number, regional_total_bsa_involved: number, region_max_bsa: number, note?: string }> = {};

    bodyRegionsMswat.forEach(region => {
      const patchForRegion = Number(inputs[`patch_bsa_${region.id}`]) || 0;
      const plaqueForRegion = Number(inputs[`plaque_bsa_${region.id}`]) || 0;
      const tumorForRegion = Number(inputs[`tumor_bsa_${region.id}`]) || 0;
      
      const regionalSum = patchForRegion + plaqueForRegion + tumorForRegion;
      let note;
      if (regionalSum > region.bsaPercent) {
        note = `Warning: Sum of lesion BSA (${regionalSum.toFixed(1)}%) for ${region.name} exceeds its max BSA contribution (${region.bsaPercent}%). Calculations will use entered values.`;
      }

      regionalInputs[region.name] = {
        patch: patchForRegion,
        plaque: plaqueForRegion,
        tumor: tumorForRegion,
        regional_total_bsa_involved: parseFloat(regionalSum.toFixed(1)),
        region_max_bsa: region.bsaPercent
      };
      if (note) {
        regionalInputs[region.name].note = note;
      }

      totalPatchBSA += patchForRegion;
      totalPlaqueBSA += plaqueForRegion;
      totalTumorBSA += tumorForRegion;
    });

    const weightedPatchScore = totalPatchBSA * 1;
    const weightedPlaqueScore = totalPlaqueBSA * 2;
    const weightedTumorScore = totalTumorBSA * 4;

    const finalMSWATScore = weightedPatchScore + weightedPlaqueScore + weightedTumorScore;
    const totalBSAInvolvedByLesions = totalPatchBSA + totalPlaqueBSA + totalTumorBSA;

    const interpretation = `Total mSWAT Score: ${finalMSWATScore.toFixed(1)}. `
                         + `Derived from: Total Patch BSA ${totalPatchBSA.toFixed(1)}% (x1) = ${weightedPatchScore.toFixed(1)}; `
                         + `Total Plaque BSA ${totalPlaqueBSA.toFixed(1)}% (x2) = ${weightedPlaqueScore.toFixed(1)}; `
                         + `Total Tumor/Ulcer BSA ${totalTumorBSA.toFixed(1)}% (x4) = ${weightedTumorScore.toFixed(1)}. `
                         + `Total BSA involved by any lesion type: ${totalBSAInvolvedByLesions.toFixed(1)}%. `
                         + `Higher score indicates greater skin tumor burden.`;

    return {
      score: parseFloat(finalMSWATScore.toFixed(1)),
      interpretation,
      details: {
        Regional_BSA_Inputs: regionalInputs,
        Subtotal_Lesion_BSA: {
          Patch: parseFloat(totalPatchBSA.toFixed(1)),
          Plaque: parseFloat(totalPlaqueBSA.toFixed(1)),
          Tumor_Ulcer: parseFloat(totalTumorBSA.toFixed(1)),
        },
        Weighting_Factors: {
          Patch: "x1",
          Plaque: "x2",
          Tumor_Ulcer: "x4",
        },
        Subtotal_Lesion_BSA_x_Weighting_Factor: {
          Patch: parseFloat(weightedPatchScore.toFixed(1)),
          Plaque: parseFloat(weightedPlaqueScore.toFixed(1)),
          Tumor_Ulcer: parseFloat(weightedTumorScore.toFixed(1)),
        },
        Total_mSWAT_Score: parseFloat(finalMSWATScore.toFixed(1)),
        Overall_BSA_Involved_By_Lesions: parseFloat(totalBSAInvolvedByLesions.toFixed(1))
      }
    };
  },
  references: ["Olsen E, Whittaker S, Kim YH, et al. Clinical end points and response criteria in mycosis fungoides and Sézary syndrome: a consensus statement of the International Society for Cutaneous Lymphomas, the United States Cutaneous Lymphoma Consortium, and the Cutaneous Lymphoma Task Force of the European Organisation for Research and Treatment of Cancer. J Clin Oncol. 2011.", "Example based on Stevens SR, Ke MS, Parry EJ, et al. A modified severity-weighted assessment tool (mSWAT) for cutaneous T-cell lymphoma, mycosis fungoides type: a validation study. Arch Dermatol. 2002;138(4):485-490 (though this reference might describe a slightly different version than the most common one, the principles are similar)."]
};

    