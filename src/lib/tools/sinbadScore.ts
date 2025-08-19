import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';
import { z } from 'zod';

const sinbadOptions: InputOption[] = [
  { label: "No", value: "0" },
  { label: "Yes", value: "1" }
];

const sinbadSiteOptions: InputOption[] = [
    { label: "No (Forefoot)", value: "0" },
    { label: "Yes (Midfoot/Hindfoot)", value: "1" }
];

const sinbadDepthOptions: InputOption[] = [
    { label: "No (Superficial)", value: "0" },
    { label: "Yes (Deep to bone/joint)", value: "1" }
];


const sinbadFormSections: FormSectionConfig[] = [
  {
    id: "sinbad-components",
    title: "SINBAD Components",
    gridCols: 1,
    description: "Answer 'Yes' (1 point) or 'No' (0 points) for each of the following five factors.",
    inputs: [
      { id: "site", label: "(S)ite: Is the ulcer on the midfoot or hindfoot?", type: 'radio', options: sinbadSiteOptions, defaultValue: "0", validation: z.string().min(1, {message: "Selection for Site is required."}) },
      { id: "ischemia", label: "(I)schemia: Is there clinical evidence of reduced pedal perfusion?", type: 'radio', options: sinbadOptions, defaultValue: "0", validation: z.string().min(1, {message: "Selection for Ischemia is required."}) },
      { id: "neuropathy", label: "(N)europathy: Is there loss of protective sensation?", type: 'radio', options: sinbadOptions, defaultValue: "0", validation: z.string().min(1, {message: "Selection for Neuropathy is required."}) },
      { id: "bacterial_infection", label: "(B)acterial Infection: Is there clinical evidence of infection?", type: 'radio', options: sinbadOptions, defaultValue: "0", validation: z.string().min(1, {message: "Selection for Bacterial Infection is required."}) },
      { id: "depth", label: "(D)epth: Is the wound penetrating to bone or joint?", type: 'radio', options: sinbadDepthOptions, defaultValue: "0", validation: z.string().min(1, {message: "Selection for Depth is required."}) }
    ]
  } as InputGroupConfig
];

export const sinbadScoreTool: Tool = {
  id: "sinbad-score",
  name: "SINBAD Score",
  acronym: "SINBAD",
  description: "The SINBAD score is a simple and reproducible clinical scoring system for diabetic foot ulcers. The acronym stands for its five components: Site, Ischemia, Neuropathy, Bacterial Infection, and Depth. Each component is scored as either 0 or 1, making it easy to calculate a total score ranging from 0 to 5. It is validated and predictive of major outcomes, including ulcer healing and risk of amputation, with higher scores indicating a more complex wound and poorer prognosis.",
  condition: "Diabetic Foot Ulcer",
  keywords: [
    "SINBAD", "diabetic foot", "wound", "ulcer", "site", "ischemia",
    "neuropathy", "infection", "depth", "prognosis"
  ],
  sourceType: "Research",
  icon: ClipboardList,
  formSections: sinbadFormSections,
  calculationLogic: (inputs) => {
    const site = inputs.site as string;
    const ischemia = inputs.ischemia as string;
    const neuropathy = inputs.neuropathy as string;
    const bacterial_infection = inputs.bacterial_infection as string;
    const depth = inputs.depth as string;

    if ([site, ischemia, neuropathy, bacterial_infection, depth].some(val => val === undefined || val === null)) {
      return { score: "N/A", interpretation: 'Please answer all five questions.', details: {} };
    }

    const score = parseInt(site) + parseInt(ischemia) + parseInt(neuropathy) + parseInt(bacterial_infection) + parseInt(depth);

    let interpretationText;
    if (score < 3) {
      interpretationText = 'Low risk. The ulcer has a good prognosis for healing without major intervention.';
    } else {
      interpretationText = 'High risk. A score of 3 or more is associated with a significantly higher risk of non-healing and major amputation.';
    }

    return {
      score: score,
      interpretation: `Total SINBAD Score: ${score}. ${interpretationText}`,
      details: {
        'Total_SINBAD_Score': `${score} (Range: 0-5. Higher scores indicate worse prognosis.)`,
        'Site_Hind_Midfoot': `${parseInt(site)} pt`,
        'Ischemia': `${parseInt(ischemia)} pt`,
        'Neuropathy': `${parseInt(neuropathy)} pt`,
        'Bacterial_Infection': `${parseInt(bacterial_infection)} pt`,
        'Depth_to_bone_joint': `${parseInt(depth)} pt`
      }
    };
  },
  references: [
    "Ince P, Abbas ZG, Lutale JK, et al. The SINBAD classification of the diabetic foot and its relationship with outcomes. J Vasc Surg. 2008;47(4):869. (Abstract)",
    "The SINBAD study group. Diabetes and foot care: the effectiveness of a simple classification system in predicting outcome. Diabetes Voice. 2005;50:18-21.",
    "Abbas ZG, Gillani A, Zaini A. The SINBAD score as a predictor of outcome of diabetic foot ulcers. A prospective study. The Diabetic Foot Journal. 2011;14(2):68-75."
  ]
};
