import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const loscatTool: Tool = {
  id: "loscat",
  name: "Localized Scleroderma Cutaneous Assessment Tool (LoSCAT)",
  acronym: "LoSCAT",
  condition: "Localized Scleroderma (Morphea)",
  keywords: ["loscat", "morphea", "localized scleroderma", "activity", "damage", "pga", "mrss", "LoSAI", "LoSDI", "mLoSSI"],
  description: "The LoSCAT (Localized Scleroderma Cutaneous Assessment Tool) combines the modified Localized Scleroderma Skin Severity Index (mLoSSI, assessing activity: new/enlarging lesions, erythema, skin thickness) and the Localized Scleroderma Damage Index (LoSDI, assessing damage: dermal atrophy, subcutaneous atrophy, dyspigmentation). Each item within these sub-indices is typically scored 0–3 per lesion, then summed for total activity (LoSAI/mLoSSI) and damage (LoSDI) scores. LoSCAT is validated, sensitive to change, and widely used in morphea trials. It provides separate activity and damage indices, unlike single-dimension global assessments (e.g., HS-PGA or IGA), and is more responsive than static staging systems like Hurley staging. This tool expects pre-calculated LoSAI and LoSDI scores as input.",
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  formSections: [
    {
      id: "activityIndex",
      label: "LoSAI / mLoSSI (Activity Index) Score",
      type: 'number',
      min: 0,
      defaultValue: 0,
      description: "Enter the pre-calculated LoSAI or mLoSSI score.",
      validation: getValidationSchema('number',[],0)
    },
    {
      id: "damageIndex",
      label: "LoSDI (Damage Index) Score",
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
    // Standard LoSCAT Activity (mLoSSI/LoSAI) severity bands
    if (activityScore === 0) activitySeverity = "No activity";
    else if (activityScore <= 4) activitySeverity = "Mild Activity";
    else if (activityScore <= 12) activitySeverity = "Moderate Activity";
    else activitySeverity = "Severe Activity";

    let damageSeverity = "";
    // Standard LoSCAT Damage (LoSDI) severity bands
    if (damageScore === 0) damageSeverity = "No damage";
    else if (damageScore <= 10) damageSeverity = "Mild Damage";
    else if (damageScore <= 15) damageSeverity = "Moderate Damage";
    else damageSeverity = "Severe Damage";

    const mainScoreDisplay = `Activity: ${activityScore}, Damage: ${damageScore}`;

    const interpretation = `LoSCAT Assessment Results:
Activity (LoSAI/mLoSSI): ${activityScore} (${activitySeverity}).
Damage (LoSDI): ${damageScore} (${damageSeverity}).
Severity Bands:
LoSAI/mLoSSI (Activity): 0 No activity; 1–4 Mild; 5–12 Moderate; ≥13 Severe.
LoSDI (Damage): 0 No damage; 1–10 Mild; 11–15 Moderate; ≥16 Severe.`;

    return {
      score: mainScoreDisplay,
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
