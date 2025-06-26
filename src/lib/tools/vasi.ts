
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
  description: "The VASI is a clinician-reported outcome measure developed to quantify the extent of skin depigmentation in vitiligo. It was designed to provide a standardized, objective measure of disease severity and treatment response, addressing the need for reproducible outcome measures in clinical trials and practice.",
  sourceType: 'Clinical Guideline',
  icon: Footprints,
  rationale: "The VASI score is calculated by estimating the percentage of depigmentation within predefined body regions and multiplying this by the proportion of body surface area (BSA) affected in each region. The total VASI score is the sum of these regional scores, providing a continuous measure of overall disease burden. A “hand unit” (the palmar surface of the patient’s hand, including fingers) represents approximately 1% of the total BSA. The degree of depigmentation is estimated using a scale (e.g., 100%, 90%, 75%, 50%, 25%, 10%), and the VASI is reported as a total body score (T-VASI) or for specific regions such as the face (F-VASI).",
  clinicalPerformance: "Recent psychometric analyses have confirmed the reliability and validity of the VASI:\n• Test-retest reliability: ICC >0.90 for both F-VASI and T-VASI, indicating excellent reliability.\n• Convergent validity: Moderate to strong correlations with global assessments of vitiligo severity.\n• Divergent validity: Weaker correlations with quality of life and psychological distress measures.\n• Known-groups validity: Significant differences in VASI scores between groups defined by patient and physician global assessments.\n• Meaningful change thresholds: Established for interpreting clinically relevant changes in VASI scores.\nA scoping review identified substantial heterogeneity in VASI implementation across studies, with nine VASI subtypes and variable methods for estimating BSA and depigmentation. This methodological variability limits the comparability of results and underscores the need for standardization.",
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
  references: [
    "Ceresnie MS, Warbasse E, Gonzalez S, Pourang A, Hamzavi IH. Implementation of the Vitiligo Area Scoring Index in Clinical Studies of Patients With Vitiligo: A Scoping Review. Archives of Dermatological Research. 2023;315(8):2233-2259. doi:10.1007/s00403-023-02608-3.",
    "Ezzedine K, Soliman AM, Camp HS, et al. Psychometric Properties and Meaningful Change Thresholds of the Vitiligo Area Scoring Index. JAMA Dermatology. 2025;161(1):39-46. doi:10.1001/jamadermatol.2024.4534.",
    "Komen L, da Graça V, Wolkerstorfer A, et al. Vitiligo Area Scoring Index and Vitiligo European Task Force Assessment: Reliable and Responsive Instruments to Measure the Degree of Depigmentation in Vitiligo. The British Journal of Dermatology. 2015;172(2):437-43. doi:10.1111/bjd.13432."
  ]
};
