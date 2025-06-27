
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { HeartPulse } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bvasSkinInputs: InputConfig[] = [
    { id: "rash", label: "Purpura, maculopapular rash, or urticaria (1 point)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "ulcer", label: "Skin Ulceration (3 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "gangrene", label: "Major Digital Ischemia/Gangrene (6 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
];

export const bvasSkinTool: Tool = {
  id: "bvas_skin",
  name: "BVAS - Skin Component",
  acronym: "BVAS Skin",
  description: "The BVAS is a comprehensive tool for assessing disease activity in systemic vasculitis, with the skin component capturing cutaneous manifestations such as purpura, ulcers, and gangrene.",
  condition: "Vasculitis",
  keywords: ["bvas", "vasculitis", "skin involvement", "activity score", "purpura", "ulcer", "gangrene", "infarcts", "anca"],
  sourceType: 'Clinical Guideline',
  icon: HeartPulse,
  rationale: "The BVAS is a comprehensive tool for assessing disease activity in systemic vasculitis, with the skin component capturing cutaneous manifestations such as purpura, ulcers, and gangrene. The rationale is to provide a standardized, validated measure of disease activity for clinical management and research. The BVAS was developed and validated by Mukhtyar et al., with version 3 being the current standard. The skin domain includes specific items, each scored as present (1) or absent (0), with some items weighted more heavily: Purpura, maculopapular rash, or urticaria (1 point), Skin ulceration (3 points), and Gangrene (6 points). The total skin score is the sum of the weighted items present.",
  clinicalPerformance: "The BVAS, including its skin component, demonstrates good inter- and intra-rater reliability, with kappa values for the skin domain typically above 0.7. The tool is sensitive to change and correlates strongly with physician global assessment and laboratory markers of inflammation. The BVAS is not a diagnostic test, so sensitivity and specificity are not reported.\n\nValidation and Comparative Studies\nThe BVAS has been validated in multicenter cohorts of patients with various forms of vasculitis, showing strong construct validity, reliability, and responsiveness. Comparative studies confirm its superior performance in capturing multisystem disease activity, including skin involvement, compared to other indices.\n\nLimitations and Controversies\nThe BVAS is complex and may be challenging to use in routine clinical practice. Accurate attribution of skin findings to active vasculitis is required, which can introduce diagnostic uncertainty. The weighting of items is based on expert consensus rather than empirical data, and the tool’s performance in rare or atypical vasculitic syndromes is less well established.",
  formSections: [
    {
      id: "bvas_skin_items_group",
      title: "BVAS Skin Activity Items (New/Worse)",
      description: "Select all active skin manifestations of vasculitis present and considered new or worse at this visit. Points will be assigned based on the item.",
      gridCols: 1,
      inputs: bvasSkinInputs
    }
  ],
  calculationLogic: (inputs) => {
    const weights: Record<string, number> = {
      rash: 1,
      ulcer: 3,
      gangrene: 6,
    };
    let score = 0;
    const details: Record<string, string> = {};

    for (const key in weights) {
      if (inputs[key]) {
        score += weights[key];
        details[key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')] = `Present (${weights[key]} pt/s)`;
      } else {
        details[key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')] = "Absent (0 pts)";
      }
    }

    const interpretation = `BVAS Skin Component Score: ${score}. Higher score reflects more active skin vasculitis. This score contributes to the total BVAS (v3 range 0-63).`;
    return { score, interpretation, details };
  },
  references: [
    "Mukhtyar C, Lee R, Brown D, et al. Modification and Validation of the Birmingham Vasculitis Activity Score (Version 3). Annals of the Rheumatic Diseases. 2009;68(12):1827-32. doi:10.1136/ard.2008.101279.",
    "Berti A, Boleto G, Merkel PA, et al. Psychometric Properties of Outcome Measurement Instruments for ANCA-associated Vasculitis: A Systematic Literature Review. Rheumatology (Oxford, England). 2022;61(12):4603-4618. doi:10.1093/rheumatology/keac175.",
    "Version 1: Luqmani, RA, et al. (1994). \"Birmingham Vasculitis Activity Score (BVAS) in systemic necrotizing vasculitis.\" QJM 87(11):671-8.",
    "Version 2: Luqmani, RA, et al. (1997). \"Disease assessment and management of the vasculitides.\" Baillieres Clin Rheumatol 11(2): 423-46.",
    "Version 3: Mukhtyar C, et al (2008). \"Modification and validation of the Birmingham Vasculitis Activity Score (version 3) Ann Rheum Dis. 2008 Dec 3. [Epub ahead of print]\""
    ]
};
