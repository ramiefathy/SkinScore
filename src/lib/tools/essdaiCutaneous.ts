
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { CloudDrizzle } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const essdaiCutaneousActivityOptions: InputOption[] = [
  { value: 0, label: "0 - No activity" },
  { value: 1, label: "1 - Low activity (e.g., non-vasculitic purpura <2 sites, limited urticarial vasculitis)" },
  { value: 2, label: "2 - Moderate activity (e.g., vasculitic purpura >2 sites or one major site, extensive urticarial vasculitis, cutaneous ulcers)" },
  { value: 3, label: "3 - High activity (e.g., extensive/multiple skin ulcers, digital gangrene)" }
];

export const essdaiCutaneousTool: Tool = {
  id: "essdai_cutaneous",
  name: "ESSDAI - Cutaneous Domain",
  acronym: "ESSDAI Cutaneous",
  description: "The ESSDAI (EULAR Sjögren's Syndrome Disease Activity Index) cutaneous domain is designed to quantify skin involvement in primary Sjögren’s syndrome as part of a comprehensive, physician-assessed systemic activity index. The cutaneous domain specifically evaluates the presence and severity of active skin manifestations attributable to Sjögren’s, such as palpable purpura, urticarial vasculitis, or erythematous lesions. Severity is graded as 0 (no activity), 1 (mild), 2 (moderate), or 3 (high), with each level defined by the type and extent of skin findings. The domain score is weighted (weight = 2) and contributes to the total ESSDAI score, which is the sum of all 12 domains, reflecting overall systemic disease activity. This approach is analogous to the organ-specific scoring seen in the BILAG and BVAS indices, but is tailored to Sjögren’s syndrome and validated for use in clinical trials and practice to monitor disease and guide therapy.",
  condition: "Sjögren's Syndrome",
  keywords: ["essdai", "sjogren's syndrome", "cutaneous domain", "skin activity", "disease activity index"],
  sourceType: 'Clinical Guideline',
  icon: CloudDrizzle,
  formSections: [
    {
      id: "cutaneous_activity_level",
      label: "Cutaneous Domain Activity Level",
      type: 'select',
      options: essdaiCutaneousActivityOptions,
      defaultValue: 0,
      description: "Refer to ESSDAI definitions for specific criteria for each activity level.",
      validation: getValidationSchema('select', essdaiCutaneousActivityOptions, 0, 3)
    }
  ],
  calculationLogic: (inputs) => {
    const activityLevel = Number(inputs.cutaneous_activity_level) || 0;
    const weightedScore = activityLevel * 2;
    const activityDescription = essdaiCutaneousActivityOptions.find(opt => opt.value === activityLevel)?.label || "N/A";

    const interpretation = `ESSDAI Cutaneous Domain: Activity Level ${activityLevel} (${activityDescription}). Weighted Score contribution to total ESSDAI: ${weightedScore}.`;
    return { score: weightedScore, interpretation, details: { Activity_Level: activityLevel, Level_Description: activityDescription, Weighted_Score: weightedScore } };
  },
  references: ["Seror R, et al. EULAR Sjogren's Syndrome Disease Activity Index (ESSDAI): a user guide. RMD Open. 2015.", "Shiboski CH, et al. American College of Rheumatology classification criteria for Sjögren's syndrome: a data-driven, expert consensus approach in the Sjögren's International Collaborative Clinical Alliance cohort. Arthritis Care Res (Hoboken). 2012."]
};

