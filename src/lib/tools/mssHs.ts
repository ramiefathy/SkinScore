
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { SquarePen } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const mssHsRegionInputs: InputConfig[] = [
  { id: "axilla_l", label: "Axilla (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "axilla_r", label: "Axilla (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "groin_l", label: "Groin (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "groin_r", label: "Groin (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "genital_l", label: "Genital (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "genital_r", label: "Genital (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "gluteal_l", label: "Gluteal (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "gluteal_r", label: "Gluteal (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "inframammary_l", label: "Inframammary (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "inframammary_r", label: "Inframammary (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  { id: "other_region", label: "Other Region(s)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
];

const mssHsLesionInputs: InputConfig[] = [
  { id: "nodules_count", label: "Inflammatory Nodules (count x 2 points)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
  { id: "fistulas_tunnels_count", label: "Fistulas/Tunnels (count x 4 points)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
  { id: "scars_count", label: "Scars (count of distinct scarred areas x 1 point)", type: 'number', min: 0, defaultValue: 0, description:"Typically 1 point per distinct scar area, not number of individual scars.", validation: getValidationSchema('number', [], 0) },
  { id: "other_lesions_count", label: "Other Lesions (e.g. comedones, papules - count if significant x 1 point)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
  { id: "longest_distance", label: "Longest Distance Between Two Lesions (in one region)", type: 'select', options: [{value:2, label:"<5cm (2 points)"}, {value:4, label:"5 to <10cm (4 points)"}, {value:8, label:"≥10cm (8 points)"}], defaultValue:2, validation: getValidationSchema('select', [], 2, 8) },
  { id: "lesions_separated", label: "Are all lesions clearly separated by normal skin in each region?", type: 'select', options: [{value:0, label:"Yes (Clearly separated - 0 points)"}, {value:6, label:"No (Not separated/Confluent - 6 points)"}], defaultValue:0, validation: getValidationSchema('select', [], 0, 6) },
];


export const mssHsTool: Tool = {
  id: "mss_hs",
  name: "Modified Sartorius Score (mSS) for HS",
  acronym: "mSS HS",
  condition: "Hidradenitis Suppurativa",
  keywords: ["mss", "hs", "hidradenitis suppurativa", "sartorius", "severity", "dynamic"],
  description: "A dynamic score for assessing the severity of Hidradenitis Suppurativa (HS) by evaluating involved regions, lesion counts, and distances.",
  sourceType: 'Clinical Guideline',
  icon: SquarePen,
  formSections: [
    {
      id: "mss_regions_group", title: "Anatomical Regions Involved (3 points per region)", gridCols: 2,
      inputs: mssHsRegionInputs
    },
    {
      id: "mss_lesions_group", title: "Lesion Counts and Characteristics", gridCols: 1,
      inputs: mssHsLesionInputs
    }
  ],
  calculationLogic: (inputs) => {
    let regionsScore = 0;
    let involvedRegionsCount = 0;
    mssHsRegionInputs.forEach(input => {
      if (inputs[input.id]) {
        involvedRegionsCount++;
      }
    });
    regionsScore = involvedRegionsCount * 3;

    const nodulesScore = (Number(inputs.nodules_count) || 0) * 2;
    const fistulasScore = (Number(inputs.fistulas_tunnels_count) || 0) * 4;
    const scarsScore = (Number(inputs.scars_count) || 0) * 1;
    const otherLesionsScore = (Number(inputs.other_lesions_count) || 0) * 1;
    const distanceScore = Number(inputs.longest_distance) || 0;
    const separatedScore = Number(inputs.lesions_separated) || 0;

    const totalScore = regionsScore + nodulesScore + fistulasScore + scarsScore + otherLesionsScore + distanceScore + separatedScore;

    const interpretation = `Modified Sartorius Score (mSS): ${totalScore}. Higher score indicates more severe HS. This score is dynamic and used to track changes over time. No universal severity bands.`;
    return { score: totalScore, interpretation, details: {
      Regions_Score: regionsScore, Involved_Regions_Count: involvedRegionsCount, Nodules_Score: nodulesScore, Fistulas_Score: fistulasScore, Scars_Score: scarsScore, Other_Lesions_Score: otherLesionsScore, Distance_Score: distanceScore, Lesions_Separated_Score: separatedScore
    }};
  },
  references: ["Sartorius K, et al. A simple scoring system for hidradenitis suppurativa for dialogue and documentation (Sartorius score). Br J Dermatol. 2003.", "Modified version often cited from Sartorius K, et al. Objective scoring of hidradenitis suppurativa reflecting the role of tobacco smoking and obesity. Br J Dermatol. 2009."]
};
