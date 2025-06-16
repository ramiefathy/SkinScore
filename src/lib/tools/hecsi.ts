
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { Hand } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hecsiSigns = [
  {id: "erythema", name: "Erythema"},
  {id: "induration_papulation", name: "Induration/Papulation"},
  {id: "vesicles", name: "Vesicles"},
  {id: "fissures", name: "Fissures"},
  {id: "scaling", name: "Scaling"},
  {id: "oedema", name: "Edema"} // Note: Original paper uses 'oedema'
];
const hecsiSignSeverityOptions: InputOption[] = [{value:0,label:"0 - None"},{value:1,label:"1 - Mild"},{value:2,label:"2 - Moderate"},{value:3,label:"3 - Severe"}];
const hecsiAreaAffectedOptions: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-25%)"}, {value:2, label:"2 (26-50%)"}, {value:3, label:"3 (51-75%)"}, {value:4, label:"4 (76-100%)"} ];
const hecsiHandAreas = [
    { id: 'fingertips_r', name: 'Right Fingertips' }, { id: 'fingertips_l', name: 'Left Fingertips' },
    { id: 'fingers_r', name: 'Right Fingers (excl. tips)' }, { id: 'fingers_l', name: 'Left Fingers (excl. tips)' },
    { id: 'palms_r', name: 'Right Palm' }, { id: 'palms_l', name: 'Left Palm' },
    { id: 'backs_r', name: 'Right Back of Hand' }, { id: 'backs_l', name: 'Left Back of Hand' },
    { id: 'wrists_r', name: 'Right Wrist' }, { id: 'wrists_l', name: 'Left Wrist' }
];

export const hecsiTool: Tool = {
  id: "hecsi",
  name: "Hand Eczema Severity Index (HECSI)",
  acronym: "HECSI",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["hecsi", "hand eczema", "eczema", "atopic dermatitis", "severity", "hand"],
  description: "The Hand Eczema Severity Index (HECSI) quantifies hand eczema by scoring the intensity (0–3) of six clinical signs (erythema, infiltration/papulation, vesicles, fissures, scaling, edema) across five hand areas (fingertips, fingers, palms, back of hands, wrists) for each hand. Each of these 10 hand areas is also scored for extent of involvement (0–4). The total HECSI is the sum of (sum of intensity scores × extent score) for all 10 hand areas. HECSI is validated and sensitive to change, making it suitable for both clinical trials and practice.",
  sourceType: 'Clinical Guideline',
  icon: Hand,
  formSections: hecsiHandAreas.map(area => ({
      id: `hecsi_group_${area.id}`,
      title: `Region: ${area.name}`,
      gridCols: 3,
      inputs: [
          ...hecsiSigns.map(sign => ({
              id: `${area.id}_${sign.id}`,
              label: `${sign.name} (0-3)`,
              type: 'select',
              options: hecsiSignSeverityOptions,
              defaultValue: 0,
              validation: getValidationSchema('select', hecsiSignSeverityOptions, 0, 3)
          } as InputConfig)),
          {
              id: `${area.id}_area_affected`,
              label: `Area Affected (0-4)`,
              type: 'select',
              options: hecsiAreaAffectedOptions,
              defaultValue: 0,
              validation: getValidationSchema('select', hecsiAreaAffectedOptions, 0, 4)
          } as InputConfig
      ]
  } as InputGroupConfig)),
  calculationLogic: (inputs) => {
      let totalHecsiScore = 0;
      const areaDetails: Record<string, any> = {};

      hecsiHandAreas.forEach(area => {
          let intensitySum = 0;
          const currentAreaSignScores: Record<string, number> = {};
          hecsiSigns.forEach(sign => {
              const signScore = Number(inputs[`${area.id}_${sign.id}`]) || 0;
              intensitySum += signScore;
              currentAreaSignScores[sign.name] = signScore;
          });
          const areaAffectedScore = Number(inputs[`${area.id}_area_affected`]) || 0;
          const areaScore = intensitySum * areaAffectedScore; // Max per area: (6 signs * 3 severity) * 4 area = 18 * 4 = 72
          totalHecsiScore += areaScore;
          areaDetails[area.name] = {intensity_sum: intensitySum, area_affected_score: areaAffectedScore, regional_score: areaScore, signs: currentAreaSignScores};
      });

      const score = totalHecsiScore; // Max score: 10 areas * 72 = 720. The original paper refers to a 0-360 scale.
                                    // This discrepancy arises if the 5 *paired* hand areas are combined (L+R for fingertips, etc.) and an average/worst intensity taken for those 5 combined areas.
                                    // Current granular input structure calculates for 10 distinct areas.

      let interpretation = `Total HECSI Score: ${score} (Max: 720 based on 10 distinct areas scored).
Higher scores indicate greater severity. There are no consensus severity bands.
In clinical trials, a percentage reduction from baseline (e.g., HECSI-75 for ≥75% improvement) is a common endpoint.
Note: The original HECSI paper describes a max score of 360, achieved by assessing 5 combined (L+R) hand regions. This calculator sums scores from 10 separate hand areas (5 per hand).`;

      return { score, interpretation, details: areaDetails };
  },
  references: [
    "Held, E., Skoet, R., Johansen, J. D., & Agner, T. (2005). The hand eczema severity index (HECSI): a new rating system for clinical assessment of hand eczema. British Journal of Dermatology, 152(2), 302–307."
  ]
};
