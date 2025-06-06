
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const sasiFacialRegions = [
  { id: 'luq', name: 'Left Upper Quadrant (LUQ)' },
  { id: 'ruq', name: 'Right Upper Quadrant (RUQ)' },
  { id: 'llq', name: 'Left Lower Quadrant (LLQ)' },
  { id: 'rlq', name: 'Right Lower Quadrant (RLQ)' },
  { id: 'nose', name: 'Nose' },
];

const sasiSeverityOptions: InputOption[] = [
  { value: 0, label: "0 – None" }, { value: 1, label: "1 – Mild" },
  { value: 2, label: "2 – Moderate" }, { value: 3, label: "3 – Marked" },
  { value: 4, label: "4 – Severe" }
];

const sasiAreaOptions: InputOption[] = [
  { value: 0, label: "0 – None (0%)" }, { value: 1, label: "1 – < 10%" },
  { value: 2, label: "2 – 10–30%" }, { value: 3, label: "3 – 31–50%" },
  { value: 4, label: "4 – 51–70%" }, { value: 5, label: "5 – 71–90%" },
  { value: 6, label: "6 – 91–100%" }
];

const sasiFormSections: FormSectionConfig[] = sasiFacialRegions.map(region => ({
  id: `sasi_group_${region.id}`,
  title: `Facial Region: ${region.name}`,
  gridCols: 2,
  inputs: [
    {
      id: `sasi_area_${region.id}`,
      label: `Area Involvement in ${region.name}`,
      type: 'select',
      options: sasiAreaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', sasiAreaOptions, 0, 6)
    } as InputConfig,
    {
      id: `sasi_erythema_${region.id}`,
      label: `Erythema in ${region.name}`,
      type: 'select',
      options: sasiSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', sasiSeverityOptions, 0, 4)
    } as InputConfig,
    {
      id: `sasi_induration_${region.id}`,
      label: `Induration in ${region.name}`,
      type: 'select',
      options: sasiSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', sasiSeverityOptions, 0, 4)
    } as InputConfig,
    {
      id: `sasi_desquamation_${region.id}`,
      label: `Desquamation in ${region.name}`,
      type: 'select',
      options: sasiSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', sasiSeverityOptions, 0, 4)
    } as InputConfig,
  ]
} as InputGroupConfig));

export const sasiTool: Tool = {
  id: "sasi",
  name: "Sarcoidosis Activity and Severity Index",
  acronym: "SASI",
  description: "The SASI quantifies cutaneous sarcoidosis severity by evaluating erythema, induration, desquamation, and area involvement across five facial regions, yielding a total score from 0 to 72.",
  condition: "Cutaneous Sarcoidosis",
  keywords: ["sasi", "sarcoidosis", "cutaneous sarcoidosis", "facial lesions", "erythema", "induration", "desquamation", "severity index"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: sasiFormSections,
  calculationLogic: (inputs) => {
    let sumOfRegionProducts = 0;
    const regionalDetails: Record<string, any> = {};

    sasiFacialRegions.forEach(region => {
      const areaScore = Number(inputs[`sasi_area_${region.id}`]) || 0;
      const erythemaScore = Number(inputs[`sasi_erythema_${region.id}`]) || 0;
      const indurationScore = Number(inputs[`sasi_induration_${region.id}`]) || 0;
      const desquamationScore = Number(inputs[`sasi_desquamation_${region.id}`]) || 0;

      const severitySum = erythemaScore + indurationScore + desquamationScore;
      const regionProduct = severitySum * areaScore;
      sumOfRegionProducts += regionProduct;

      regionalDetails[region.name] = {
        Area_Score: areaScore,
        Erythema: erythemaScore,
        Induration: indurationScore,
        Desquamation: desquamationScore,
        Severity_Sum_Per_Region: severitySum,
        Region_Product: regionProduct
      };
    });

    const totalSASI = sumOfRegionProducts / sasiFacialRegions.length;
    const score = parseFloat(totalSASI.toFixed(2));

    let severityCategory = "";
    if (score <= 19) severityCategory = "Mild";
    else if (score <= 39) severityCategory = "Moderate";
    else severityCategory = "Severe";

    const interpretation = `Total SASI Score: ${score} (Range: 0-72). Severity Category: ${severityCategory}.`;

    return {
      score,
      interpretation,
      details: {
        Regional_Scores: regionalDetails,
        Sum_Of_Region_Products: sumOfRegionProducts,
        Total_SASI_Score: score,
        Severity_Category: severityCategory
      }
    };
  },
  references: [
    "Rosenbach M, Yeung H, Chu EY, et al. Reliability and Convergent Validity of the Cutaneous Sarcoidosis Activity and Morphology Instrument for Assessing Cutaneous Sarcoidosis. JAMA Dermatol. 2013;149(5):550–556.",
    "Judson MA, Baughman RP, Costabel U, et al. Validation of the Sarcoidosis Assessment Instrument. Sarcoidosis Vasc Diffuse Lung Dis. 2008;25(3):165–172."
  ]
};
