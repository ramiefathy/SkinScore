
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Or a more specific icon if available
import { getValidationSchema } from '../toolValidation';

export const pdaiTool: Tool = {
  id: "pdai",
  name: "Pemphigus Disease Area Index (PDAI)",
  acronym: "PDAI",
  condition: "Pemphigus Vulgaris, Pemphigus Foliaceus",
  keywords: ["pdai", "pemphigus", "severity", "blister", "mucosal", "skin activity"],
  description: "Clinician-reported scoring system for pemphigus activity. This version uses pre-calculated sub-scores for Skin, Scalp, and Mucosal involvement.",
  sourceType: 'Clinical Guideline', // Based on International Pemphigus Definitions Group
  icon: ClipboardList,
  formSections: [
    {
      id: "pdai_skin_activity",
      label: "Skin Activity Score (0-120)",
      type: 'number',
      min: 0,
      max: 120,
      defaultValue: 0,
      description: "Enter the calculated skin activity score based on lesion counts and extent across 12 body areas.",
      validation: getValidationSchema('number', [], 0, 120)
    },
    {
      id: "pdai_scalp_activity",
      label: "Scalp Activity Score (0-10)",
      type: 'number',
      min: 0,
      max: 10,
      defaultValue: 0,
      description: "Enter the calculated scalp activity score.",
      validation: getValidationSchema('number', [], 0, 10)
    },
    {
      id: "pdai_mucosal_activity",
      label: "Mucosal Activity Score (0-120)",
      type: 'number',
      min: 0,
      max: 120,
      defaultValue: 0,
      description: "Enter the calculated mucosal activity score based on involvement of 12 mucosal sites (original comprehensive scoring). Simpler versions might cap mucosal at 30.",
      validation: getValidationSchema('number', [], 0, 120)
    }
  ],
  calculationLogic: (inputs) => {
    const skinScore = Number(inputs.pdai_skin_activity) || 0;
    const scalpScore = Number(inputs.pdai_scalp_activity) || 0;
    const mucosalScore = Number(inputs.pdai_mucosal_activity) || 0;

    const totalPdaiscore = skinScore + scalpScore + mucosalScore; // Max 120 + 10 + 120 = 250

    let severity = "Not well defined for this cumulative score version without specific cutoffs for a 0-250 scale. ";
    if (totalPdaiscore === 0) severity = "No activity (remission). ";
    else if (totalPdaiscore < 15) severity = "Mild pemphigus activity. ";
    else if (totalPdaiscore <= 45) severity = "Moderate pemphigus activity. ";
    else severity = "Severe pemphigus activity. ";
    
    const interpretation = `Total PDAI Score: ${totalPdaiscore.toFixed(0)} (Max: 250, based on Skin 0-120, Scalp 0-10, Mucosal 0-120).
Severity: ${severity}
(Commonly cited cut-offs: <15 Mild, 15-45 Moderate, >45 Severe for a combined score, but original PDAI interpretation is more nuanced and often focuses on individual domain scores or specific trial definitions).`;

    return {
      score: totalPdaiscore,
      interpretation,
      details: {
        Skin_Activity_Score: skinScore,
        Scalp_Activity_Score: scalpScore,
        Mucosal_Activity_Score: mucosalScore,
        Total_Calculated_PDAI: totalPdaiscore,
        Severity_Interpretation: severity
      }
    };
  },
  references: [
    "Harmon K, et al. Development of the Pemphigus Disease Area Index (PDAI). J Invest Dermatol. 2008;128(5):1200-1206.",
    "Murrell DF, et al. Definitions and outcome measures for pemphigus: recommendations by an international panel of experts. J Am Acad Dermatol. 2008;58(6):1043-1046.",
    "Rosenbach M, et al. International Pemphigus Definitions Group. Reliability of the Pemphigus Disease Area Index. JAMA Dermatol. 2014;150(1):86-88."
  ]
};
