
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const absisFormSections: FormSectionConfig[] = [
  {
    id: 'absis_skin_involvement_group',
    title: 'Skin Involvement (Max Score: 150)',
    description: 'Estimate total body surface area (BSA) percentage for each lesion type. The sum of these BSAs should not exceed 100%.',
    gridCols: 1,
    inputs: [
      {
        id: "bsa_re_epithelialized",
        label: "BSA % with Re-epithelialized (Healing) Lesions",
        type: 'number', min: 0, max: 100, step: 1, defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 100),
        description: "Score contribution: BSA % x 0.5"
      },
      {
        id: "bsa_dry_erosions",
        label: "BSA % with Dry Erosions/Crusts",
        type: 'number', min: 0, max: 100, step: 1, defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 100),
        description: "Score contribution: BSA % x 1.0"
      },
      {
        id: "bsa_active_erosions",
        label: "BSA % with Active Wet Erosions/Blisters",
        type: 'number', min: 0, max: 100, step: 1, defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 100),
        description: "Score contribution: BSA % x 1.5"
      }
    ]
  },
  {
    id: 'absis_mucosal_involvement_group',
    title: 'Mucosal Involvement (Max Score: 56)',
    gridCols: 1,
    inputs: [
      {
        id: "oral_sites_affected",
        label: "Number of Oral Mucosal Sites Affected (0-11)",
        type: 'number', min: 0, max: 11, step: 1, defaultValue: 0,
        description: "Score contribution: 1 point per site (Max 11 points). Sites include: upper/lower lip, buccal mucosa (R/L), hard/soft palate, tongue dorsum/ventrum, floor of mouth, gingiva, pharynx.",
        validation: getValidationSchema('number', [], 0, 11)
      },
      {
        id: "oral_discomfort_vas",
        label: "Oral Discomfort VAS (Patient-Reported, 0-45)",
        type: 'number', min: 0, max: 45, step: 1, defaultValue: 0,
        description: "Patient rates overall oral discomfort (0=none; 45=worst imaginable). This often reflects combined pain and functional impairment (e.g., with eating). Max 45 points.",
        validation: getValidationSchema('number', [], 0, 45)
      }
    ]
  }
];

export const absisTool: Tool = {
  id: "absis",
  name: "Autoimmune Bullous Skin Disorder Intensity Score",
  acronym: "ABSIS",
  description: "Clinician-reported instrument to quantify disease severity in pemphigus. It combines scores for skin lesion extent and quality (Max 150), number of affected oral mucosal sites (Max 11), and patient-reported oral discomfort (Max 45). Total score up to 206.",
  condition: "Pemphigus Vulgaris, Pemphigus Foliaceus",
  keywords: ["absis", "pemphigus", "bullous disease", "body surface area", "blister", "erosion", "mucosal involvement", "oral pain"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: absisFormSections,
  calculationLogic: (inputs) => {
    const bsaReEpithelialized = Number(inputs.bsa_re_epithelialized) || 0;
    const bsaDryErosions = Number(inputs.bsa_dry_erosions) || 0;
    const bsaActiveErosions = Number(inputs.bsa_active_erosions) || 0;

    const totalBSAInput = bsaReEpithelialized + bsaDryErosions + bsaActiveErosions;
    let skinScoreWarning = totalBSAInput > 100 ? `Warning: Sum of BSA inputs (${totalBSAInput}%) exceeds 100%. Score calculated based on entered values.` : "";


    const skinScore = (bsaReEpithelialized * 0.5) + (bsaDryErosions * 1.0) + (bsaActiveErosions * 1.5);
    const finalSkinScore = parseFloat(skinScore.toFixed(1));

    const oralSitesAffectedScore = Number(inputs.oral_sites_affected) || 0;
    const oralDiscomfortScore = Number(inputs.oral_discomfort_vas) || 0;
    const finalMucosalScore = oralSitesAffectedScore + oralDiscomfortScore; // Max 11 + 45 = 56

    const totalAbsisScore = parseFloat((finalSkinScore + finalMucosalScore).toFixed(1));

    let severityCategory = "Undefined";
    if (totalAbsisScore === 0) severityCategory = "Healed / No activity";
    else if (totalAbsisScore <= 16) severityCategory = "Mild activity"; // Example cut-off, can vary. Some use <17 for mild.
    else if (totalAbsisScore <= 50) severityCategory = "Moderate activity";
    else severityCategory = "Severe activity";

    let interpretation = `Total ABSIS Score: ${totalAbsisScore.toFixed(1)} (Range: 0-206).
Skin Score: ${finalSkinScore.toFixed(1)} (Max: 150).
Mucosal Score (Extent + Discomfort): ${finalMucosalScore} (Max: 56).
Severity Category (example): ${severityCategory}. (Mild: <17; Moderate: 17-50; Severe: >50 - specific cutoffs vary by study).`;
    if(skinScoreWarning) interpretation += `\n${skinScoreWarning}`;

    return {
      score: totalAbsisScore,
      interpretation,
      details: {
        Skin_Score_Calculated: finalSkinScore,
        BSA_Re_epithelialized: bsaReEpithelialized,
        BSA_Dry_Erosions: bsaDryErosions,
        BSA_Active_Erosions: bsaActiveErosions,
        Oral_Sites_Affected_Score: oralSitesAffectedScore,
        Oral_Discomfort_VAS_Score: oralDiscomfortScore,
        Total_Mucosal_Score: finalMucosalScore,
        Total_ABSIS_Score_Calculated: totalAbsisScore,
        Severity_Category_Example: severityCategory,
        BSA_Input_Warning: skinScoreWarning || "None"
      }
    };
  },
  references: [
    "Pfütze M, et al. Introducing a novel Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) in Pemphigus. Eur J Dermatol. 2007;17(1):4-11.", // Corrected reference from JEADV to Eur J Dermatol
    "Judassohn S, et al. Comparison of the Pemphigus Disease Area Index (PDAI) and the Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) in pemphigus. J Eur Acad Dermatol Venereol. 2009 Nov;23(11):1341-3.",
    "Sebaratnam DF, et al. Outcome measures for pemphigus and pemphigoid. J Dermatol. 2014 Mar;41(3):219-25."
  ]
};

    