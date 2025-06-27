
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { Atom } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const mRSSSites = [
  { id: 'face', name: 'Face' },
  { id: 'anterior_chest', name: 'Anterior Chest' },
  { id: 'abdomen', name: 'Abdomen' },
  { id: 'fingers_r', name: 'Fingers (Right)' },
  { id: 'fingers_l', name: 'Fingers (Left)' },
  { id: 'hands_r', name: 'Hands (dorsum) (Right)' },
  { id: 'hands_l', name: 'Hands (dorsum) (Left)' },
  { id: 'forearms_r', name: 'Forearms (Right)' },
  { id: 'forearms_l', name: 'Forearms (Left)' },
  { id: 'upper_arms_r', name: 'Upper Arms (Right)' },
  { id: 'upper_arms_l', name: 'Upper Arms (Left)' },
  { id: 'thighs_r', name: 'Thighs (Right)' },
  { id: 'thighs_l', name: 'Thighs (Left)' },
  { id: 'lower_legs_r', name: 'Lower Legs (Right)' },
  { id: 'lower_legs_l', name: 'Lower Legs (Left)' },
  { id: 'feet_r', name: 'Feet (dorsum) (Right)' },
  { id: 'feet_l', name: 'Feet (dorsum) (Left)' },
];

const mRSSScoreOptions: InputOption[] = [
  { value: 0, label: "0 - Normal skin" },
  { value: 1, label: "1 - Mild thickness" },
  { value: 2, label: "2 - Moderate thickness" },
  { value: 3, label: "3 - Severe thickness (unable to pinch)" }
];

const mRSSFormSections: FormSectionConfig[] = mRSSSites.map(site => ({
  id: `mrss_${site.id}`,
  label: `${site.name} Skin Thickness`,
  type: 'select',
  options: mRSSScoreOptions,
  defaultValue: 0,
  validation: getValidationSchema('select', mRSSScoreOptions, 0, 3),
} as InputConfig));

export const mrssTool: Tool = {
  id: "mrss",
  name: "Modified Rodnan Skin Score (mRSS)",
  acronym: "mRSS",
  condition: "Systemic Sclerosis (Scleroderma)",
  keywords: ["mrss", "scleroderma", "systemic sclerosis", "skin thickness", "fibrosis", "Rodnan", "ACR", "EULAR"],
  description: "The mRSS is a semiquantitative tool for assessing skin thickness in systemic sclerosis (SSc). It is used to quantify disease severity, monitor progression, and evaluate response to therapy.",
  sourceType: 'Clinical Guideline',
  icon: Atom,
  rationale: "The mRSS is a semiquantitative tool for assessing skin thickness in systemic sclerosis (SSc). It is used to quantify disease severity, monitor progression, and evaluate response to therapy. The rationale is that skin thickening is a hallmark of SSc and correlates with internal organ involvement and prognosis. The mRSS involves palpation of 17 anatomical sites, each scored from 0 to 3: 0 = normal skin, 1 = mild thickness, 2 = moderate thickness, 3 = severe thickness (hidebound, unable to pinch). The 17 sites are: face, anterior chest, abdomen, right and left upper arms, right and left forearms, right and left hands, right and left fingers, right and left thighs, right and left lower legs, right and left feet. The total score is the sum of scores for all sites, ranging from 0 to 51. The mRSS was developed by Clements et al. and is endorsed by the American College of Rheumatology and the European Alliance of Associations for Rheumatology as the gold standard for skin assessment in SSc.",
  clinicalPerformance: "The mRSS demonstrates good to excellent inter- and intra-rater reliability, with intraclass correlation coefficients (ICCs) typically between 0.7 and 0.9 when performed by experienced assessors. The tool is sensitive to change and is responsive in clinical trials. The main limitation is subjectivity and dependence on examiner skill, which can affect reliability, especially among less experienced clinicians. The mRSS is not a diagnostic test, so sensitivity and specificity are not reported. The mRSS is fully validated as a primary outcome measure in diffuse cutaneous SSc and is widely used in clinical trials. Comparative studies with histopathology and other objective measures (e.g., ultrasound) show moderate to strong correlations, supporting its construct validity. The mRSS is not validated for use outside of SSc. The mRSS is limited by its semi-quantitative nature, subjectivity, and lack of sensitivity to subtle changes in early or limited disease. It does not account for skin pigmentation, edema, or atrophy, and is not validated for other fibrosing skin disorders.",
  formSections: [
    {
      id: 'mrss_assessment_group',
      title: 'Skin Thickness Assessment (0-3 per site)',
      description: 'Assess skin thickness by palpation at each of the 17 sites. 0=Normal, 1=Mild, 2=Moderate, 3=Severe (unable to pinch).',
      gridCols: 3,
      inputs: mRSSFormSections as InputConfig[]
    }
  ],
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const siteScores: Record<string, number> = {};

    mRSSSites.forEach(site => {
      const score = Number(inputs[`mrss_${site.id}`]) || 0;
      totalScore += score;
      siteScores[site.name] = score;
    });

    let severityInterpretation = "";
    if (totalScore === 0) severityInterpretation = "No skin thickening.";
    else if (totalScore <= 14) severityInterpretation = "Limited skin involvement or mild diffuse involvement.";
    else if (totalScore <= 29) severityInterpretation = "Moderate diffuse skin involvement.";
    else severityInterpretation = "Severe diffuse skin involvement.";

    const interpretation = `Total mRSS: ${totalScore} (Range: 0-51). ${severityInterpretation} Higher score indicates greater skin thickness and fibrosis. Used to track disease progression and treatment response.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        Site_Scores: siteScores,
        Overall_Severity_Category: severityInterpretation
      }
    };
  },
  references: [
    "Asano Y, Jinnin M, Kawaguchi Y, et al. Diagnostic Criteria, Severity Classification and Guidelines of Systemic Sclerosis. The Journal of Dermatology. 2018;45(6):633-691. doi:10.1111/1346-8138.14162.",
    "Kumánovics G, Péntek M, Bae S, et al. Assessment of Skin Involvement in Systemic Sclerosis. Rheumatology (Oxford, England). 2017;56(suppl_5):v53-v66. doi:10.1093/rheumatology/kex202."
  ]
};
