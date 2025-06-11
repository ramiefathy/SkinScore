
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bwatSizeOptions: InputOption[] = [
    { value: 1, label: "1 (<4 cm²)"}, // Updated to match Bates-Jensen documentation example (was <0.5)
    { value: 2, label: "2 (4–16 cm²)"}, // (was 0.5-3.0)
    { value: 3, label: "3 (16.1–36 cm²)"}, // (was 3.1-10.0)
    { value: 4, label: "4 (36.1–64 cm²)"}, // (was 10.1-24.0)
    { value: 5, label: "5 (>64 cm²)"} // (was >24.0)
];
const bwatDepthOptions: InputOption[] = [
    { value: 1, label: "1 (Non-blanchable erythema on intact skin)"}, // Clarified
    { value: 2, label: "2 (Partial thickness skin loss: epidermis/dermis)"},
    { value: 3, label: "3 (Full thickness skin loss: subcutaneous tissue visible)"},
    { value: 4, label: "4 (Full thickness: bone/tendon exposed)"},
    { value: 5, label: "5 (Full thickness: bone/tendon exposed with extensive necrosis/undermining)"} // Clarified
];
const bwatEdgesOptions: InputOption[] = [
    { value: 1, label: "1 (Indistinct, attached)"},
    { value: 2, label: "2 (Distinct, attached)"},
    { value: 3, label: "3 (Distinct, not attached, rolled under/epibole)"},
    { value: 4, label: "4 (Fibrotic, scarred, or hyperkeratotic)"},
    { value: 5, label: "5 (Calloused or indurated)"} // Adjusted
];
const bwatUnderminingOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (<2 cm in any area)"}, // Using cm from some versions
    { value: 3, label: "3 (2–4 cm in any area OR <2 cm in ≥50% of wound)"},
    { value: 4, label: "4 (>4 cm in any area OR 2-4 cm in ≥50% of wound)"},
    { value: 5, label: "5 (Tunneling/sinus tract OR >4 cm in ≥50% of wound)"}
];
const bwatNecroticTypeOptions: InputOption[] = [
    { value: 1, label: "1 (None present)"},
    { value: 2, label: "2 (White/gray nonviable tissue and/or nonadherent yellow slough)"},
    { value: 3, label: "3 (Loosely adherent yellow slough)"},
    { value: 4, label: "4 (Adherent, soft black eschar)"},
    { value: 5, label: "5 (Firmly adherent, hard black eschar)"}
];
const bwatNecroticAmountOptions: InputOption[] = [
    { value: 1, label: "1 (None present)"},
    { value: 2, label: "2 (<25% of wound bed covered)"},
    { value: 3, label: "3 (25% to 50% covered)"},
    { value: 4, label: "4 (>50% but <75% covered)"},
    { value: 5, label: "5 (75% to 100% covered)"}
];
const bwatExudateTypeOptions: InputOption[] = [
    { value: 1, label: "1 (None or bloody)"}, // Bloody is 1 per some versions
    { value: 2, label: "2 (Serosanguineous: thin, watery, pale red/pink)"},
    { value: 3, label: "3 (Serous: thin, watery, clear)"},
    { value: 4, label: "4 (Purulent: thin or thick, opaque tan/yellow)"},
    { value: 5, label: "5 (Foul purulent: thick, opaque yellow/green with foul odor)"}
];
const bwatExudateAmountOptions: InputOption[] = [
    { value: 1, label: "1 (None/Scant: wound tissues moist, no measurable exudate)"},
    { value: 2, label: "2 (Small: wound tissues very moist, drainage <25% dressing)"},
    { value: 3, label: "3 (Moderate: wound tissues wet, drainage 25-75% dressing)"},
    { value: 4, label: "4 (Large/Copious: wound tissues filled with fluid, drainage >75% dressing)"},
    { value: 5, label: "5 (Saturated: dressing soaked, may require frequent changes)"}
];
const bwatSurroundingColorOptions: InputOption[] = [ // Periwound skin color
    { value: 1, label: "1 (Pink or normal for ethnic group)"},
    { value: 2, label: "2 (Bright red erythema and/or blanches to touch)"},
    { value: 3, label: "3 (White or grey pallor or hypopigmented)"},
    { value: 4, label: "4 (Dark red or purple and/or non-blanchable erythema)"},
    { value: 5, label: "5 (Black or blue and/or hyperpigmented)"}
];
const bwatPeripheralEdemaOptions: InputOption[] = [
    { value: 1, label: "1 (No swelling or edema)"},
    { value: 2, label: "2 (Non-pitting edema extends <4cm around wound)"},
    { value: 3, label: "3 (Non-pitting edema extends ≥4cm around wound)"},
    { value: 4, label: "4 (Pitting edema extends <4cm around wound)"},
    { value: 5, label: "5 (Crepitus and/or pitting edema extends ≥4cm)"}
];
const bwatPeripheralIndurationOptions: InputOption[] = [
    { value: 1, label: "1 (None present)"},
    { value: 2, label: "2 (Induration, <2cm around wound)"},
    { value: 3, label: "3 (Induration, 2–4cm around wound)"},
    { value: 4, label: "4 (Induration, >4cm around wound)"},
    { value: 5, label: "5 (Induration with fluctuance/abscess or cellulitis extending well beyond induration)"}
];
const bwatGranulationOptions: InputOption[] = [
    { value: 1, label: "1 (Skin intact or partial thickness wound with 100% granulation/epithelialization)"}, // Adjusted
    { value: 2, label: "2 (Bright, beefy red; 75% to <100% of wound filled)"},
    { value: 3, label: "3 (Pink, and/or dull, dusky red; 25% to <75% of wound filled)"},
    { value: 4, label: "4 (No granulation tissue present, or <25% filled)"},
    { value: 5, label: "5 (Necrotic tissue present)"} // If Necrotic tissue is present, Granulation cannot be fully scored
];
const bwatEpithelializationOptions: InputOption[] = [
    { value: 1, label: "1 (100% wound covered, surface intact)"},
    { value: 2, label: "2 (75% to <100% wound covered and/or new epithelial tissue extends >0.5cm from edge)"},
    { value: 3, label: "3 (50% to <75% wound covered and/or new tissue extends <0.5cm from edge)"},
    { value: 4, label: "4 (25% to <50% wound covered)"},
    { value: 5, label: "5 (<25% wound covered)"}
];

const bwatFormSections: FormSectionConfig[] = [
  { id: "bwat_size", label: "1. Size of Wound", type: 'select', options: bwatSizeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatSizeOptions, 1, 5), description: "Score based on longest surface L x W in cm² (Item from original uses direct cm measurement, but scoring is categorical 1-5)." },
  { id: "bwat_depth", label: "2. Depth (Thickness) of Wound", type: 'select', options: bwatDepthOptions, defaultValue: 1, validation: getValidationSchema('select', bwatDepthOptions, 1, 5), description: "How deep the wound extends." },
  { id: "bwat_edges", label: "3. Wound Edges", type: 'select', options: bwatEdgesOptions, defaultValue: 1, validation: getValidationSchema('select', bwatEdgesOptions, 1, 5), description: "Condition of the wound edges." },
  { id: "bwat_undermining", label: "4. Undermining/Tunneling", type: 'select', options: bwatUnderminingOptions, defaultValue: 1, validation: getValidationSchema('select', bwatUnderminingOptions, 1, 5), description: "Presence and extent of undermining or tunneling." },
  { id: "bwat_necrotic_type", label: "5. Necrotic Tissue Type", type: 'select', options: bwatNecroticTypeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatNecroticTypeOptions, 1, 5), description: "Predominant necrotic tissue type." },
  { id: "bwat_necrotic_amount", label: "6. Necrotic Tissue Amount", type: 'select', options: bwatNecroticAmountOptions, defaultValue: 1, validation: getValidationSchema('select', bwatNecroticAmountOptions, 1, 5), description: "Amount of necrotic tissue in wound bed." },
  { id: "bwat_exudate_type", label: "7. Exudate Type", type: 'select', options: bwatExudateTypeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatExudateTypeOptions, 1, 5), description: "Type/consistency of wound exudate." },
  { id: "bwat_exudate_amount", label: "8. Exudate Amount", type: 'select', options: bwatExudateAmountOptions, defaultValue: 1, validation: getValidationSchema('select', bwatExudateAmountOptions, 1, 5), description: "Volume of wound exudate." },
  { id: "bwat_surrounding_color", label: "9. Skin Color Surrounding Wound", type: 'select', options: bwatSurroundingColorOptions, defaultValue: 1, validation: getValidationSchema('select', bwatSurroundingColorOptions, 1, 5), description: "Periwound skin color (within 4 cm of edge)." },
  { id: "bwat_peripheral_edema", label: "10. Peripheral (Periwound) Tissue Edema", type: 'select', options: bwatPeripheralEdemaOptions, defaultValue: 1, validation: getValidationSchema('select', bwatPeripheralEdemaOptions, 1, 5), description: "Edema in tissue surrounding the wound." },
  { id: "bwat_peripheral_indur", label: "11. Peripheral (Periwound) Tissue Induration", type: 'select', options: bwatPeripheralIndurationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatPeripheralIndurationOptions, 1, 5), description: "Firmness of periwound tissue." },
  { id: "bwat_granulation", label: "12. Granulation Tissue", type: 'select', options: bwatGranulationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatGranulationOptions, 1, 5), description: "Percentage of wound bed with healthy granulation." },
  { id: "bwat_epithelialization", label: "13. Epithelialization", type: 'select', options: bwatEpithelializationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatEpithelializationOptions, 1, 5), description: "Percentage of wound surface covered with new epithelium." },
];


export const bwatTool: Tool = {
  id: "bwat",
  name: "Bates-Jensen Wound Assessment Tool",
  acronym: "BWAT",
  description: "A standardized instrument to assess and monitor the status and healing progression of pressure ulcers and other chronic wounds. It quantifies 13 key wound characteristics, each scored 1 (healthiest) to 5 (worst). The total score ranges from 13 to 65, with lower scores indicating better wound status.",
  condition: "Chronic Wounds, Pressure Ulcers, Diabetic Foot Ulcers, Venous Leg Ulcers, Surgical Wounds",
  keywords: ["bwat", "Bates-Jensen", "wound assessment", "pressure ulcer", "chronic wound", "wound healing", "score", "monitoring"],
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  formSections: bwatFormSections,
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const itemScores: Record<string, number> = {};

    bwatFormSections.forEach(section => {
      if ('type' in section) { // Type guard for InputConfig
        const inputConfig = section as InputConfig;
        const score = Number(inputs[inputConfig.id]) || 1;
        totalScore += score;
        itemScores[inputConfig.label.substring(inputConfig.label.indexOf(". ") + 2)] = score; // Use label for detail key
      }
    });

    let severityCategory = "Undefined";
    if (totalScore <= 20) severityCategory = "Minimal severity (wound status good)";
    else if (totalScore <= 30) severityCategory = "Mild severity (wound status fair)";
    else if (totalScore <= 40) severityCategory = "Moderate severity (wound status poor, needs intervention)";
    else severityCategory = "Severe wound requiring aggressive management (wound status very poor)";


    const interpretation = `Total BWAT Score: ${totalScore} (Range: 13–65). Wound Status: ${severityCategory}. A lower score indicates a healthier wound. Decreasing score over time indicates healing.`;

    return {
      score: totalScore,
      interpretation,
      details: {
        Individual_Item_Scores: itemScores,
        Overall_Severity_Category: severityCategory
      }
    };
  },
  references: [
    "Bates-Jensen BM. The Pressure Sore Status Tool a few thousand assessments later. Adv Wound Care. 1997;10(5):65-73.",
    "Bates-Jensen BM, et al. Validity and reliability of the Bates-Jensen Wound Assessment Tool (BWAT): (Formerly the Pressure Sore Status Tool [PSST]). Wound Repair Regen. 2001;9(5):387-398.",
    "Sussman C, Bates-Jensen BM. Wound Care: A Collaborative Practice Manual for Health Professionals. 4th ed. Wolters Kluwer Health; 2007. Chapter 6: “Tools to Measure Wound Healing.”",
    "National Pressure Injury Advisory Panel (NPIAP) resources often reference BWAT."
  ]
};
