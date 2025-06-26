
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Or a more specific icon if available
import { getValidationSchema } from '../toolValidation';

export const pdaiTool: Tool = {
  id: "pdai",
  name: "Pemphigus Disease Area Index (PDAI)",
  acronym: "PDAI",
  condition: "Pemphigus Vulgaris, Pemphigus Foliaceus",
  keywords: ["pdai", "pemphigus", "severity", "blister", "mucosal", "skin activity"],
  description: "The PDAI was developed by the International Pemphigus Definitions Group to provide an objective, reproducible, and standardized measure of disease activity and damage in pemphigus, a rare autoimmune blistering disorder. The rationale for its development was the need for a reliable tool to quantify disease severity for both clinical trials and routine practice, facilitating consistent assessment and comparison across studies and centers. The PDAI was designed to overcome limitations of previous indices by offering detailed anatomical site-based scoring and by distinguishing between disease activity and chronic damage.",
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
    else if (totalPdaiscore <= 15) severity = "Mild pemphigus activity. "; // using ≤15 for mild based on new text
    else if (totalPdaiscore <= 44) severity = "Moderate pemphigus activity. "; // Using 16-44 based on new text
    else severity = "Extensive pemphigus activity. "; // Using >=45 for extensive
    
    const interpretation = `Total PDAI Score: ${totalPdaiscore.toFixed(0)} (Max: 250).
Severity: ${severity}
(Cut-offs for activity: ≤15 Mild, 16-44 Moderate, ≥45 Extensive).
An improvement of >2.6 points or a worsening of >2.5 points is considered clinically meaningful (MCID).`;

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
    "Large International Validation of ABSIS and PDAI Pemphigus Severity Scores. Hébert V, Boulard C, Houivet E, et al. The Journal of Investigative Dermatology. 2019;139(1):31-37. doi:10.1016/j.jid.2018.04.042.",
    "Calculation of Cut-Off Values Based on the Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) and Pemphigus Disease Area Index (PDAI) Pemphigus Scoring Systems for Defining Moderate, Significant and Extensive Types of Pemphigus. Boulard C, Duvert Lehembre S, Picard-Dahan C, et al. The British Journal of Dermatology. 2016;175(1):142-9. doi:10.1111/bjd.14405.",
    "Pemphigus Disease and Area Index: Unmet Needs in the Real-World Management of Pemphigus. Mahmoudi H, Toosi R, Salehi Farid A, Daneshpazhooh M. Oral Diseases. 2024;30(4):2275-2277. doi:10.1111/odi.14713.",
    "Pemphigus Disease Activity Measurements: Pemphigus Disease Area Index, Autoimmune Bullous Skin Disorder Intensity Score, and Pemphigus Vulgaris Activity Score. Rahbar Z, Daneshpazhooh M, Mirshams-Shahshahani M, et al. JAMA Dermatology. 2014;150(3):266-72. doi:10.1001/jamadermatol.2013.8175.",
    "Reliability and Convergent Validity of Two Outcome Instruments for Pemphigus. Rosenbach M, Murrell DF, Bystryn JC, et al. The Journal of Investigative Dermatology. 2009;129(10):2404-10. doi:10.1038/jid.2009.72.",
    "Establishing Minimal Clinically Important Differences For the Pemphigus Disease Area Index. Tseng H, Stone C, Shulruf B, Murrell DF. The British Journal of Dermatology. 2024;191(5):823-831. doi:10.1093/bjd/ljae283.",
    "Assessing the Correlation Between Disease Severity Indices and Quality of Life Measurement Tools in Pemphigus. Krain RL, Kushner CJ, Tarazi M, et al. Frontiers in Immunology. 2019;10:2571. doi:10.3389/fimmu.2019.02571."
  ]
};
