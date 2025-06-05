
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bpdaiskinSites = [
  { id: 'scalp', name: 'Scalp', bsaWeight: 9 },
  { id: 'face', name: 'Face', bsaWeight: 4.5 },
  { id: 'neck', name: 'Neck', bsaWeight: 4.5 },
  { id: 'upper_trunk', name: 'Upper Trunk (chest/back above waist)', bsaWeight: 9 },
  { id: 'lower_trunk', name: 'Lower Trunk (abdomen/back below waist)', bsaWeight: 9 },
  { id: 'r_upper_arm', name: 'Right Upper Arm/Shoulder', bsaWeight: 9 },
  { id: 'l_upper_arm', name: 'Left Upper Arm/Shoulder', bsaWeight: 9 },
  { id: 'r_lower_arm', name: 'Right Lower Arm/Forearm/Hand', bsaWeight: 4.5 },
  { id: 'l_lower_arm', name: 'Left Lower Arm/Forearm/Hand', bsaWeight: 4.5 },
  { id: 'r_thigh', name: 'Right Thigh/Upper Leg', bsaWeight: 9 },
  { id: 'l_thigh', name: 'Left Thigh/Upper Leg', bsaWeight: 9 },
  { id: 'r_lower_leg', name: 'Right Lower Leg', bsaWeight: 4.5 },
  { id: 'l_lower_leg', name: 'Left Lower Leg', bsaWeight: 4.5 },
  { id: 'r_foot', name: 'Right Foot', bsaWeight: 1 },
  { id: 'l_foot', name: 'Left Foot', bsaWeight: 1 },
];

const totalSiteBsaWeight = bpdaiskinSites.reduce((sum, site) => sum + site.bsaWeight, 0); // Should be 92

const bpdaimucosalSites = [
  { id: 'buccal', name: 'Buccal mucosa' },
  { id: 'palate', name: 'Palate' },
  { id: 'tongue', name: 'Tongue' },
  { id: 'pharynx', name: 'Pharynx' },
  { id: 'conjunctiva', name: 'Conjunctiva' },
  { id: 'genital', name: 'Genital mucosa' },
];

const bpdaipruritusInputs: InputConfig[] = [
  { id: 'pruritus_current_nrs', label: 'Current Pruritus (0-10 NRS)', type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number', [], 0, 10), description: "Rate current pruritus (0 = none; 10 = worst imaginable)." },
  { id: 'pruritus_pastmonth_nrs', label: 'Worst Pruritus in Past Month (0-10 NRS)', type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number', [], 0, 10), description: "Rate worst pruritus in past month." },
  { id: 'pruritus_avgmonth_nrs', label: 'Average Pruritus in Past Month (0-10 NRS)', type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number', [], 0, 10), description: "Rate average pruritus in past month." },
];

export const bpdaiTool: Tool = {
  id: "bpdai",
  name: "Bullous Pemphigoid Disease Area Index",
  acronym: "BPDAI",
  description: "Clinician-reported instrument to quantify disease activity in bullous pemphigoid (BP), assessing cutaneous activity (blisters/erosions, urticaria/erythema), mucosal activity, and pruritus.",
  condition: "Bullous Pemphigoid",
  keywords: ["bpdai", "bullous pemphigoid", "lesion scoring", "pruritus", "mucosal involvement", "urticaria", "erythema", "blister"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: [
    {
      id: 'bpdai_skin_blisters_group',
      title: 'Skin Activity: Blisters/Erosions (Max Score: 120)',
      gridCols: 2,
      description: `For each of the ${bpdaiskinSites.length} sites, enter the percentage of THAT SITE'S AREA covered by active blisters or erosions.`,
      inputs: bpdaiskinSites.map(site => ({
        id: `skin_blister_bsa_percent_${site.id}`,
        label: `${site.name} Blister/Erosion BSA % (Site Weight: ${site.bsaWeight}%)`,
        type: 'number',
        min: 0,
        max: 100,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 100),
      } as InputConfig))
    },
    {
      id: 'bpdai_skin_urticaria_group',
      title: 'Skin Activity: Urticaria/Erythema (Max Score: 120)',
      gridCols: 2,
      description: `For each of the ${bpdaiskinSites.length} sites, enter the percentage of THAT SITE'S AREA covered by urticarial or erythematous lesions (without blisters).`,
      inputs: bpdaiskinSites.map(site => ({
        id: `skin_urticaria_bsa_percent_${site.id}`,
        label: `${site.name} Urticaria/Erythema BSA % (Site Weight: ${site.bsaWeight}%)`,
        type: 'number',
        min: 0,
        max: 100,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 100),
      } as InputConfig))
    },
    {
      id: 'bpdai_mucosal_activity_group',
      title: 'Mucosal Activity (Max Score: 120)',
      gridCols: 2,
      description: 'For each mucosal site, indicate if bullous/erosive lesions are present (1) or absent (0).',
      inputs: bpdaimucosalSites.map(site => ({
        id: `mucosal_bullous_${site.id}`,
        label: `${site.name} Involvement`,
        type: 'select',
        options: [{ value: 0, label: "Absent (0)" }, { value: 1, label: "Present (1)" }],
        defaultValue: 0,
        validation: getValidationSchema('select', [], 0, 1),
      } as InputConfig))
    },
    {
      id: 'bpdai_pruritus_group',
      title: 'Pruritus Component (Max Score: 30)',
      gridCols: 1,
      inputs: bpdaipruritusInputs
    }
  ],
  calculationLogic: (inputs) => {
    let unscaledBlisterScore = 0;
    const blisterDetails: Record<string, number> = {};
    bpdaiskinSites.forEach(site => {
      const siteBlisterPercent = Number(inputs[`skin_blister_bsa_percent_${site.id}`]) || 0;
      blisterDetails[`${site.name}_Blister_%SiteArea`] = siteBlisterPercent;
      unscaledBlisterScore += (siteBlisterPercent / 100) * site.bsaWeight;
    });
    const finalBlisterScore = totalSiteBsaWeight > 0 ? parseFloat((unscaledBlisterScore * (120 / totalSiteBsaWeight)).toFixed(1)) : 0;

    let unscaledUrticariaScore = 0;
    const urticariaDetails: Record<string, number> = {};
    bpdaiskinSites.forEach(site => {
      const siteUrticariaPercent = Number(inputs[`skin_urticaria_bsa_percent_${site.id}`]) || 0;
      urticariaDetails[`${site.name}_Urticaria_%SiteArea`] = siteUrticariaPercent;
      unscaledUrticariaScore += (siteUrticariaPercent / 100) * site.bsaWeight;
    });
    const finalUrticariaScore = totalSiteBsaWeight > 0 ? parseFloat((unscaledUrticariaScore * (120 / totalSiteBsaWeight)).toFixed(1)) : 0;

    let rawMucosalScore = 0;
    const mucosalDetails: Record<string, number> = {};
    bpdaimucosalSites.forEach(site => {
      const siteMucosalValue = Number(inputs[`mucosal_bullous_${site.id}`]) || 0;
      mucosalDetails[`${site.name}_Involved`] = siteMucosalValue;
      rawMucosalScore += siteMucosalValue;
    });
    const scaledMucosalScore = parseFloat((rawMucosalScore * 20).toFixed(1));

    const pruritusCurrent = Number(inputs.pruritus_current_nrs) || 0;
    const pruritusPastMonth = Number(inputs.pruritus_pastmonth_nrs) || 0;
    const pruritusAvgMonth = Number(inputs.pruritus_avgmonth_nrs) || 0;
    const pruritusComponentScore = parseFloat((pruritusCurrent + pruritusPastMonth + pruritusAvgMonth).toFixed(1));

    const totalActivityScore = parseFloat((finalBlisterScore + finalUrticariaScore + scaledMucosalScore).toFixed(1));

    let severityCategory = "Undefined";
    if (totalActivityScore <= 19) severityCategory = "Mild BP";
    else if (totalActivityScore <= 56) severityCategory = "Moderate BP";
    else severityCategory = "Severe BP";

    const interpretation = `Total BPDAI Activity Score: ${totalActivityScore} (Range: 0-360). Severity: ${severityCategory}.
Blister/Erosion Score: ${finalBlisterScore} (0-120).
Urticaria/Erythema Score: ${finalUrticariaScore} (0-120).
Scaled Mucosal Score: ${scaledMucosalScore} (0-120).
Pruritus Component Score: ${pruritusComponentScore} (0-30).
(Severity Bands: ≤19 Mild; 20-56 Moderate; ≥57 Severe BP).`;

    return {
      score: totalActivityScore,
      interpretation,
      details: {
        Blister_Erosion_Score_Scaled: finalBlisterScore,
        Urticaria_Erythema_Score_Scaled: finalUrticariaScore,
        Mucosal_Score_Raw: rawMucosalScore,
        Mucosal_Score_Scaled: scaledMucosalScore,
        Pruritus_Component_Score: pruritusComponentScore,
        Total_Activity_Score: totalActivityScore,
        Severity_Category: severityCategory,
        Blister_Inputs_By_Site: blisterDetails,
        Urticaria_Inputs_By_Site: urticariaDetails,
        Mucosal_Inputs_By_Site: mucosalDetails,
        Pruritus_NRS_Inputs: { Current: pruritusCurrent, Worst_Past_Month: pruritusPastMonth, Average_Past_Month: pruritusAvgMonth }
      }
    };
  },
  references: [
    "Murrell DF, Daniel BS, Joly P, et al. Definitions and outcome measures for bullous pemphigoid: recommendations by an international group of experts. J Am Acad Dermatol. 2012 Mar;66(3):479-85.",
    "Masmoudi W, et al. International validation of BPDAI and calculation of cut-off values defining mild, moderate, and severe BP. Br J Dermatol. 2020;183(2):426–433."
  ]
};
