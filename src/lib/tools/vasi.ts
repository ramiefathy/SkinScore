
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Footprints } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const depigmentationOptionsVASI: InputOption[] = [
  {value:1, label:"100% Depigmentation"}, {value:0.9, label:"90% Depigmentation"}, {value:0.75, label:"75% Depigmentation"},
  {value:0.5, label:"50% Depigmentation"}, {value:0.25, label:"25% Depigmentation"}, {value:0.1, label:"10% Depigmentation"}, {value:0, label:"0% Depigmentation (No depigmentation)"}
];

const vasiRegions = ["Hands", "Upper Extremities (excluding Hands)", "Trunk", "Lower Extremities (excluding Feet)", "Feet", "Head/Neck"] as const;

export const vasiTool: Tool = {
  id: "vasi",
  name: "Vitiligo Area Scoring Index (VASI)",
  acronym: "VASI",
  condition: "Vitiligo",
  keywords: ["vasi", "vitiligo", "depigmentation", "area scoring"],
  description: "Quantifies the extent of vitiligo by assessing the percentage of depigmentation in different body regions, weighted by hand units.",
  sourceType: 'Clinical Guideline',
  icon: Footprints,
  formSections:
      vasiRegions.map(regionName => {
          const regionId = regionName.toLowerCase().replace(/[\s()/]+/g, '_');
          return {
              id: `vasi_group_${regionId}`,
              title: `Region: ${regionName}`,
              gridCols: 2,
              inputs: [
                  {id:`${regionId}_hand_units`, label:`Hand Units (HU)`, type:'number', min:0, defaultValue:0, description:"Area in patient's hand units (1 HU ~ 1% BSA).", validation:getValidationSchema('number', [], 0)},
                  {id:`${regionId}_depigmentation_percent`, label:`Depigmentation %`, type:'select', options:depigmentationOptionsVASI, defaultValue:0, validation:getValidationSchema('select',depigmentationOptionsVASI)}
              ]
          };
      })
  ,
  calculationLogic: (inputs) => {
      let totalVASI = 0;
      let facialVASI = 0;
      const regionDetails: Record<string, any> = {};

      vasiRegions.forEach(regionName => {
          const rId = regionName.toLowerCase().replace(/[\s()/]+/g, '_');
          const hu = Number(inputs[`${rId}_hand_units`])||0;
          const depig = Number(inputs[`${rId}_depigmentation_percent`]);
          const regionalScore = hu * depig;
          totalVASI += regionalScore;
          if (rId === "head_neck") {
              facialVASI = regionalScore;
          }
          regionDetails[regionName] = {Hand_Units: hu, Depigmentation_Multiplier: depig, Regional_VASI_Score: parseFloat(regionalScore.toFixed(2))};
      });

      const finalTotalVASI = Math.min(totalVASI, 100);
      const finalFacialVASI = Math.min(facialVASI, 100);

      const interpretation = `Total VASI (T-VASI): ${finalTotalVASI.toFixed(2)} (Range: 0-100). Facial VASI (F-VASI): ${finalFacialVASI.toFixed(2)}. Higher score indicates more extensive depigmentation. VASI is used to track changes over time (e.g., VASI50 for 50% improvement). No universal baseline severity bands defined.`;
      return { score: finalTotalVASI, interpretation, details: { Total_VASI_Uncapped: parseFloat(totalVASI.toFixed(2)), Facial_VASI_Uncapped: parseFloat(facialVASI.toFixed(2)), ...regionDetails } };
  },
  references: ["Hamzavi I, Jain H, McLean D, et al. Parametric modeling of the vitiligo area scoring index (VASI). Arch Dermatol. 2004;140(6):677-683."]
};
