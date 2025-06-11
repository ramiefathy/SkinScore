
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
  description: "The BILAG index was developed to assess disease activity in systemic lupus erythematosus (SLE) across organ systems, including the skin. The skin domain captures a wide range of lupus-related cutaneous manifestations (e.g., malar rash, discoid lesions, vasculitis). It is intended for longitudinal assessment of SLE activity and treatment response. Developed based on physician intention-to-treat principle (2004 revision most widely used). The BILAG Skin score helps determine disease activity severity and guides escalation of therapy. Skin Grade A requires active rash (e.g., vasculitis or extensive lesions needing systemic therapy); B includes discoid rash or widespread subacute CLE.",
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
    const interpretationMap: Record<string, string> = {
      A: "Severe activity – consider systemic immunosuppression",
      B: "Moderate disease – likely needs escalation",
      C: "Mild/stable cutaneous disease",
      D: "Inactive disease (resolved)",
      E: "No current or historical skin involvement"
    };
    const interpretationText = interpretationMap[grade] || "Invalid grade selected.";
    const interpretation = `BILAG Skin Component Grade: ${grade}. ${interpretationText}`;
    return { score: grade, interpretation, details: { BILAG_Grade: grade, Activity_Level: interpretationText } };
  },
  references: [
    "Isenberg DA, Rahman A, Allen E, et al. BILAG 2004. Development and initial validation of an updated version of the British Isles Lupus Assessment Group's disease activity index for patients with systemic lupus erythematosus. Rheumatology (Oxford). 2005;44(7):902–906.",
    "Gordon C, Akil M, Isenberg D, et al. The British Isles Lupus Assessment Group's new flare index for lupus nephritis. Lupus. 2003;12(5):408–413.",
    "Hay EM, Bacon PA, Gordon C, et al. The BILAG index: a reliable and valid instrument for measuring clinical disease activity in systemic lupus erythematosus. Q J Med. 1993;86(7):447-458."
    ]
};
