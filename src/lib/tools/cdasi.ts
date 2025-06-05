
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const cdasiAnatomicalSites = [
  { id: 'central_face', name: 'Central face (including forehead)' },
  { id: 'lateral_face', name: 'Lateral face (cheeks, periorbital)' },
  { id: 'scalp', name: 'Scalp' },
  { id: 'neck', name: 'Neck (excluding V-area, DM-specific)' },
  { id: 'chest', name: 'Chest (anterior)' },
  { id: 'back', name: 'Back (upper and lower)' },
  { id: 'upper_arms', name: 'Upper arms (bilateral combined)' },
  { id: 'lower_arms', name: 'Lower arms (bilateral combined)' },
  { id: 'hands', name: 'Hands (excluding Gottron’s papules sites)' },
  { id: 'upper_legs', name: 'Upper legs (bilateral combined)' },
  { id: 'lower_legs', name: 'Lower legs (bilateral combined)' },
  { id: 'feet', name: 'Feet (dorsal and plantar)' },
  { id: 'eyelids_periorbital', name: 'Eyelids/periorbital (including heliotrope sign)' },
  { id: 'upper_back_shawl', name: 'Upper back/shawl area' },
  { id: 'periumbilical_area', name: 'Periumbilical area' },
];

const cdasiSeverityOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Mild" },
  { value: 2, label: "2 - Moderate" },
  { value: 3, label: "3 - Severe" }
];

const cdasiPresenceOptions: InputOption[] = [
  { value: 0, label: "None" },
  { value: 1, label: "Present" }
];

const cdasiFormSections: FormSectionConfig[] = [
  // Activity Domain Inputs per site
  ...cdasiAnatomicalSites.map(site => ({
    id: `cdasi_activity_group_${site.id}`,
    title: `Activity: ${site.name}`,
    gridCols: 3,
    inputs: [
      { id: `cdasi_a_erythema_${site.id}`, label: `Erythema`, type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) } as InputConfig,
      { id: `cdasi_a_scale_${site.id}`, label: `Scale`, type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) } as InputConfig,
      { id: `cdasi_a_erosion_${site.id}`, label: `Erosion/Ulceration`, type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) } as InputConfig,
    ]
  } as InputGroupConfig)),
  // Global Activity Items
  {
    id: 'cdasi_global_activity_group',
    title: 'Global Activity Items',
    gridCols: 1,
    inputs: [
      { id: "cdasi_a_gottrons", label: "Gottron’s Papules Severity", type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) },
      { id: "cdasi_a_periungual", label: "Periungual Changes Severity", type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) },
      { id: "cdasi_a_alopecia", label: "Alopecia Severity", type: 'select', options: cdasiSeverityOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiSeverityOptions, 0, 3) },
    ]
  },
  // Damage Domain Inputs per site
  ...cdasiAnatomicalSites.map(site => ({
    id: `cdasi_damage_group_${site.id}`,
    title: `Damage: ${site.name}`,
    gridCols: 2,
    inputs: [
      { id: `cdasi_d_poikiloderma_${site.id}`, label: `Poikiloderma`, type: 'select', options: cdasiPresenceOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiPresenceOptions, 0, 1) } as InputConfig,
      { id: `cdasi_d_calcinosis_${site.id}`, label: `Calcinosis`, type: 'select', options: cdasiPresenceOptions, defaultValue: 0, validation: getValidationSchema('select', cdasiPresenceOptions, 0, 1) } as InputConfig,
    ]
  } as InputGroupConfig)),
];

export const cdasiTool: Tool = {
  id: "cdasi",
  name: "Cutaneous Dermatomyositis Disease Area and Severity Index",
  acronym: "CDASI",
  description: "The CDASI is a clinician-administered instrument for quantifying skin disease severity in dermatomyositis (DM), separating activity (CDASI-A) and damage (CDASI-D) domains.",
  condition: "Dermatomyositis, Idiopathic Inflammatory Myopathy, Juvenile Dermatomyositis",
  keywords: ["cdasi", "dermatomyositis", "skin activity", "poikiloderma", "calcinosis", "Gottron’s", "periungual", "erythema", "scale", "erosion", "alopecia"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: cdasiFormSections,
  calculationLogic: (inputs) => {
    let activitySiteSum = 0;
    const activitySiteDetails: Record<string, {erythema: number, scale: number, erosion: number, total: number}> = {};

    cdasiAnatomicalSites.forEach(site => {
      const erythema = Number(inputs[`cdasi_a_erythema_${site.id}`]) || 0;
      const scale = Number(inputs[`cdasi_a_scale_${site.id}`]) || 0;
      const erosion = Number(inputs[`cdasi_a_erosion_${site.id}`]) || 0;
      const siteTotal = erythema + scale + erosion;
      activitySiteSum += siteTotal;
      activitySiteDetails[site.name] = { erythema, scale, erosion, total: siteTotal };
    });

    const gottrons = Number(inputs.cdasi_a_gottrons) || 0;
    const periungual = Number(inputs.cdasi_a_periungual) || 0;
    const alopecia = Number(inputs.cdasi_a_alopecia) || 0;
    const globalActivityScore = gottrons + periungual + alopecia;

    const totalCDASI_A = activitySiteSum + globalActivityScore; // Max raw 135 (sites) + 9 (global) = 144

    let damageSiteSum = 0;
    const damageSiteDetails: Record<string, {poikiloderma: number, calcinosis: number, total: number}> = {};
    cdasiAnatomicalSites.forEach(site => {
      const poikiloderma = Number(inputs[`cdasi_d_poikiloderma_${site.id}`]) || 0;
      const calcinosis = Number(inputs[`cdasi_d_calcinosis_${site.id}`]) || 0;
      const siteTotal = poikiloderma + calcinosis;
      damageSiteSum += siteTotal;
      damageSiteDetails[site.name] = { poikiloderma, calcinosis, total: siteTotal };
    });
    const totalCDASI_D = damageSiteSum; // Max raw 15*1 (poik) + 15*1 (calc) = 30

    const totalCDASIScore = totalCDASI_A + totalCDASI_D;

    let activitySeverity = "";
    if (totalCDASI_A <= 9) activitySeverity = "Minimal skin activity";
    else if (totalCDASI_A <= 14) activitySeverity = "Mild skin activity";
    else activitySeverity = "Moderate-to-severe skin activity";

    let damageSeverity = "";
    if (totalCDASI_D <= 5) damageSeverity = "Minimal damage";
    else if (totalCDASI_D <= 10) damageSeverity = "Mild-to-moderate damage";
    else damageSeverity = "Severe damage";

    const interpretation = `CDASI Activity Score (CDASI-A): ${totalCDASI_A} (Max raw: 144) - ${activitySeverity}.
CDASI Damage Score (CDASI-D): ${totalCDASI_D} (Max raw: 30) - ${damageSeverity}.
Total CDASI Score: ${totalCDASIScore} (Max raw: 174).
Note: CDASI-A is sometimes capped at 100 and CDASI-D at 32 in practice/trials; this calculation uses raw sums.`;

    return {
      score: totalCDASIScore,
      interpretation,
      details: {
        Total_CDASI_A: totalCDASI_A,
        Activity_Severity_Category: activitySeverity,
        Site_Activity_Scores: activitySiteDetails,
        Global_Activity_Scores: { Gottrons_Papules: gottrons, Periungual_Changes: periungual, Alopecia: alopecia, Total_Global: globalActivityScore },
        Total_CDASI_D: totalCDASI_D,
        Damage_Severity_Category: damageSeverity,
        Site_Damage_Scores: damageSiteDetails,
        Overall_CDASI_Score: totalCDASIScore
      }
    };
  },
  references: [
    "Michalak S, et al. Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI): Development of a Clinician‐Reported Outcome Measure. J Invest Dermatol. 2008;128(4):789–795.",
    "Anyanwu CO, et al. Validation of the Cutaneous Dermatomyositis Disease Area and Severity Index. Br J Dermatol. 2015;173(4):969–974.",
    "Goreshi R, et al. Evaluation of Reliability, Validity, and Responsiveness of the CDASI and the CAT-BM. J Invest Dermatol. 2012;132(4):1117–1124."
  ]
};
