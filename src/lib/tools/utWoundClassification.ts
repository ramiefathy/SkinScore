import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';
import { z } from 'zod';

const gradeOptions: InputOption[] = [
  { label: "Grade 0: Pre- or post-ulcerative lesion, completely epithelialized", value: "0" },
  { label: "Grade 1: Superficial wound, not involving tendon, capsule, or bone", value: "1" },
  { label: "Grade 2: Wound penetrating to tendon or capsule", value: "2" },
  { label: "Grade 3: Wound penetrating to bone or joint", value: "3" }
];

const stageOptions: InputOption[] = [
  { label: "Stage A: Clean wound (No infection or ischemia)", value: "A" },
  { label: "Stage B: With Infection", value: "B" },
  { label: "Stage C: With Ischemia", value: "C" },
  { label: "Stage D: With Infection and Ischemia", value: "D" }
];

const utWoundFormSections: FormSectionConfig[] = [
  {
    id: "ut_classification_group",
    title: "UT Wound Classification",
    gridCols: 1,
    inputs: [
      {
        id: "grade",
        label: "Select the Ulcer Grade (Depth)",
        type: 'radio',
        options: gradeOptions,
        defaultValue: "0",
        validation: z.string({required_error: "Grade selection is required."}).min(1, { message: "Grade selection is required." })
      },
      {
        id: "stage",
        label: "Select the Ulcer Stage (Infection/Ischemia)",
        type: 'radio',
        options: stageOptions,
        defaultValue: "A",
        validation: z.string({required_error: "Stage selection is required."}).min(1, { message: "Stage selection is required." })
      }
    ]
  } as InputGroupConfig
];

export const utWoundClassificationTool: Tool = {
  id: "ut-wound-classification",
  name: "University of Texas (UT) Wound Classification System",
  acronym: "UTWCS",
  description: "The University of Texas (UT) Wound Classification System is a validated tool used primarily for diabetic foot ulcers. It classifies ulcers based on a matrix system that considers both the depth of the ulcer (Grade) and the presence of two key complicating factors: infection and ischemia (Stage). This dual approach provides a more comprehensive assessment than depth alone, making it highly predictive of clinical outcomes such as the likelihood of healing and the risk of amputation.",
  condition: "Diabetic Foot Ulcer",
  keywords: [
    "diabetic foot", "wound", "ulcer", "UTWCS", "Texas", "classification",
    "ischemia", "infection", "depth", "gangrene"
  ],
  sourceType: "Research",
  icon: ClipboardList,
  formSections: utWoundFormSections,
  calculationLogic: (inputs) => {
    const grade = inputs.grade as string;
    const stage = inputs.stage as string;

    if (!grade || !stage) {
      return { score: "N/A", interpretation: 'Please select both a grade and a stage.', details: {} };
    }

    const gradeDescriptions: Record<string, string> = {
      '0': 'Pre- or post-ulcerative lesion, completely epithelialized.',
      '1': 'Superficial wound, not involving tendon, capsule, or bone.',
      '2': 'Wound penetrating to tendon or capsule.',
      '3': 'Wound penetrating to bone or joint.'
    };

    const stageDescriptions: Record<string, string> = {
      'A': 'The wound is clean (No infection or ischemia).',
      'B': 'The wound is infected.',
      'C': 'The wound is ischemic.',
      'D': 'The wound is both infected and ischemic.'
    };

    const riskMap: Record<string, string> = {
      '0A': 'Lowest Risk',
      '1A': 'Low Risk', '2A': 'Low Risk', '3A': 'Moderate Risk',
      '0B': 'Low Risk', '1B': 'Moderate Risk', '2B': 'High Risk', '3B': 'Highest Risk',
      '0C': 'Low Risk', '1C': 'Moderate Risk', '2C': 'High Risk', '3C': 'Highest Risk',
      '0D': 'Moderate Risk', '1D': 'High Risk', '2D': 'Highest Risk', '3D': 'Highest Risk'
    };

    const finalClassification = `Grade ${grade}, Stage ${stage}`;
    const riskLevel = riskMap[grade + stage] || 'Risk level not defined for this combination';
    const interpretation = `Classification: ${finalClassification}. ${gradeDescriptions[grade]} ${stageDescriptions[stage]} Associated Risk: ${riskLevel}. Higher grades and stages (especially D) are strongly associated with a higher risk of non-healing and amputation.`;

    return {
      score: finalClassification,
      interpretation: interpretation,
      details: {
        Classification: finalClassification,
        Grade_Description: gradeDescriptions[grade],
        Stage_Description: stageDescriptions[stage],
        Associated_Risk_Level: riskLevel,
      }
    };
  },
  references: [
    "Armstrong DG, Lavery LA, Harkless LB. Validation of a diabetic wound classification system. The healing-het and risk-for-amputation study. Diabetes Care. 1998;21(5):855-859.",
    "Lavery LA, Armstrong DG, Harkless LB. Classification of diabetic foot wounds. J Foot Ankle Surg. 1996;35(6):528-531."
  ]
};
