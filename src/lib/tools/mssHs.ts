
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
  { id: "abscesses_count", label: "Abscesses (count - contribute to regional if specified)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0)}, // Note: Points per abscess not in current overall scoring
  { id: "fistulas_tunnels_count", label: "Fistulas/Tunnels (count x 4 points)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
  { id: "scars_count", label: "Scars (count of distinct scarred areas x 1 point)", type: 'number', min: 0, defaultValue: 0, description:"Typically 1 point per distinct scar area, not number of individual scars.", validation: getValidationSchema('number', [], 0) },
  { id: "other_lesions_count", label: "Other Lesions (e.g. comedones, papules - count if significant x 1 point)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
  { id: "longest_distance", label: "Longest Distance Between Two Lesions (in one region)", type: 'select', options: [{value:2, label:"<5cm (2 points)"}, {value:4, label:"5 to <10cm (4 points)"}, {value:8, label:"≥10cm (8 points)"}], defaultValue:2, validation: getValidationSchema('select', [{value:2, label:"<5cm (2 points)"}], 2, 8) },
  { id: "lesions_separated", label: "Are all lesions clearly separated by normal skin in each region?", type: 'select', options: [{value:0, label:"Yes (Clearly separated - 0 points)"}, {value:6, label:"No (Not separated/Confluent - 6 points)"}], defaultValue:0, validation: getValidationSchema('select', [{value:0, label:"Yes (Clearly separated - 0 points)"}], 0, 6) },
];


export const mssHsTool: Tool = {
  id: "mss_hs",
  name: "Modified Sartorius Score (mSS) for HS",
  acronym: "mSS HS",
  description: "The modified Sartorius Score for Hidradenitis Suppurativa (mSS HS) is a detailed, region-based scoring system. For each predetermined anatomical region (axilla, groin, gluteal, inframammary, etc.), the following are scored: (1) number of involved regions, (2) number and type of lesions (nodules, fistulas, abscesses, scars), (3) longest distance between two relevant lesions in each region (scored 0–10), and (4) whether the region contains Hurley stage III disease (additional points). The total mSS is the sum of all region scores, with higher scores indicating greater severity. The mSS is more granular and dynamic than Hurley staging, and is recommended for research by the United States and Canadian Hidradenitis Suppurativa Foundations.",
  condition: "Hidradenitis Suppurativa",
  keywords: ["mss", "hs", "hidradenitis suppurativa", "sartorius", "severity", "dynamic", "lesion count"],
  sourceType: 'Clinical Guideline',
  icon: SquarePen,
  formSections: [
    {
      id: "mss_regions_group", title: "Anatomical Regions Involved (3 points per region)", gridCols: 2,
      inputs: mssHsRegionInputs
    },
    {
      id: "mss_lesions_group", title: "Lesion Counts and Characteristics (Global Assessment)", gridCols: 1,
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
    // Abscesses are mentioned in the new description for regional scoring but not in the old global point system.
    // If they were to be scored globally with a specific multiplier, it would need to be defined.
    // For now, it's just a count that doesn't directly add to the score in this global calculation.
    const fistulasScore = (Number(inputs.fistulas_tunnels_count) || 0) * 4;
    const scarsScore = (Number(inputs.scars_count) || 0) * 1;
    const otherLesionsScore = (Number(inputs.other_lesions_count) || 0) * 1;
    const distanceScore = Number(inputs.longest_distance) || 0;
    const separatedScore = Number(inputs.lesions_separated) || 0;

    const totalScore = regionsScore + nodulesScore + fistulasScore + scarsScore + otherLesionsScore + distanceScore + separatedScore;

    const interpretation = `Modified Sartorius Score (mSS): ${totalScore}. Higher score indicates more severe HS. This score is dynamic and used to track changes over time. No universal severity bands. The detailed description provided refers to a more granular regional scoring variant (including per-region lesion counts, distance, and Hurley stage III assessment) which may require specific point allocations not fully detailed for implementation in this calculator's current structure.`;
    return { score: totalScore, interpretation, details: {
      Regions_Score: regionsScore, Involved_Regions_Count: involvedRegionsCount,
      Nodules_Count_Global: inputs.nodules_count, Nodules_Score_Global: nodulesScore,
      Abscesses_Count_Global: inputs.abscesses_count,
      Fistulas_Tunnels_Count_Global: inputs.fistulas_tunnels_count, Fistulas_Score_Global: fistulasScore,
      Scars_Count_Global: inputs.scars_count, Scars_Score_Global: scarsScore,
      Other_Lesions_Count_Global: inputs.other_lesions_count, Other_Lesions_Score_Global: otherLesionsScore,
      Distance_Score_Global: distanceScore, Lesions_Separated_Score_Global: separatedScore,
      Total_mSS_Score: totalScore
    }};
  },
  references: [
    "Sartorius K, Emtestam L, Jemec GB, Lapins J. Objective scoring of hidradenitis suppurativa reflecting the role of tobacco smoking and obesity. Br J Dermatol. 2009 Aug;161(2):289-95.",
    "Original Sartorius Score: Sartorius K, Klareskog L, Rantapää-Dahlqvist S. A simple scoring system for hidradenitis suppurativa for dialogue and documentation (Sartorius score). Br J Dermatol. 2003 Nov;149(5):211-3.",
    "Horvath B, Janse I, Vossen ARJV, et al. The Hidradenitis Suppurativa Score: A novel, validated scoring system for hidradenitis suppurativa. J Am Acad Dermatol. 2019;81(3):766-772. (This refers to HSS, not mSS, but is relevant to HS scoring systems).",
    "US Hidradenitis Suppurativa Foundation and Canadian Hidradenitis Suppurativa Foundation recommendations."
    ]
};

