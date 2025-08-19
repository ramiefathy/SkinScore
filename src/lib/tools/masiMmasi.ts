import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Palette } from 'lucide-react';
import { getValidationSchema, masiRegionMultiplierMapData } from '../toolValidation';

type MasiRegionKey = keyof typeof masiRegionMultiplierMapData;

const areaOptionsMASI: InputOption[] = Array.from({length:7}, (_,i)=>({value:i, label:`${i} (${["0%", "<10%", "10-29%", "30-49%", "50-69%", "70-89%", "90-100%"][i]})`}));
const darknessHomogeneityOptions: InputOption[] = Array.from({length:5}, (_,i)=>({value:i, label:`${i} (${["None", "Slight", "Mild", "Moderate", "Marked"][i]})`}));

export const masiMmasiTool: Tool = {
  id: "masi_mmasi",
  name: "Melasma Area & Severity Index (MASI/mMASI)",
  acronym: "MASI/mMASI",
  condition: "Melasma",
  keywords: ["masi", "mmasi", "melasma", "pigmentation", "severity", "facial regions"],
  description: "MASI (Melasma Area and Severity Index) and mMASI (modified MASI) are clinician-reported indices for melasma. MASI divides the face into four regions (forehead, right malar, left malar, chin), scoring area of involvement (0–6), darkness (0–4), and homogeneity (0–4) for each. These are combined in a weighted sum (max score 48). The mMASI omits the homogeneity component for simplicity and improved reliability, with a correspondingly lower maximum score (max 24). Both indices are validated, reliable, and sensitive to change, with mMASI often preferred for ease of use. These indices are more quantitative than global assessments like IGA for acne/rosacea and more detailed than ordinal staging systems such as Hurley staging for HS.",
  sourceType: 'Clinical Guideline',
  icon: Palette,
  formSections: [
    { id:"masi_type", label:"MASI Type", type:"select", options:[{value:"masi",label:"MASI (includes Homogeneity)"},{value:"mmasi",label:"mMASI (excludes Homogeneity)"}], defaultValue:"masi", validation:getValidationSchema('select', [{value:"masi",label:"MASI"}])},
    ...(["Forehead", "Right Malar", "Left Malar", "Chin"] as const).map(regionName => {
        const regionId = regionName.toLowerCase().replace(/\s+/g, '_') as MasiRegionKey;
        const regionMultiplier = masiRegionMultiplierMapData[regionId];
        return {
          id: `masi_group_${regionId}`,
          title: `${regionName} (Area Multiplier x${regionMultiplier})`,
          gridCols: 3,
          inputs: [
              { id:`${regionId}_area`, label:`Area (A)`, type:'select', options: areaOptionsMASI, defaultValue:0, validation:getValidationSchema('select',areaOptionsMASI,0,6)},
              { id:`${regionId}_darkness`, label:`Darkness (D)`, type:'select', options: darknessHomogeneityOptions, defaultValue:0, validation:getValidationSchema('select',darknessHomogeneityOptions,0,4)},
              { id:`${regionId}_homogeneity`, label:`Homogeneity (H) (MASI only)`, type:'select', options: darknessHomogeneityOptions, defaultValue:0, description: "Skip for mMASI", validation:getValidationSchema('select',darknessHomogeneityOptions,0,4)}
          ]
        };
    })
  ],
  calculationLogic: (inputs) => {
      const type = inputs.masi_type as "masi" | "mmasi";
      let totalScore = 0;
      const regionDetails: Record<string, any> = {};
      const regions = [
          {name:"Forehead", id:"forehead" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["forehead"]},
          {name:"Right Malar", id:"right_malar" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["right_malar"]},
          {name:"Left Malar", id:"left_malar" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["left_malar"]},
          {name:"Chin", id:"chin" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["chin"]}
      ];
      regions.forEach(r => {
          const A = Number(inputs[`${r.id}_area`])||0;
          const D = Number(inputs[`${r.id}_darkness`])||0;
          const H = (type === "masi") ? (Number(inputs[`${r.id}_homogeneity`])||0) : 0;
          const regionalScore = (type === "masi") ? ((D+H)*A*r.multiplier) : (D*A*r.multiplier);
          totalScore += regionalScore;
          regionDetails[r.name] = {Area:A, Darkness:D, Homogeneity: type === "masi" ? H : 'N/A', Regional_Score: parseFloat(regionalScore.toFixed(2))};
      });
      const score = parseFloat(totalScore.toFixed(2));
      let interpretation = `Total ${type.toUpperCase()} Score: ${score}. `;
      if (type === "masi") { // Max score 48
          if (score === 0) interpretation += "No melasma.";
          else if (score <= 12) interpretation += "Mild melasma."; // Example bands, ~25% of max
          else if (score <= 24) interpretation += "Moderate melasma."; // Example bands, ~50% of max
          else interpretation += "Severe melasma.";
          interpretation += " (MASI Range: 0-48).";
      } else { // mMASI max score 24
          if (score === 0) interpretation += "No melasma.";
          else if (score <= 6) interpretation += "Mild melasma."; // Example bands, ~25% of max
          else if (score <= 12) interpretation += "Moderate melasma."; // Example bands, ~50% of max
          else interpretation += "Severe melasma.";
          interpretation += " (mMASI Range: 0-24).";
      }
      return { score, interpretation, details: { type: type.toUpperCase(), ...regionDetails } };
  },
  references: ["MASI: Kimbrough-Green CK, et al. Arch Dermatol. 1994.", "mMASI: Pandya AG, et al. J Am Acad Dermatol. 2011."]
};
