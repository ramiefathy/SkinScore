
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bwatItemOptions: InputOption[] = [
  { value: 1, label: "1 (Healthiest/Minimal)" },
  { value: 2, label: "2 (Mild)" },
  { value: 3, label: "3 (Moderate)" },
  { value: 4, label: "4 (Severe)" },
  { value: 5, label: "5 (Most Severe)" }
];

const bwatSizeOptions: InputOption[] = [
    { value: 1, label: "1 (< 0.5 cm²)"},
    { value: 2, label: "2 (0.5–3.0 cm²)"},
    { value: 3, label: "3 (3.1–10.0 cm²)"},
    { value: 4, label: "4 (10.1–24.0 cm²)"},
    { value: 5, label: "5 (>24.0 cm²)"}
];
const bwatDepthOptions: InputOption[] = [
    { value: 1, label: "1 (Superficial)"},
    { value: 2, label: "2 (Partial thickness)"},
    { value: 3, label: "3 (Full thickness, no bone/tendon)"},
    { value: 4, label: "4 (Full thickness with bone/tendon)"},
    { value: 5, label: "5 (Extensive, undermining)"}
];
const bwatEdgesOptions: InputOption[] = [
    { value: 1, label: "1 (Attached, normal)"},
    { value: 2, label: "2 (Attached, thickened)"},
    { value: 3, label: "3 (Attached, rolled under)"},
    { value: 4, label: "4 (Unattached, undermined)"},
    { value: 5, label: "5 (Hyperkeratotic, fibrotic)"}
];
const bwatUnderminingOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (0–0.5 cm)"},
    { value: 3, label: "3 (0.6–1.0 cm)"},
    { value: 4, label: "4 (1.1–1.5 cm)"},
    { value: 5, label: "5 (>1.5 cm)"}
];
const bwatNecroticTypeOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (Slough)"},
    { value: 3, label: "3 (Necrotic - yellow)"},
    { value: 4, label: "4 (Necrotic - black)"},
    { value: 5, label: "5 (Eschar - thick black)"}
];
const bwatNecroticAmountOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (1–25%)"},
    { value: 3, label: "3 (26–50%)"},
    { value: 4, label: "4 (51–75%)"},
    { value: 5, label: "5 (76–100%)"}
];
const bwatExudateTypeOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (Serous)"},
    { value: 3, label: "3 (Serosanguinous)"},
    { value: 4, label: "4 (Sanguineous)"},
    { value: 5, label: "5 (Purulent)"}
];
const bwatExudateAmountOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (Scant <25% wet)"},
    { value: 3, label: "3 (Moderate 25–75% wet)"},
    { value: 4, label: "4 (Large >75% wet)"},
    { value: 5, label: "5 (Copious/dripping)"}
];
const bwatSurroundingColorOptions: InputOption[] = [
    { value: 1, label: "1 (Normal)"},
    { value: 2, label: "2 (Erythema, no warmth)"},
    { value: 3, label: "3 (Erythema + warmth)"},
    { value: 4, label: "4 (Ecchymosis/Bruising)"},
    { value: 5, label: "5 (Necrosis)"}
];
const bwatPeripheralEdemaOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (0.5 cm)"},
    { value: 3, label: "3 (1.0 cm)"},
    { value: 4, label: "4 (1.5 cm)"},
    { value: 5, label: "5 (>1.5 cm, pitting/boggy)"}
];
const bwatPeripheralIndurationOptions: InputOption[] = [
    { value: 1, label: "1 (None)"},
    { value: 2, label: "2 (0.5 cm)"},
    { value: 3, label: "3 (1.0 cm)"},
    { value: 4, label: "4 (1.5 cm)"},
    { value: 5, label: "5 (>1.5 cm, hard/woody)"}
];
const bwatGranulationOptions: InputOption[] = [
    { value: 1, label: "1 (100% healthy granulation)"},
    { value: 2, label: "2 (75–99%)"},
    { value: 3, label: "3 (50–74%)"},
    { value: 4, label: "4 (25–49%)"},
    { value: 5, label: "5 (0–24% or none)"}
];
const bwatEpithelializationOptions: InputOption[] = [
    { value: 1, label: "1 (100% epithelialized)"},
    { value: 2, label: "2 (75–99%)"},
    { value: 3, label: "3 (50–74%)"},
    { value: 4, label: "4 (25–49%)"},
    { value: 5, label: "5 (0–24%)"}
];


const bwatFormSections: FormSectionConfig[] = [
  { id: "bwat_size", label: "Size of Wound", type: 'select', options: bwatSizeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatSizeOptions, 1, 5), description: "Score based on wound area (length x width in cm²)." },
  { id: "bwat_depth", label: "Depth (Thickness) of Wound", type: 'select', options: bwatDepthOptions, defaultValue: 1, validation: getValidationSchema('select', bwatDepthOptions, 1, 5), description: "How deep the wound extends." },
  { id: "bwat_edges", label: "Wound Edges", type: 'select', options: bwatEdgesOptions, defaultValue: 1, validation: getValidationSchema('select', bwatEdgesOptions, 1, 5), description: "Condition of the wound edges." },
  { id: "bwat_undermining", label: "Undermining", type: 'select', options: bwatUnderminingOptions, defaultValue: 1, validation: getValidationSchema('select', bwatUnderminingOptions, 1, 5), description: "Undermining around the wound." },
  { id: "bwat_necrotic_type", label: "Necrotic Tissue Type", type: 'select', options: bwatNecroticTypeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatNecroticTypeOptions, 1, 5), description: "Predominant necrotic tissue type." },
  { id: "bwat_necrotic_amount", label: "Necrotic Tissue Amount", type: 'select', options: bwatNecroticAmountOptions, defaultValue: 1, validation: getValidationSchema('select', bwatNecroticAmountOptions, 1, 5), description: "Amount of necrotic tissue in wound bed." },
  { id: "bwat_exudate_type", label: "Exudate Type", type: 'select', options: bwatExudateTypeOptions, defaultValue: 1, validation: getValidationSchema('select', bwatExudateTypeOptions, 1, 5), description: "Consistency of wound exudate." },
  { id: "bwat_exudate_amount", label: "Exudate Amount", type: 'select', options: bwatExudateAmountOptions, defaultValue: 1, validation: getValidationSchema('select', bwatExudateAmountOptions, 1, 5), description: "Volume of wound exudate." },
  { id: "bwat_surrounding_color", label: "Skin Color Surrounding Wound", type: 'select', options: bwatSurroundingColorOptions, defaultValue: 1, validation: getValidationSchema('select', bwatSurroundingColorOptions, 1, 5), description: "Periwound skin color (within 4 cm of edge)." },
  { id: "bwat_peripheral_edema", label: "Peripheral (Periwound) Edema", type: 'select', options: bwatPeripheralEdemaOptions, defaultValue: 1, validation: getValidationSchema('select', bwatPeripheralEdemaOptions, 1, 5), description: "Edema next to the wound." },
  { id: "bwat_peripheral_indur", label: "Peripheral (Periwound) Induration", type: 'select', options: bwatPeripheralIndurationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatPeripheralIndurationOptions, 1, 5), description: "Firmness of periwound tissue." },
  { id: "bwat_granulation", label: "Granulation Tissue", type: 'select', options: bwatGranulationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatGranulationOptions, 1, 5), description: "Percentage of wound bed with healthy granulation." },
  { id: "bwat_epithelialization", label: "Epithelialization", type: 'select', options: bwatEpithelializationOptions, defaultValue: 1, validation: getValidationSchema('select', bwatEpithelializationOptions, 1, 5), description: "Percentage of wound surface covered with new epithelium." },
];


export const bwatTool: Tool = {
  id: "bwat",
  name: "Bates-Jensen Wound Assessment Tool",
  acronym: "BWAT",
  description: "A standardized instrument to assess and monitor the status and healing progression of chronic wounds, quantifying 13 key wound characteristics.",
  condition: "Chronic Wounds, Pressure Ulcers, Diabetic Foot Ulcers, Venous Leg Ulcers, Surgical Wounds",
  keywords: ["bwat", "Bates-Jensen", "wound assessment", "pressure ulcer", "chronic wound", "wound healing", "score", "monitoring"],
  sourceType: 'Clinical Guideline', // Or 'Research'
  icon: ClipboardList,
  formSections: bwatFormSections,
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const itemScores: Record<string, number> = {};

    bwatFormSections.forEach(section => {
      // Type guard to ensure section is InputConfig
      if ('type' in section) {
        const inputConfig = section as InputConfig;
        const score = Number(inputs[inputConfig.id]) || 1; // Default to 1 if undefined/NaN
        totalScore += score;
        itemScores[inputConfig.id.replace('bwat_', '')] = score;
      }
    });

    let severityCategory = "Undefined";
    if (totalScore <= 20) severityCategory = "Minimal Severity (Wound approaching healed state)";
    else if (totalScore <= 30) severityCategory = "Mild Severity (Slowly healing or stable)";
    else if (totalScore <= 40) severityCategory = "Moderate Severity (Delayed healing, potential complications)";
    else severityCategory = "Extreme Severity (Non-healing, high risk of deterioration)";

    const interpretation = `Total BWAT Score: ${totalScore} (Range: 13–65). Wound Status: ${severityCategory}. A lower score indicates a healthier wound.`;

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
    "Sussman C, Bates-Jensen BM. Wound Care: A Collaborative Practice Manual for Health Professionals. 4th ed. Wolters Kluwer Health; 2007. Chapter 6: “Tools to Measure Wound Healing.”",
    "Harris C, Bates-Jensen B, Parslow N, Raizman R, Singh M, Ketchen R. Concurrent Validation and Reliability of Digital Image Analysis of the Bates-Jensen Wound Assessment Tool in Pressure Ulcer Measurement. Wound Repair Regen. 2011;19(3):302–309.",
    "Agarwal S, et al. Improved Bates-Jensen Score Following Negative Pressure Wound Therapy on Wounds of Various Aetiologies: An Experience From a Tertiary Care Centre. Wounds Int. (2019).",
    "Lippincott Manual. Bates-Jensen Wound Assessment Tool (BWAT) User Guide.",
    "Agency for Clinical Innovation (NSW). Wound Assessment Validated Tool: BWAT.",
    "Dalamagka MI, et al. Role of Bates-Jensen Wound Assessment Tool (BJWAT) in Wound Management: A Tertiary Care Centre Study. Clin Res Trials. 2023;11(1):235–243."
  ]
};

    