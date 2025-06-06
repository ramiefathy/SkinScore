
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Hand } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const signsHECSI = [
  {id: "erythema", name: "Erythema"},
  {id: "induration_papulation", name: "Induration/Papulation"},
  {id: "vesicles", name: "Vesicles"},
  {id: "fissures", name: "Fissures"},
  {id: "scaling", name: "Scaling"},
  {id: "oedema", name: "Oedema"}
];
const signOptionsHECSI: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];
const areaAffectedOptionsHECSI: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-25%)"}, {value:2, label:"2 (26-50%)"}, {value:3, label:"3 (51-75%)"}, {value:4, label:"4 (76-100%)"} ];

export const hecsiTool: Tool = {
  id: "hecsi",
  name: "Hand Eczema Severity Index (HECSI)",
  acronym: "HECSI",
  condition: "Atopic Dermatitis / Eczema", // Updated condition
  keywords: ["hecsi", "hand eczema", "eczema", "atopic dermatitis", "severity", "hand"], // Added keywords
  description: "Assesses severity of hand eczema.",
  sourceType: 'Clinical Guideline',
  icon: Hand,
  formSections:
      (["Fingertips", "Fingers_excluding_tips", "Palms", "Backs_of_Hands", "Wrists"].map(areaName => {
          const areaId = areaName.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
          return {
              id: `hecsi_group_${areaId}`,
              title: `Region: ${areaName.replace(/_/g, ' ')}`,
              gridCols: 3,
              inputs: [
                  ...signsHECSI.map(sign => ({
                      id: `${areaId}_${sign.id}`,
                      label: `${sign.name} (0-3)`,
                      type: 'select',
                      options: signOptionsHECSI,
                      defaultValue: 0,
                      validation: getValidationSchema('select', signOptionsHECSI, 0, 3)
                  } as InputConfig)),
                  {
                      id: `${areaId}_area_affected`,
                      label: `Area Affected (0-4)`,
                      type: 'select',
                      options: areaAffectedOptionsHECSI,
                      defaultValue: 0,
                      validation: getValidationSchema('select', areaAffectedOptionsHECSI, 0, 4)
                  } as InputConfig
              ]
          };
      }))
  ,
  calculationLogic: (inputs) => {
      let totalHecsiScore = 0;
      const areaDetails: Record<string, any> = {};
      const areas = [
          {name: "Fingertips", id: "fingertips"},
          {name: "Fingers (excluding tips)", id: "fingers_excluding_tips"},
          {name: "Palms", id: "palms"},
          {name: "Backs of Hands", id: "backs_of_hands"},
          {name: "Wrists", id: "wrists"}
      ];

      areas.forEach(area => {
          let intensitySum = 0;
          const currentAreaSignScores: Record<string, number> = {};
          signsHECSI.forEach(sign => {
              const signScore = Number(inputs[`${area.id}_${sign.id}`]) || 0;
              intensitySum += signScore;
              currentAreaSignScores[sign.name] = signScore;
          });
          const areaAffectedScore = Number(inputs[`${area.id}_area_affected`]) || 0;
          const areaScore = intensitySum * areaAffectedScore;
          totalHecsiScore += areaScore;
          areaDetails[area.name] = {intensity_sum: intensitySum, area_affected_score: areaAffectedScore, regional_score: areaScore, signs: currentAreaSignScores};
      });

      const score = totalHecsiScore;
      let interpretation = `Total HECSI Score: ${score} (Range: 0-360). `;
      if (score === 0) interpretation += "Clear.";
      else if (score <= 16) interpretation += "Almost clear.";
      else if (score <= 37) interpretation += "Moderate hand eczema.";
      else if (score <= 116) interpretation += "Severe hand eczema.";
      else interpretation += "Very severe hand eczema.";
      interpretation += " (Severity bands example: 0 Clear, 1-16 Almost Clear, 17-37 Moderate, 38-116 Severe, >116 Very Severe - actual bands may vary)";

      return { score, interpretation, details: areaDetails };
  },
  references: ["Held E, et al. Br J Dermatol. 2005."]
};
