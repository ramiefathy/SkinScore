
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const dssiRegions = [
  { id: 'head', name: 'Head', weight: 0.10 },
  { id: 'trunk', name: 'Trunk', weight: 0.20 },
  { id: 'ue', name: 'Upper Extremities (UE)', weight: 0.30 },
  { id: 'le', name: 'Lower Extremities (LE)', weight: 0.40 },
];

const dssiAreaOptions: InputOption[] = [
  { value: 0, label: "0 - None (0%)" }, { value: 1, label: "1 - < 10%" },
  { value: 2, label: "2 - 10–30%" }, { value: 3, label: "3 - 31–50%" },
  { value: 4, label: "4 - 51–70%" }, { value: 5, label: "5 - 71–90%" },
  { value: 6, label: "6 - > 90%" }
];

const dssiFeatureSeverityOptions: InputOption[] = [
  { value: 0, label: "0 - None" }, { value: 1, label: "1 - Mild" },
  { value: 2, label: "2 - Moderate" }, { value: 3, label: "3 - Moderate–Severe" },
  { value: 4, label: "4 - Severe" }
];

const dssiFormSections: FormSectionConfig[] = dssiRegions.map(region => ({
  id: `dssi_group_${region.id}`,
  title: `${region.name} (BSA Weight: ${region.weight * 100}%)`,
  gridCols: 2, // Or 1 if preferred
  inputs: [
    {
      id: `dssi_area_${region.id}`,
      label: `Percentage of ${region.name} Involved`,
      type: 'select',
      options: dssiAreaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', dssiAreaOptions, 0, 6),
      description: `Estimate % of this region affected.`
    } as InputConfig,
    {
      id: `dssi_redness_${region.id}`,
      label: `Erythema in ${region.name}`,
      type: 'select',
      options: dssiFeatureSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', dssiFeatureSeverityOptions, 0, 4)
    } as InputConfig,
    {
      id: `dssi_induration_${region.id}`,
      label: `Induration in ${region.name}`,
      type: 'select',
      options: dssiFeatureSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', dssiFeatureSeverityOptions, 0, 4)
    } as InputConfig,
    {
      id: `dssi_scaliness_${region.id}`,
      label: `Scaliness in ${region.name}`,
      type: 'select',
      options: dssiFeatureSeverityOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', dssiFeatureSeverityOptions, 0, 4)
    } as InputConfig,
  ]
} as InputGroupConfig));


export const dssiTool: Tool = {
  id: "dssi",
  name: "Dermatomyositis Skin Severity Index",
  acronym: "DSSI",
  description: "The DSSI adapts PASI for dermatomyositis, assessing erythema, induration, scaliness, and area involvement across four body regions to yield a total score (0-72).",
  condition: "Dermatomyositis",
  keywords: ["dssi", "dermatomyositis", "skin severity", "erythema", "induration", "scaliness", "PASI"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: dssiFormSections,
  calculationLogic: (inputs) => {
    let totalDSSI = 0;
    const regionalDetails: Record<string, any> = {};

    dssiRegions.forEach(region => {
      const areaScore = Number(inputs[`dssi_area_${region.id}`]) || 0;
      const rednessScore = Number(inputs[`dssi_redness_${region.id}`]) || 0;
      const indurationScore = Number(inputs[`dssi_induration_${region.id}`]) || 0;
      const scalinessScore = Number(inputs[`dssi_scaliness_${region.id}`]) || 0;

      const severitySum = rednessScore + indurationScore + scalinessScore;
      const regionScore = severitySum * areaScore * region.weight;
      totalDSSI += regionScore;

      regionalDetails[region.name] = {
        Area_Score: areaScore,
        Redness: rednessScore,
        Induration: indurationScore,
        Scaliness: scalinessScore,
        Severity_Sum: severitySum,
        Calculated_Region_Score: parseFloat(regionScore.toFixed(2))
      };
    });

    const score = parseFloat(totalDSSI.toFixed(2));
    let severityCategory = "";
    if (score <= 17) severityCategory = "Minimal cutaneous involvement";
    else if (score <= 36) severityCategory = "Moderate involvement";
    else severityCategory = "Severe involvement";

    const interpretation = `Total DSSI Score: ${score} (Range: 0-72). Severity Category: ${severityCategory}.`;

    return {
      score,
      interpretation,
      details: {
        Regional_Scores: regionalDetails,
        Total_DSSI_Score: score,
        Severity_Category: severityCategory
      }
    };
  },
  references: [
    "Carroll CL, Lang W, Snively B, Feldman SR, Callen J, Jorizzo JL. Development and validation of the Dermatomyositis Skin Severity Index. Br J Dermatol. 2008;158(2):345–350.",
    "Gaffney RG, Werth VP. Cutaneous outcome measures in dermatomyositis. Semin Arthritis Rheum. 2020;50(3):458–462."
  ]
};
