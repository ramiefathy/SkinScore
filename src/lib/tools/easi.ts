
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const areaOptionsEASI:InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90+%"} ];
const severityOptionsEASI:InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"} ];

const regionDataEASI = [
  { id: 'head_neck', name: 'Head & Neck', adultWeight: 0.1, childWeight: 0.2 },
  { id: 'upper_limbs', name: 'Upper Limbs', adultWeight: 0.2, childWeight: 0.2 },
  { id: 'trunk', name: 'Trunk (incl. genitals)', adultWeight: 0.3, childWeight: 0.3 },
  { id: 'lower_limbs', name: 'Lower Limbs (incl. buttocks)', adultWeight: 0.4, childWeight: 0.3 },
];

export const easiTool: Tool = {
  id: "easi",
  name: "Eczema Area and Severity Index (EASI)",
  acronym: "EASI",
  description: "Developed by Hanifin et al. (2001), EASI is a validated tool for assessing the severity and extent of atopic dermatitis (AD). It is the core outcome measure recommended by the Harmonising Outcome Measures for Eczema (HOME) initiative for AD clinical trials. An examiner rates four clinical signs (Erythema, Induration/Papulation, Excoriation, Lichenification) in four body regions, along with the area score for each region.",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["easi", "atopic dermatitis", "ad", "eczema", "severity", "area", "HOME initiative"],
  sourceType: 'Clinical Guideline',
  icon: SlidersHorizontal,
  formSections: [
    { id: "age_group", label: "Age Group (determines regional weights)", type: 'select', options: [ {value: "adult", label: "Adult/Child >7 years"}, {value: "child", label: "Child 0-7 years"} ], defaultValue: "adult", validation: getValidationSchema('select', [ {value: "adult", label: "Adult/Child >7 years"}])},
    ...regionDataEASI.map(region => {
      return {
          id: `easi_group_${region.id}`,
          title: `${region.name} (Adult Wt: ${region.adultWeight}, Child Wt: ${region.childWeight})`,
          gridCols: 2,
          inputs: [
              { id: `${region.id}_area`, label: `Area Affected Score (0-6)`, type: 'select', options: areaOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',areaOptionsEASI,0,6) },
              { id: `${region.id}_erythema`, label: `Erythema (0-3)`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${region.id}_induration`, label: `Induration/Papulation (0-3)`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${region.id}_excoriation`, label: `Excoriation (0-3)`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${region.id}_lichenification`, label: `Lichenification (0-3)`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
          ]
      };
    })
  ],
  calculationLogic: (inputs) => {
      const ageGroup = inputs.age_group as "adult" | "child";
      let totalEASIScore = 0;
      const regionalScoresDetails: Record<string, any> = {};

      regionDataEASI.forEach(region => {
          const areaScore = Number(inputs[`${region.id}_area`]) || 0;
          const erythema = Number(inputs[`${region.id}_erythema`]) || 0;
          const induration = Number(inputs[`${region.id}_induration`]) || 0;
          const excoriation = Number(inputs[`${region.id}_excoriation`]) || 0;
          const lichenification = Number(inputs[`${region.id}_lichenification`]) || 0;

          const severitySum = erythema + induration + excoriation + lichenification;
          const regionWeight = ageGroup === "child" ? region.childWeight : region.adultWeight;
          const regionalScore = severitySum * areaScore * regionWeight;
          totalEASIScore += regionalScore;

          regionalScoresDetails[region.name] = {
            Severity_Sum: severitySum,
            Area_Score: areaScore,
            Region_Weight_Applied: regionWeight,
            Regional_EASI_Contribution: parseFloat(regionalScore.toFixed(2))
          };
      });

      const score = parseFloat(totalEASIScore.toFixed(1));
      let severityInterpretationText = "";
      if (score === 0) severityInterpretationText = "Clear";
      else if (score <= 1.0) severityInterpretationText = "Almost clear";
      else if (score <= 7.0) severityInterpretationText = "Mild";
      else if (score <= 21.0) severityInterpretationText = "Moderate";
      else if (score <= 50.0) severityInterpretationText = "Severe";
      else severityInterpretationText = "Very severe";

      const interpretation = `EASI Score: ${score} (Range: 0-72). Severity: ${severityInterpretationText} eczema.`;

      return {
        score,
        interpretation,
        details: {
          Selected_Age_Group: ageGroup,
          Regional_Scores: regionalScoresDetails,
          Total_EASI_Score: score,
          Severity_Category: severityInterpretationText
        }
      };
  },
  references: [
    "Hanifin, J. M., Thurston, M., Omoto, M., et al. (2001). The Eczema Area and Severity Index (EASI): assessment of reliability in atopic dermatitis. Experimental Dermatology, 10(1), 11–18.",
    "Leshem, Y. A., Hajar, T., Hanifin, J. M., & Simpson, E. L. (2015). What the Eczema Area and Severity Index score tells us about the severity of atopic dermatitis: a systematic review. British Journal of Dermatology, 172(5), 1353–1356."
  ]
};
