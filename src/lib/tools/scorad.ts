
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ScalingIcon } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scoradIntensityOptions: InputOption[] = [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}];

export const scoradTool: Tool = {
  id: "scorad",
  name: "SCORing Atopic Dermatitis (SCORAD)",
  acronym: "SCORAD",
  description: "Developed by the European Task Force on Atopic Dermatitis in 1993, SCORAD is a comprehensive tool for assessing AD severity. It uniquely combines objective clinician-assessed signs (extent and intensity) with patient-reported symptoms (itch and sleep loss).",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["scorad", "atopic dermatitis", "ad", "eczema", "severity", "extent", "intensity", "subjective symptoms"],
  sourceType: 'Expert Consensus',
  icon: ScalingIcon,
  formSections: [
    {
      id: "scorad_group_a", title: "Part A: Extent", gridCols: 1,
      inputs: [
          { id: "extentPercent", label: "A: Body Surface Area Involved (%)", type: 'number', min: 0, max: 100, defaultValue: 0, description: "Calculated using the 'Rule of Nines'. Score: 0–100.", validation: getValidationSchema('number',undefined,0,100) }
      ]
    },
    {
      id: "scorad_group_b", title: "Part B: Intensity", gridCols:3,
      description: "Assess the average intensity of six clinical signs across affected areas (0=None, 1=Mild, 2=Moderate, 3=Severe). Sum of these six signs gives a total intensity score from 0 to 18.",
      inputs: [
          { id: "intensityRedness", label: "Erythema", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityEdema", label: "Edema/Papulation", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityOozing", label: "Oozing/Crusting", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityExcoriation", label: "Excoriation", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityLichenification", label: "Lichenification", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityDryness", label: "Dryness (of non-affected skin)", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
      ]
    },
    {
      id: "scorad_group_c", title: "Part C: Subjective Symptoms", gridCols:2,
      description: "Patient rates average itch and sleep loss over the past three days on a Visual Analog Scale (VAS) from 0 (none) to 10 (most severe). The two scores are added together (Score: 0–20).",
      inputs: [
          { id: "pruritusVAS", label: "Pruritus (Itch) VAS (0-10)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
          { id: "sleepLossVAS", label: "Sleeplessness VAS (0-10)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
      ]
    }
  ],
  calculationLogic: (inputs) => {
      const A = Number(inputs.extentPercent) || 0;
      const B_sum = (Number(inputs.intensityRedness)||0) + (Number(inputs.intensityEdema)||0) + (Number(inputs.intensityOozing)||0) + (Number(inputs.intensityExcoriation)||0) + (Number(inputs.intensityLichenification)||0) + (Number(inputs.intensityDryness)||0);
      const C_sum = (Number(inputs.pruritusVAS)||0) + (Number(inputs.sleepLossVAS)||0);
      const totalScoradScore = (A/5) + (7*B_sum/2) + C_sum;
      const objectiveScorad = (A/5) + (7*B_sum/2); // Objective SCORAD (oSCORAD)

      const score = parseFloat(totalScoradScore.toFixed(1));
      let severityCategory = "";
      if (score < 25) severityCategory = "Mild AD";
      else if (score <= 50) severityCategory = "Moderate AD";
      else severityCategory = "Severe AD";

      const interpretation = `SCORAD Score: ${score} (Range: 0-103). Severity: ${severityCategory}.
Objective SCORAD (oSCORAD): ${objectiveScorad.toFixed(1)} (Range: 0-83).
Formula: SCORAD = A/5 + (7*B)/2 + C.`;

      return {
        score,
        interpretation,
        details: {
          Part_A_Extent_BSA: A,
          Part_B_Intensity_Sum: B_sum,
          Part_C_Subjective_Symptoms_Sum: C_sum,
          Calculated_oSCORAD: parseFloat(objectiveScorad.toFixed(1)),
          Total_SCORAD_Score: score,
          Severity_Category: severityCategory
        }
      };
  },
  references: [
    "European Task Force on Atopic Dermatitis. (1993). Severity scoring of atopic dermatitis: the SCORAD index. Dermatology, 186(1), 23–31.",
    "Oranje, A. P., Glazenburg, E. J., Wolkerstorfer, A., & de Waard-van der Spek, F. B. (2007). Practical issues on the SCORAD index: a critical appraisal. Allergy, 62(11), 1340-1348."
  ]
};
