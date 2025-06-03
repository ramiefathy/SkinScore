
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const sevenPointChecklistVersionOptions: InputOption[] = [{value:"original", label:"Original (All criteria = 1 point)"}, {value:"weighted", label:"Weighted (Major criteria = 2 points, Minor = 1 point)"}];

const majorCriteria = [
  { id: "major_change_size", label: "Change in Size"},
  { id: "major_irregular_shape", label: "Irregular Shape"},
  { id: "major_irregular_color", label: "Irregular Color"},
];

const minorCriteria = [
  { id: "minor_diameter_ge7mm", label: "Diameter >= 7mm"},
  { id: "minor_inflammation", label: "Inflammation"},
  { id: "minor_oozing_crusting", label: "Oozing or Crusting"},
  { id: "minor_change_sensation", label: "Change in Sensation (e.g., itch, pain)"},
];

export const sevenPointChecklistTool: Tool = {
  id: "seven_point_checklist",
  name: "7-Point Checklist for Melanoma",
  acronym: "7-Point Checklist",
  condition: "Melanoma Screening",
  keywords: ["melanoma", "skin cancer", "screening", "checklist", "nevus", "mole"],
  description: "A clinical rule to help identify suspicious pigmented lesions that may require urgent referral. Uses major and minor criteria.",
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  formSections: [
    { id: "version", label: "Checklist Version", type: 'select', options: sevenPointChecklistVersionOptions, defaultValue:"weighted", validation: getValidationSchema('select')},
    {
      id: "major_criteria_group", title: "Major Criteria", gridCols: 1,
      inputs: majorCriteria.map(crit => ({ ...crit, type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') } as InputConfig))
    },
    {
      id: "minor_criteria_group", title: "Minor Criteria", gridCols: 1,
      inputs: minorCriteria.map(crit => ({ ...crit, type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') } as InputConfig))
    }
  ],
  calculationLogic: (inputs) => {
    let score = 0;
    const presentFeatures: string[] = [];
    const version = inputs.version as "original" | "weighted";

    majorCriteria.forEach(crit => {
      if (inputs[crit.id]) {
        presentFeatures.push(crit.label + " (Major)");
        score += (version === "weighted" ? 2 : 1);
      }
    });
    minorCriteria.forEach(crit => {
      if (inputs[crit.id]) {
        presentFeatures.push(crit.label + " (Minor)");
        score += 1;
      }
    });

    let interpretation = `7-Point Checklist Score (${version}): ${score}. `;
    if (score >= 3) {
      interpretation += "Urgent referral is recommended (Score >= 3).";
    } else {
      interpretation += "Score < 3, does not meet criteria for urgent referral based on this checklist alone. Clinical correlation advised.";
    }
    return { score, interpretation, details: { Version: version, Present_Features: presentFeatures.join(', ') || "None" } };
  },
  references: ["MacKie RM. An aid to pre-operative assessment of pigmented lesions of the skin. Br J Dermatol. 1983.", "Walter FM, et al. The 7-point checklist for melanoma: a prospective validation study in primary care. Br J Gen Pract. 2013.", "NICE guideline [NG12] Melanoma: assessment and management. (Recommends 7-point checklist)"]
};
