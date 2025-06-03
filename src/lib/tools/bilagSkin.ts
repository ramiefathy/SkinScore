
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { FileHeart } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bilagSkinGradeOptions: InputOption[] = [
  { value: "A", label: "A - Severe disease activity" },
  { value: "B", label: "B - Moderate disease activity" },
  { value: "C", label: "C - Mild disease activity" },
  { value: "D", label: "D - Disease inactive but previous involvement" },
  { value: "E", label: "E - Never involved" }
];

export const bilagSkinTool: Tool = {
  id: "bilag_skin",
  name: "BILAG - Skin Component",
  acronym: "BILAG Skin",
  description: "Assesses lupus activity in the mucocutaneous domain as part of the British Isles Lupus Assessment Group index.",
  condition: "Lupus",
  keywords: ["bilag", "lupus", "sle", "skin", "mucocutaneous", "activity", "disease activity index"],
  sourceType: 'Clinical Guideline',
  icon: FileHeart,
  formSections: [
    {
      id: "bilag_skin_grade",
      label: "BILAG Mucocutaneous Grade",
      type: 'select',
      options: bilagSkinGradeOptions,
      defaultValue: "E",
      validation: getValidationSchema('select', bilagSkinGradeOptions)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = inputs.bilag_skin_grade as string || "E";
    const scoreMap: Record<string, number> = { "A": 4, "B": 3, "C": 2, "D": 1, "E": 0 };
    const activityMap: Record<string, string> = { "A": "Severe", "B": "Moderate", "C": "Mild", "D": "Inactive (previous)", "E": "Never involved" };
    const interpretation = `BILAG Skin Component Grade: ${grade} (${activityMap[grade] || "N/A"}). This reflects current lupus activity in the skin and mucous membranes.`;
    return { score: scoreMap[grade] !== undefined ? scoreMap[grade] : 0, interpretation, details: { BILAG_Grade: grade, Activity_Level: activityMap[grade] || "N/A" } };
  },
  references: ["Hay EM, et al. Criteria for data collection and analysis in randomized clinical trials for systemic lupus erythematosus (SLE) I. The British Isles Lupus Assessment Group (BILAG) index for the assessment of SLE activity. Br J Rheumatol. 1993.", "Isenberg DA, et al. BILAG 2004. Development and initial validation of an updated version of the British Isles Lupus Assessment Group's disease activity index for patients with systemic lupus erythematosus. Rheumatology (Oxford). 2005."]
};
