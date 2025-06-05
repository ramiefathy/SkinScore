
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const absisBodyRegions = [
  { id: 'head_neck', name: 'Head & Neck', bsaWeight: 0.09 }, // 9%
  { id: 'trunk_anterior', name: 'Trunk Anterior', bsaWeight: 0.18 }, // 18%
  { id: 'trunk_posterior', name: 'Trunk Posterior', bsaWeight: 0.18 }, // 18%
  { id: 'right_upper_extremity', name: 'Right Upper Extremity (incl. hand)', bsaWeight: 0.09 }, // 9%
  { id: 'left_upper_extremity', name: 'Left Upper Extremity (incl. hand)', bsaWeight: 0.09 }, // 9%
  { id: 'right_lower_extremity', name: 'Right Lower Extremity (incl. foot)', bsaWeight: 0.18 }, // 18%
  { id: 'left_lower_extremity', name: 'Left Lower Extremity (incl. foot)', bsaWeight: 0.18 }, // 18%
  { id: 'genital_area', name: 'Genital Area', bsaWeight: 0.01 }, // 1%
]; // Total 100%

const absisLesionQualityOptions: InputOption[] = [
  { value: 0.5, label: "0.5 - Re-epithelialized (Healed)" },
  { value: 1.0, label: "1.0 - Dry, Erosive" },
  { value: 1.5, label: "1.5 - Exudative, Erosive" },
];

const absisMucosalSites = [
  { id: 'buccal', name: 'Buccal mucosa' },
  { id: 'palate', name: 'Palate' },
  { id: 'tongue', name: 'Tongue' },
  { id: 'pharynx', name: 'Pharynx' },
  { id: 'larynx', name: 'Larynx' },
  { id: 'conjunctiva', name: 'Conjunctiva' },
  { id: 'nasal', name: 'Nasal mucosa' },
  { id: 'esophagus', name: 'Esophagus (if tested)' },
  { id: 'genital', name: 'Genital mucosa' },
  { id: 'rectal_anal', name: 'Rectal/anal mucosa' },
  { id: 'other_mucosal', name: 'Other mucosal (specify)' },
];

const absisSkinInputs: InputGroupConfig[] = absisBodyRegions.map(region => ({
  id: `absis_skin_group_${region.id}`,
  title: `${region.name} (Region BSA: ${region.bsaWeight * 100}%)`,
  gridCols: 2,
  inputs: [
    {
      id: `absis_skin_area_percent_${region.id}`,
      label: `% of this Region Affected`,
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0,
      description: `Enter percentage (0-100) of the ${region.name} that has lesions.`,
      validation: getValidationSchema('number', [], 0, 100),
    },
    {
      id: `absis_skin_quality_${region.id}`,
      label: `Predominant Lesion Quality in Affected Part`,
      type: 'select',
      options: absisLesionQualityOptions,
      defaultValue: 0.5, // Default to healed if area is 0, or user must select
      validation: getValidationSchema('select', absisLesionQualityOptions, 0.5, 1.5)
    }
  ]
}));

const absisMucosalInputs: InputConfig[] = absisMucosalSites.map(site => ({
  id: `absis_mucosal_${site.id}`,
  label: site.name,
  type: 'select',
  options: [ { value: 0, label: "Absent" }, { value: 1, label: "Present" } ],
  defaultValue: 0,
  validation: getValidationSchema('select', [], 0, 1)
}));

export const absisTool: Tool = {
  id: "absis",
  name: "Autoimmune Bullous Skin Disorder Intensity Score",
  acronym: "ABSIS",
  description: "Clinician-reported instrument to quantify disease severity in pemphigus, combining objective measures of skin and mucosal involvement with patient-reported oral discomfort.",
  condition: "Pemphigus Vulgaris, Pemphigus Foliaceus",
  keywords: ["absis", "pemphigus", "bullous disease", "body surface area", "blister", "erosion", "mucosal involvement", "oral pain"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: [
    {
      id: 'absis_skin_overall_group',
      title: 'Skin Involvement (Max Score: 150)',
      description: 'For each body region, estimate the percentage of THAT REGION affected by lesions and select the predominant quality of those lesions.',
      inputs: [], // Placeholder, groups will be pushed below
      gridCols: 1, // Each region group will be a full-width item
    } as InputGroupConfig, // Type assertion
    ...absisSkinInputs, // Spread the array of InputGroupConfig for skin regions
    {
      id: 'absis_mucosal_overall_group',
      title: 'Mucosal Involvement (Max Score: 11)',
      gridCols: 2, // Arrange mucosal sites in 2 columns
      inputs: absisMucosalInputs
    },
    {
      id: 'absis_oral_discomfort_group',
      title: 'Oral Discomfort (Patient-Reported, Max Score: 45)',
      gridCols: 1,
      inputs: [
        {
          id: "absis_oral_discomfort_vas",
          label: "Oral Discomfort VAS (0-45)",
          type: 'number',
          min: 0,
          max: 45,
          step: 1,
          defaultValue: 0,
          description: "Patient rates oral discomfort during eating/drinking (0=none; 45=worst imaginable).",
          validation: getValidationSchema('number', [], 0, 45)
        }
      ]
    }
  ],
  calculationLogic: (inputs) => {
    let skinScoreSum = 0;
    const skinDetails: Record<string, any> = {};

    absisBodyRegions.forEach(region => {
      const percentOfRegionAffected = Number(inputs[`absis_skin_area_percent_${region.id}`]) || 0;
      const qualityScoreValue = Number(inputs[`absis_skin_quality_${region.id}`]) || 0.5;
      
      // Contribution = (% of region involved) * (region's BSA weight) * (quality score)
      // This is then summed and the total is the skin score, which can go up to 150 if 100% of body is quality 1.5
      const regionalContribution = (percentOfRegionAffected / 100) * region.bsaWeight * qualityScoreValue;
      skinScoreSum += regionalContribution;
      skinDetails[region.name] = {
        percent_affected_in_region: percentOfRegionAffected,
        quality_score_value: qualityScoreValue,
        weighted_contribution: parseFloat((regionalContribution * 100).toFixed(2)) // Scale up for readability if desired, or keep as fraction
      };
    });
    // The skinScoreSum is currently a fraction (e.g. 1.0 if 100% body surface is quality 1).
    // It needs to be scaled to the 0-150 range. Multiply by 100.
    const finalSkinScore = parseFloat((skinScoreSum * 100).toFixed(1));


    let mucosalScore = 0;
    const mucosalDetails: Record<string, number> = {};
    absisMucosalSites.forEach(site => {
      const siteValue = Number(inputs[`absis_mucosal_${site.id}`]) || 0;
      mucosalScore += siteValue;
      mucosalDetails[site.name] = siteValue;
    });

    const oralDiscomfortScore = Number(inputs.absis_oral_discomfort_vas) || 0;

    const totalAbsisScore = finalSkinScore + mucosalScore + oralDiscomfortScore;

    let severityCategory = "Undefined";
    if (totalAbsisScore <= 6.4) severityCategory = "Mild";
    else if (totalAbsisScore <= 31.5) severityCategory = "Moderate"; // Covers >6.4 to 31.5
    else severityCategory = "Severe"; // Covers >31.5

    const interpretation = `Total ABSIS Score: ${totalAbsisScore.toFixed(1)} (Range: 0-206).
Skin Score: ${finalSkinScore.toFixed(1)} (Max: 150).
Mucosal Score: ${mucosalScore} (Max: 11).
Oral Discomfort Score: ${oralDiscomfortScore} (Max: 45).
Severity Category: ${severityCategory} (Mild: ≤6.4; Moderate: >6.4 to ≤31.5; Severe: >31.5).`;

    return {
      score: parseFloat(totalAbsisScore.toFixed(1)),
      interpretation,
      details: {
        Skin_Score_Calculated: finalSkinScore,
        Mucosal_Score_Calculated: mucosalScore,
        Oral_Discomfort_Score_Input: oralDiscomfortScore,
        Total_ABSIS_Score_Calculated: parseFloat(totalAbsisScore.toFixed(1)),
        Severity_Category: severityCategory,
        Skin_Regional_Details: skinDetails,
        Mucosal_Site_Details: mucosalDetails
      }
    };
  },
  references: [
    "Pfütze M, et al. Introducing a novel Autoimmune Bullous Skin Disorder Intensity Score (ABSIS) in Pemphigus. J Eur Acad Dermatol Venereol. 2007;21(3):317–324.",
    "Monika Jagielska, et al. The Autoimmune Bullous Skin Disorder Intensity Score (ABSIS): Validation and Utility in a Cohort of Patients with Pemphigus. Clin Exp Dermatol. 2017;42(5):510–517.",
    "Nousha Mardani, et al. Estimated cut-off values for pemphigus severity classification using the ABSIS scoring system. BMC Dermatol. 2020;20:36.",
    "Fahimeh Mirzayan, et al. Assessment of the Correlation Between Disease Severity Indices and Anti-Desmoglein 1/3 Titers in Pemphigus: A Cross-Sectional Study. Front Immunol. 2019;10:2571."
  ]
};
