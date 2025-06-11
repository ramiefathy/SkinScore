
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const loscatTool: Tool = {
  id: "loscat",
  name: "Localized Scleroderma Cutaneous Assessment Tool (LoSCAT)",
  acronym: "LoSCAT",
  condition: "Localized Scleroderma (Morphea)",
  keywords: ["loscat", "morphea", "localized scleroderma", "activity", "damage", "pga", "mrss", "LoSAI", "LoSDI"],
  description: "The LoSCAT is a comprehensive, validated tool used to assess disease state in localized scleroderma (morphea). It uniquely separates disease activity (LoSAI - Localized Scleroderma Activity Index for ongoing inflammation) from disease damage (LoSDI - Localized Scleroderma Damage Index for chronic, irreversible changes like atrophy and sclerosis). This tool expects pre-calculated LoSAI and LoSDI scores as input.",
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  formSections: [
    {
      id: "activityIndex",
      label: "LoSAI (Localized Scleroderma Activity Index) Score",
      type: 'number',
      min: 0,
      defaultValue: 0,
      description: "Enter the pre-calculated LoSAI score.",
      validation: getValidationSchema('number',[],0)
    },
    {
      id: "damageIndex",
      label: "LoSDI (Localized Scleroderma Damage Index) Score",
      type: 'number',
      min: 0,
      defaultValue: 0,
      description: "Enter the pre-calculated LoSDI score.",
      validation: getValidationSchema('number',[],0)
    },
  ],
  calculationLogic: (inputs) => {
    const activityScore = Number(inputs.activityIndex) || 0;
    const damageScore = Number(inputs.damageIndex) || 0;

    let activitySeverity = "";
    if (activityScore <= 4) activitySeverity = "Mild Activity";
    else if (activityScore <= 12) activitySeverity = "Moderate Activity";
    else activitySeverity = "Severe Activity";

    let damageSeverity = "";
    if (damageScore <= 10) damageSeverity = "Mild Damage";
    else if (damageScore <= 15) damageSeverity = "Moderate Damage";
    else damageSeverity = "Severe Damage";

    // The primary "score" of LoSCAT isn't a single sum, but the separate activity and damage scores.
    // We can use a string to represent this or pick one (e.g., activity) as the main 'score'.
    // For this tool, displaying both is more meaningful.
    const mainScoreDisplay = `Activity: ${activityScore}, Damage: ${damageScore}`;

    const interpretation = `LoSCAT Assessment Results:
Activity (LoSAI): ${activityScore} (${activitySeverity}).
Damage (LoSDI): ${damageScore} (${damageSeverity}).
Severity Bands:
LoSAI (Activity): 0–4 Mild; 5–12 Moderate; ≥13 Severe.
LoSDI (Damage): 0–10 Mild; 11–15 Moderate; ≥16 Severe.`;

    return {
      score: mainScoreDisplay, // Representing the combined nature
      interpretation,
      details: {
        LoSAI_Activity_Score: activityScore,
        LoSAI_Severity_Category: activitySeverity,
        LoSDI_Damage_Score: damageScore,
        LoSDI_Severity_Category: damageSeverity
      }
    };
  },
  references: [
    "Arkachaisri, T., Vilaiyuk, S., Li, S., et al. (2010). The localized scleroderma cutaneous assessment tool: a new instrument for clinical trials. Arthritis & Rheumatism, 62(10), 3066-3077.",
    "Kelsey, C. E., & Torok, K. S. (2020). The Localized Scleroderma Cutaneous Assessment Tool (LoSCAT): responsiveness to change in a pediatric clinical population. Journal of the American Academy of Dermatology, 82(1), 173-179."
  ]
};
