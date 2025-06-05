
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const pestQuestionOptions: InputOption[] = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" }
];

const pestFormSections: FormSectionConfig[] = [
  {
    id: "pest_q1_swollen_joint",
    label: "Have you ever had a swollen joint (or joints)?",
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1)
  },
  {
    id: "pest_q2_doctor_arthritis",
    label: "Has a doctor ever told you that you have arthritis?",
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1)
  },
  {
    id: "pest_q3_nail_pits",
    label: "Do your fingernails or toenails have holes or pits?",
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1)
  },
  {
    id: "pest_q4_heel_pain",
    label: "Have you had pain in your heel?",
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1)
  },
  {
    id: "pest_q5_dactylitis",
    label: "Have you had a finger or toe that was completely swollen and painful for no apparent reason?",
    type: 'select',
    options: pestQuestionOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pestQuestionOptions, 0, 1)
  }
];

export const pestTool: Tool = {
  id: "pest",
  name: "Psoriasis Epidemiology Screening Tool",
  acronym: "PEST",
  description: "The PEST is a simple, validated, 5-item, patient-self-administered questionnaire developed to screen for psoriatic arthritis (PsA) in individuals with psoriasis.",
  condition: "Psoriasis, Psoriatic Arthritis",
  keywords: ["pest", "psoriasis", "psoriatic arthritis", "screening", "questionnaire", "arthritis", "nail pitting"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: pestFormSections,
  calculationLogic: (inputs) => {
    const score =
      (Number(inputs.pest_q1_swollen_joint) || 0) +
      (Number(inputs.pest_q2_doctor_arthritis) || 0) +
      (Number(inputs.pest_q3_nail_pits) || 0) +
      (Number(inputs.pest_q4_heel_pain) || 0) +
      (Number(inputs.pest_q5_dactylitis) || 0);

    let interpretation = `PEST Score: ${score} (Range: 0-5). `;
    let recommendation = "";

    if (score >= 3) {
      interpretation += "Suggests an elevated risk of PsA. Consider referral to rheumatology for formal PsA evaluation.";
      recommendation = "Refer to rheumatology";
    } else {
      interpretation += "Low likelihood of PsA. Continue routine dermatology follow-up and repeat screening periodically.";
      recommendation = "Continue routine dermatology screening";
    }

    return {
      score,
      interpretation,
      details: {
        Total_PEST_Score: score,
        Referral_Recommendation: recommendation,
        Q1_Swollen_Joint: inputs.pest_q1_swollen_joint,
        Q2_Doctor_Arthritis: inputs.pest_q2_doctor_arthritis,
        Q3_Nail_Pits: inputs.pest_q3_nail_pits,
        Q4_Heel_Pain: inputs.pest_q4_heel_pain,
        Q5_Dactylitis: inputs.pest_q5_dactylitis,
      }
    };
  },
  references: [
    "Ibrahim GH, Buch MH, Lawson C, Waxman R, Helliwell PS. Evaluation of an existing screening tool for psoriatic arthritis in people with psoriasis and the development of a new instrument: the Psoriasis Epidemiology Screening Tool (PEST) questionnaire. Clin Exp Rheumatol. 2009;27(3):469-474.",
    "Mease PJ, Gladman DD, Papp KA, et al. Prevalence of rheumatologist-diagnosed psoriatic arthritis in patients with psoriasis in European/North American dermatology clinics. J Am Acad Dermatol. 2013;69(5):729-735.",
    "Coates LC, Savage LJ, Chinoy H, et al. Assessment of two screening tools to identify psoriatic arthritis in patients with psoriasis. J Eur Acad Dermatol Venereol. 2018;32(9):1530-1534."
  ]
};
