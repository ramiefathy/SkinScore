import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Or a more specific icon if available
import { getValidationSchema } from '../toolValidation';

export const pdaiTool: Tool = {
  id: "pdai",
  name: "Pemphigus Disease Area Index (PDAI)",
  acronym: "PDAI",
  condition: "Pemphigus Vulgaris, Pemphigus Foliaceus",
  keywords: ["pdai", "pemphigus", "severity", "blister", "mucosal", "skin activity"],
  description: "The Pemphigus Disease Area Index (PDAI) was developed by the International Pemphigus Definitions Group to provide an objective, reproducible, and standardized measure of disease activity and damage in pemphigus, a rare autoimmune blistering disorder.",
  sourceType: 'Clinical Guideline', // Based on International Pemphigus Definitions Group
  icon: ClipboardList,
  rationale: "The rationale for its development was the need for a reliable tool to quantify disease severity for both clinical trials and routine practice, facilitating consistent assessment and comparison across studies and centers. The PDAI was designed to overcome limitations of previous indices by offering detailed anatomical site-based scoring and by distinguishing between disease activity and chronic damage.\n\nCalculation and Scoring\nThe PDAI is divided into three main domains: skin activity, scalp activity, and mucosal activity, with an additional domain for damage.\n- Skin Activity: Assessed across 12 anatomical sites, each scored from 0 to 10 based on the number and size of lesions, for a maximum skin activity score of 120.\n- Scalp Activity: Scored separately with a maximum of 10 points.\n- Mucosal Activity: Assessed at three sites (oral, nasal, other), each scored from 0 to 12, for a maximum of 36 points.\n- Damage: Scored for skin and mucosa, with a maximum of 13 points.\n\nThe total PDAI score is the sum of activity and damage subscores, with a maximum possible score of 263.\nCut-off values have been established to define moderate (≤15), significant (16–44), and extensive (≥45) disease activity. An improvement of >2.65 points or a worsening of >2.5 points is considered clinically meaningful (MCID).",
  clinicalPerformance: "The PDAI has demonstrated high interrater and intrarater reliability. In a large international validation study, the intraclass correlation coefficient (ICC) for the PDAI was 0.91 (95% CI: 0.87–0.94) at baseline, with higher reliability in moderate and extensive disease. Other studies have reported ICCs as high as 0.98 for interrater reliability and 0.98 for intrarater reliability, indicating excellent reproducibility. The PDAI also shows strong convergent validity, correlating well with the Physician Global Assessment (PGA) and with changes in quality of life as measured by the Autoimmune Bullous Disease Quality of Life (ABQOL) and Skindex-29 instruments.\n\nSensitivity and specificity for clinically meaningful change have been reported in the context of MCID determination, with values of 75.9% and 73.5% for improvement, and 72.7% and 81.0% for deterioration, respectively. The PDAI is superior to the Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) and Pemphigus Vulgaris Activity Score (PVAS) in terms of reliability and validity, particularly for skin activity.\n\nValidation and Comparative Studies\nMultiple studies have validated the PDAI in international, multicenter cohorts, confirming its reliability and validity across diverse populations. Comparative studies consistently show that the PDAI outperforms ABSIS and PVAS in terms of interrater reliability and correlation with physician impression and quality of life measures. The PDAI is recommended as the preferred outcome measure for multicenter studies in pemphigus.\n\nReal-World Implementation\nWhile the PDAI is reliable and effective in clinical trials, its complexity and time requirements can limit its use in routine practice. Recent commentary has highlighted the need for simplification and clarification of scoring criteria to enhance feasibility in daily care, though no formal revisions have yet been implemented. The PDAI remains the gold standard for clinical trials, but clinicians should be aware of its practical limitations in real-world settings.",
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
      label: "Mucosal Activity Score (0-36)",
      type: 'number',
      min: 0,
      max: 36,
      defaultValue: 0,
      description: "Enter the calculated mucosal activity score based on involvement of oral, nasal, and other sites.",
      validation: getValidationSchema('number', [], 0, 36)
    },
    {
      id: "pdai_damage_score",
      label: "Damage Score (0-13)",
      type: 'number',
      min: 0,
      max: 13,
      defaultValue: 0,
      description: "Enter the calculated damage score for skin and mucosa.",
      validation: getValidationSchema('number', [], 0, 13)
    }
  ],
  calculationLogic: (inputs) => {
    const skinScore = Number(inputs.pdai_skin_activity) || 0;
    const scalpScore = Number(inputs.pdai_scalp_activity) || 0;
    const mucosalScore = Number(inputs.pdai_mucosal_activity) || 0;
    const damageScore = Number(inputs.pdai_damage_score) || 0;

    const totalPdaiscore = skinScore + scalpScore + mucosalScore + damageScore;

    const totalActivityScore = skinScore + scalpScore + mucosalScore;
    let severity = "Not applicable with damage score";
    if (damageScore === 0) {
        if (totalActivityScore <= 15) severity = "Mild pemphigus activity";
        else if (totalActivityScore <= 44) severity = "Moderate pemphigus activity";
        else severity = "Extensive pemphigus activity";
    }

    const interpretation = `Total PDAI Score: ${totalPdaiscore.toFixed(0)} (Max: 263).\nTotal Activity Score: ${totalActivityScore} (Max: 166). Severity (based on activity): ${severity}.\n(Activity Cut-offs: ≤15 Mild, 16-44 Moderate, ≥45 Extensive). An improvement of >2.65 points or a worsening of >2.5 points is considered clinically meaningful (MCID).`;

    return {
      score: totalPdaiscore,
      interpretation,
      details: {
        Skin_Activity_Score: skinScore,
        Scalp_Activity_Score: scalpScore,
        Mucosal_Activity_Score: mucosalScore,
        Damage_Score: damageScore,
        Total_Activity_Score: totalActivityScore,
        Total_PDAI_Score: totalPdaiscore,
        Severity_Interpretation: severity
      }
    };
  },
  references: [
    "Hébert V, Boulard C, Houivet E, et al. Large International Validation of ABSIS and PDAI Pemphigus Severity Scores. The Journal of Investigative Dermatology. 2019;139(1):31-37. doi:10.1016/j.jid.2018.04.042.",
    "Boulard C, Duvert Lehembre S, Picard-Dahan C, et al. Calculation of Cut-Off Values Based on the Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) and Pemphigus Disease Area Index (PDAI) Pemphigus Scoring Systems for Defining Moderate, Significant and Extensive Types of Pemphigus. The British Journal of Dermatology. 2016;175(1):142-9. doi:10.1111/bjd.14405.",
    "Mahmoudi H, Toosi R, Salehi Farid A, Daneshpazhooh M. Pemphigus Disease and Area Index: Unmet Needs in the Real-World Management of Pemphigus. Oral Diseases. 2024;30(4):2275-2277. doi:10.1111/odi.14713.",
    "Rahbar Z, Daneshpazhooh M, Mirshams-Shahshahani M, et al. Pemphigus Disease Activity Measurements: Pemphigus Disease Area Index, Autoimmune Bullous Skin Disorder Intensity Score, and Pemphigus Vulgaris Activity Score. JAMA Dermatology. 2014;150(3):266-72. doi:10.1001/jamadermatol.2013.8175.",
    "Rosenbach M, Murrell DF, Bystryn JC, et al. Reliability and Convergent Validity of Two Outcome Instruments for Pemphigus. The Journal of Investigative Dermatology. 2009;129(10):2404-10. doi:10.1038/jid.2009.72.",
    "Tseng H, Stone C, Shulruf B, Murrell DF. Establishing Minimal Clinically Important Differences For the Pemphigus Disease Area Index. The British Journal of Dermatology. 2024;191(5):823-831. doi:10.1093/bjd/ljae283.",
    "Krain RL, Kushner CJ, Tarazi M, et al. Assessing the Correlation Between Disease Severity Indices and Quality of Life Measurement Tools in Pemphigus. Frontiers in Immunology. 2019;10:2571. doi:10.3389/fimmu.2019.02571."
  ]
};
