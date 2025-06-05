
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const clasiAnatomicalAreas = [
  { id: 'scalp', name: 'Scalp' },
  { id: 'ears', name: 'Ears' },
  { id: 'nose_malar', name: 'Nose/Malar area' },
  { id: 'rest_of_face', name: 'Rest of face (besides malar)' },
  { id: 'v_area_neck', name: 'V-area of neck (frontal)' },
  { id: 'posterior_neck_shoulders', name: 'Posterior neck and shoulders' },
  { id: 'chest', name: 'Chest' },
  { id: 'abdomen', name: 'Abdomen' },
  { id: 'back_buttocks', name: 'Back/Buttocks' },
  { id: 'arms', name: 'Arms (each upper arm combined)' },
  { id: 'hands', name: 'Hands (including palms and dorsal)' },
  { id: 'legs', name: 'Legs (each upper leg combined)' },
  { id: 'feet', name: 'Feet (dorsal and plantar surfaces)' }
];

const clasiErythemaOptions: InputOption[] = [
  { value: 0, label: "0 - Absent" },
  { value: 1, label: "1 - Pink/Light Erythema" },
  { value: 2, label: "2 - Red/Moderate Erythema" },
  { value: 3, label: "3 - Dark Red/Purple/Violaceous (Severe)" }
];

const clasiScaleOptions: InputOption[] = [
  { value: 0, label: "0 - Absent" },
  { value: 1, label: "1 - Thin Scale" },
  { value: 2, label: "2 - Thick Scale/Verrucous" },
  { value: 3, label: "3 - Severe Hypertrophic" }
];

const clasiPresenceOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Present" }
];

const clasiScarringOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Superficial Scarring (Loss of Skin Markings)" },
  { value: 2, label: "2 - Depressed Atrophy/Severe Scarring or Panniculitis" }
];

const clasiFormSections: FormSectionConfig[] = [
  // Group for global damage modifiers
  {
    id: 'clasi_global_damage_modifiers',
    title: 'Global Damage Modifiers',
    gridCols: 1,
    inputs: [
      {
        id: 'clasi_dmg_dyspig_permanent',
        label: 'Is any dyspigmentation present for ≥12 months? (If yes, total dyspigmentation score will be doubled)',
        type: 'checkbox',
        defaultValue: false,
        validation: getValidationSchema('checkbox')
      },
      {
        id: 'clasi_dmg_scar_alop_scalp',
        label: 'Scarring Alopecia (Scalp Only)',
        type: 'select',
        options: clasiPresenceOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', clasiPresenceOptions, 0, 1)
      }
    ]
  },
  // Activity and Damage inputs per anatomical area
  ...clasiAnatomicalAreas.map(area => ({
    id: `clasi_area_group_${area.id}`,
    title: `Area: ${area.name}`,
    gridCols: 2, // Two columns for activity and damage side-by-side if possible, or stacked.
    inputs: [
      // Activity Inputs for this area
      { id: `clasi_a_erythema_${area.id}`, label: `Activity: Erythema`, type: 'select', options: clasiErythemaOptions, defaultValue: 0, validation: getValidationSchema('select', clasiErythemaOptions, 0, 3) },
      { id: `clasi_a_scale_${area.id}`, label: `Activity: Scale/Hyperkeratosis`, type: 'select', options: clasiScaleOptions, defaultValue: 0, validation: getValidationSchema('select', clasiScaleOptions, 0, 3) },
      { id: `clasi_a_mucous_${area.id}`, label: `Activity: Mucous Membrane Lesions`, type: 'select', options: clasiPresenceOptions, defaultValue: 0, validation: getValidationSchema('select', clasiPresenceOptions, 0, 1) },
      { id: `clasi_a_hair_${area.id}`, label: `Activity: Recent Hair Loss/Non-Scarring Alopecia`, type: 'select', options: clasiPresenceOptions, defaultValue: 0, validation: getValidationSchema('select', clasiPresenceOptions, 0, 1) },
      // Damage Inputs for this area
      { id: `clasi_d_dyspig_${area.id}`, label: `Damage: Dyspigmentation`, type: 'select', options: clasiPresenceOptions, defaultValue: 0, validation: getValidationSchema('select', clasiPresenceOptions, 0, 1) },
      { id: `clasi_d_scar_${area.id}`, label: `Damage: Scarring/Atrophy/Panniculitis`, type: 'select', options: clasiScarringOptions, defaultValue: 0, validation: getValidationSchema('select', clasiScarringOptions, 0, 2) },
    ]
  } as InputGroupConfig))
];

export const clasiTool: Tool = {
  id: "clasi",
  name: "Cutaneous Lupus Erythematosus Disease Area and Severity Index",
  acronym: "CLASI",
  description: "The CLASI quantifies activity and damage in cutaneous lupus erythematosus across 13 body areas. Activity includes erythema, scale, mucous involvement, and hair loss. Damage includes dyspigmentation and scarring.",
  condition: "Cutaneous Lupus Erythematosus, Systemic Lupus Erythematosus (Skin Manifestations)",
  keywords: ["clasi", "cutaneous lupus", "CLE", "activity score", "damage score", "dyspigmentation", "scarring", "erythema", "scale"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: clasiFormSections,
  calculationLogic: (inputs) => {
    let totalActivityScore = 0;
    let totalDamageScore = 0;
    let totalDyspigmentationScore = 0;
    let totalScarringScore = 0;

    const activityDetails: Record<string, any> = {};
    const damageDetails: Record<string, any> = {};

    clasiAnatomicalAreas.forEach(area => {
      const erythema = Number(inputs[`clasi_a_erythema_${area.id}`]) || 0;
      const scale = Number(inputs[`clasi_a_scale_${area.id}`]) || 0;
      const mucous = Number(inputs[`clasi_a_mucous_${area.id}`]) || 0;
      const hair = Number(inputs[`clasi_a_hair_${area.id}`]) || 0;
      const areaActivity = erythema + scale + mucous + hair;
      totalActivityScore += areaActivity;
      activityDetails[area.name] = { erythema, scale, mucous, hair_loss: hair, area_activity_score: areaActivity };

      const dyspig = Number(inputs[`clasi_d_dyspig_${area.id}`]) || 0;
      totalDyspigmentationScore += dyspig;
      const scar = Number(inputs[`clasi_d_scar_${area.id}`]) || 0;
      totalScarringScore += scar;
      damageDetails[area.name] = { dyspigmentation: dyspig, scarring_atrophy: scar };
    });

    if (inputs.clasi_dmg_dyspig_permanent) {
      totalDyspigmentationScore *= 2;
    }
    const scalpScarringAlopecia = Number(inputs.clasi_dmg_scar_alop_scalp) || 0;
    totalDamageScore = totalDyspigmentationScore + totalScarringScore + scalpScarringAlopecia;

    // Max scores: CLASI-A = 104, CLASI-D = (13*1*2) + (13*2) + 1 = 26 + 26 + 1 = 53 (if permanent dyspigmentation in all areas)
    // Or CLASI-D = (13*1) + (13*2) + 1 = 13 + 26 + 1 = 40 (if no permanent dyspigmentation)

    let activitySeverity = "";
    if (totalActivityScore <= 9) activitySeverity = "Minimal activity";
    else if (totalActivityScore <= 19) activitySeverity = "Mild activity";
    else activitySeverity = "Moderate-to-severe activity";

    let damageSeverity = "";
    if (totalDamageScore <= 5) damageSeverity = "Minimal damage";
    else if (totalDamageScore <= 15) damageSeverity = "Mild-to-moderate damage";
    else damageSeverity = "Severe damage";

    const overallClasiScore = totalActivityScore + totalDamageScore;

    const interpretation = `CLASI Activity Score (CLASI-A): ${totalActivityScore} (Max raw: 104) - ${activitySeverity}.
CLASI Damage Score (CLASI-D): ${totalDamageScore} (Max raw: 53 with permanent dyspigmentation, 40 otherwise) - ${damageSeverity}.
Total Combined CLASI Score: ${overallClasiScore}.`;

    return {
      score: overallClasiScore,
      interpretation,
      details: {
        Total_CLASI_A: totalActivityScore,
        Activity_Severity_Category: activitySeverity,
        Activity_Breakdown_By_Area: activityDetails,
        Total_CLASI_D: totalDamageScore,
        Damage_Severity_Category: damageSeverity,
        Damage_Breakdown: {
            Total_Dyspigmentation_Score_Post_Doubling_If_Applicable: totalDyspigmentationScore,
            Dyspigmentation_Was_Doubled: inputs.clasi_dmg_dyspig_permanent ? "Yes" : "No",
            Total_Scarring_Atrophy_Score: totalScarringScore,
            Scalp_Scarring_Alopecia_Score: scalpScarringAlopecia,
            Damage_Breakdown_By_Area: damageDetails
        },
        Overall_CLASI_Score: overallClasiScore
      }
    };
  },
  references: [
    "Albrecht J, Taylor L, Berlin JA, et al. The CLASI (Cutaneous Lupus Erythematosus Disease Area and Severity Index): An Outcome Instrument for Cutaneous Lupus Erythematosus. J Invest Dermatol. 2005;125(5):889–894.",
    "U.S. Food and Drug Administration. DDT COA #000130: Cutaneous Lupus Erythematosus Disease Area and Severity Index (CLASI). 2020.",
    "Albrecht J, Taylor L, Berlin JA, Dulay S, Ang G, Fakharzadeh S, et al. Development of the CLASI as a Tool to Measure Disease Severity and Responsiveness to Therapy in Cutaneous Lupus Erythematosus. Arch Dermatol. 2011;147(2):203–208."
  ]
};
