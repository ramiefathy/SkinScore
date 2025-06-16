
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { FileHeart } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bilagSkinGradeOptions: InputOption[] = [
  { value: "A", label: "A - Very active – needs systemic immunosuppression" },
  { value: "B", label: "B - Moderately active – topical/systemic corticosteroids" },
  { value: "C", label: "C - Mild or stable" },
  { value: "D", label: "D - Inactive but previously active" },
  { value: "E", label: "E - Never involved" }
];

export const bilagSkinTool: Tool = {
  id: "bilag_skin",
  name: "BILAG - Skin Component",
  acronym: "BILAG Skin",
  description: "The BILAG index is designed to assess disease activity in systemic lupus erythematosus (SLE) across organ systems, including the skin, based on the physician’s intention to treat. The skin (mucocutaneous) component evaluates new or worsening cutaneous manifestations attributable to SLE, such as malar rash, discoid lesions, and alopecia. Each organ/system, including skin, is scored from A (very active) to E (never involved). The BILAG-2004 numerical scoring assigns: A = 12, B = 8, C = 1, D/E = 0. The skin component is scored based on the most severe manifestation present, using a standardized glossary. The total BILAG score is the sum across all systems, but individual system scores are used for clinical decision-making.",
  condition: "Lupus",
  keywords: ["bilag", "lupus", "sle", "skin", "mucocutaneous", "activity", "disease activity index"],
  sourceType: 'Clinical Guideline',
  icon: FileHeart,
  formSections: [
    {
      id: "bilagSkinGrade",
      label: "Skin activity grade (A–E)",
      type: 'select',
      options: bilagSkinGradeOptions,
      defaultValue: "E",
      description: "Choose based on current skin activity due to lupus. Refer to BILAG-2004 criteria for detailed definitions of each grade.",
      validation: getValidationSchema('select', bilagSkinGradeOptions)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = inputs.bilagSkinGrade as string || "E";
    const scoreMap: Record<string, number> = { "A": 12, "B": 8, "C": 1, "D": 0, "E": 0 };
    const interpretationMap: Record<string, string> = {
      A: "Severe activity – consider systemic immunosuppression",
      B: "Moderate disease – likely needs escalation",
      C: "Mild/stable cutaneous disease",
      D: "Inactive disease (resolved)",
      E: "No current or historical skin involvement"
    };
    const numericalScore = scoreMap[grade] !== undefined ? scoreMap[grade] : 0;
    const interpretationText = interpretationMap[grade] || "Invalid grade selected.";
    const interpretation = `BILAG Skin Component Grade: ${grade} (Numerical Score: ${numericalScore}). ${interpretationText}`;
    return {
        score: numericalScore, // Store the numerical score
        interpretation,
        details: {
            BILAG_Letter_Grade: grade,
            Numerical_Score_Equivalent: numericalScore,
            Activity_Level_Description: interpretationText
        }
    };
  },
  references: [
    "Isenberg DA, Rahman A, Allen E, et al. BILAG 2004. Development and initial validation of an updated version of the British Isles Lupus Assessment Group's disease activity index for patients with systemic lupus erythematosus. Rheumatology (Oxford, England). 2005;44(7):902-6. doi:10.1093/rheumatology/keh624.",
    "Gordon C, Akil M, Isenberg D, et al. The British Isles Lupus Assessment Group's new flare index for lupus nephritis. Lupus. 2003;12(5):408–413."
    ]
};

