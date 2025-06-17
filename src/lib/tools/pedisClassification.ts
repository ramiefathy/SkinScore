
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';
import { z } from 'zod';

const pedisPerfusionOptions: InputOption[] = [
  { label: "Grade 1: No evidence of peripheral arterial disease (PAD)", value: "1" },
  { label: "Grade 2: Evidence of PAD, but not critical limb ischemia (CLI)", value: "2" },
  { label: "Grade 3: Evidence of critical limb ischemia (CLI)", value: "3" }
];
const pedisExtentOptions: InputOption[] = [
  { label: "Grade 1: < 1 cm²", value: "1" },
  { label: "Grade 2: 1-3 cm²", value: "2" },
  { label: "Grade 3: > 3 cm²", value: "3" }
];
const pedisDepthOptions: InputOption[] = [
  { label: "Grade 1: Superficial ulcer", value: "1" },
  { label: "Grade 2: Ulcer penetrating to subcutaneous tissue/fascia/muscle/tendon", value: "2" },
  { label: "Grade 3: Ulcer penetrating to bone or joint", value: "3" }
];
const pedisInfectionOptions: InputOption[] = [
  { label: "Grade 1: No signs or symptoms of infection", value: "1" },
  { label: "Grade 2: Mild infection (local, skin & subcutaneous tissue only)", value: "2" },
  { label: "Grade 3: Moderate infection (deeper than skin/subcutis or >2cm erythema)", value: "3" },
  { label: "Grade 4: Severe infection (with systemic signs of inflammatory response)", value: "4" }
];
const pedisSensationOptions: InputOption[] = [
  { label: "Grade 1: No loss of protective sensation (LOPS)", value: "1" },
  { label: "Grade 2: Loss of protective sensation present", value: "2" }
];

const pedisFormSections: FormSectionConfig[] = [
  {
    type: "InputGroupConfig",
    id: "pedis-components",
    title: "PEDIS Components",
    gridCols: 1,
    description: "Select the appropriate grade for each of the five PEDIS categories.",
    inputs: [
      { id: "perfusion", label: "(P)erfusion", type: 'radio', options: pedisPerfusionOptions, defaultValue: "1", validation: z.string().min(1, {message: "Perfusion grade is required."}) },
      { id: "extent", label: "(E)xtent / Size", type: 'radio', options: pedisExtentOptions, defaultValue: "1", validation: z.string().min(1, {message: "Extent grade is required."}) },
      { id: "depth", label: "(D)epth / Tissue Loss", type: 'radio', options: pedisDepthOptions, defaultValue: "1", validation: z.string().min(1, {message: "Depth grade is required."}) },
      { id: "infection", label: "(I)nfection (based on IWGDF/IDSA)", type: 'radio', options: pedisInfectionOptions, defaultValue: "1", validation: z.string().min(1, {message: "Infection grade is required."}) },
      { id: "sensation", label: "(S)ensation / Neuropathy", type: 'radio', options: pedisSensationOptions, defaultValue: "1", validation: z.string().min(1, {message: "Sensation grade is required."}) }
    ]
  } as InputGroupConfig
];

export const pedisClassificationTool: Tool = {
  id: "pedis-classification",
  name: "PEDIS Classification",
  acronym: "PEDIS",
  description: "The PEDIS classification system was developed by the International Working Group on the Diabetic Foot (IWGDF) to standardize the assessment and description of diabetic foot ulcers. The acronym stands for Perfusion, Extent (size), Depth (tissue loss), Infection, and Sensation. Unlike a summative score, PEDIS provides a separate grade for each of the five categories. This detailed, multi-axial approach creates a comprehensive profile of the wound, which is critical for guiding treatment and predicting outcomes.",
  condition: "Diabetic Foot Ulcer",
  keywords: [
    "PEDIS", "IWGDF", "diabetic foot", "wound", "ulcer",
    "perfusion", "extent", "depth", "infection", "sensation"
  ],
  sourceType: "Clinical Guideline",
  icon: ClipboardList,
  formSections: pedisFormSections,
  calculationLogic: (inputs) => {
    const perfusion = inputs.perfusion as string;
    const extent = inputs.extent as string;
    const depth = inputs.depth as string;
    const infection = inputs.infection as string;
    const sensation = inputs.sensation as string;

    const allInputsPresent = perfusion && extent && depth && infection && sensation;

    if (!allInputsPresent) {
      return { score: "N/A", interpretation: 'Please select a grade for all five categories.', details: {} };
    }

    const finalClassification = `P${perfusion} E${extent} D${depth} I${infection} S${sensation}`;

    const descriptions: Record<string, Record<string, string>> = {
      perfusion: { '1': 'No PAD', '2': 'PAD without CLI', '3': 'Critical Limb Ischemia' },
      extent: { '1': '< 1 cm²', '2': '1-3 cm²', '3': '> 3 cm²' },
      depth: { '1': 'Superficial ulcer', '2': 'Ulcer penetrating to subcutaneous tissue/fascia/muscle/tendon', '3': 'Ulcer penetrating to bone or joint' },
      infection: { '1': 'No signs or symptoms of infection', '2': 'Mild infection (local, skin & subcutaneous tissue only)', '3': 'Moderate infection (deeper than skin/subcutis or >2cm erythema)', '4': 'Severe infection (with systemic signs of inflammatory response)' },
      sensation: { '1': 'No loss of protective sensation (LOPS)', '2': 'Loss of protective sensation present' }
    };

    const interpretationText = `This ulcer is classified as ${finalClassification}. This indicates a wound with ${descriptions.perfusion[perfusion]}, an extent of ${descriptions.extent[extent]}, a depth that is ${descriptions.depth[depth]}, with a ${descriptions.infection[infection].toLowerCase()}, in a patient with ${descriptions.sensation[sensation].toLowerCase()}. Higher grades in Perfusion, Depth, and Infection are strong predictors of poor outcomes.`;

    return {
      score: finalClassification,
      interpretation: interpretationText,
      details: {
        Perfusion: `P${perfusion}: ${descriptions.perfusion[perfusion]}`,
        Extent: `E${extent}: ${descriptions.extent[extent]}`,
        Depth: `D${depth}: ${descriptions.depth[depth]}`,
        Infection: `I${infection}: ${descriptions.infection[infection]}`,
        Sensation: `S${sensation}: ${descriptions.sensation[sensation]}`
      }
    };
  },
  references: [
    "Schaper NC; International Working Group on the Diabetic Foot. The PEDIS classification system. Diabetes Metab Res Rev. 2004;20 Suppl 1:S90-S95.",
    "Lipsky BA, Berendt AR, Cornia PB, et al. 2012 Infectious Diseases Society of America clinical practice guideline for the diagnosis and treatment of diabetic foot infections. Clin Infect Dis. 2012;54(12):e132-e173."
  ]
};
