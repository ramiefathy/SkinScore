
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
  description: "The modified Rodnan Skin Score (mRSS) is the standard for evaluating skin thickness in systemic sclerosis. Seventeen body sites (face, anterior chest, abdomen, fingers, dorsum of hands, forearms, upper arms, thighs, lower legs, dorsum of feet - assessed bilaterally for extremities) are each scored by palpation from 0 (normal) to 3 (severe thickening where skin cannot be pinched), yielding a total score of 0–51. No weighting is applied; all sites contribute equally. The mRSS is validated, reproducible, and recommended by the American College of Rheumatology and the European Alliance of Associations for Rheumatology for both clinical and research use. Unlike ISS or LoSCAT, mRSS focuses solely on skin thickness, not erythema or other features.",
  sourceType: 'Clinical Guideline',
  icon: Atom,
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
    "Clements P, Lachenbruch P, Siebold J, et al. Inter- and intraobserver variability of total skin thickness score (modified Rodnan TSS) in systemic sclerosis. J Rheumatol. 1995;22(7):1281-1285.",
    "Khanna D, Furst DE, Clements PJ, et al. Minimal clinically important differences for the Rodnan skin score in systemic sclerosis. Arthritis Rheum. 2009;60(8):2493-2502.",
    "van den Hoogen F, Khanna D, Fransen J, et al. 2013 classification criteria for systemic sclerosis: an American college of rheumatology/European league against rheumatism collaborative initiative. Arthritis Rheum. 2013 Nov;65(11):2737-47."
  ]
};

