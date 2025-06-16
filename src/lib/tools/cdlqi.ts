
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Baby } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const cdlqiQuestionPrompts = [
  "Q1: Over the last week, how itchy, sore, painful or stinging has your skin been?",
  "Q2: Over the last week, how embarrassed or self-conscious have you been because of your skin?",
  "Q3: Over the last week, how much has your skin interfered with you playing with friends or going to school?",
  "Q4: Over the last week, how much has your skin influenced the clothes you wear?",
  "Q5: Over the last week, how much has your skin affected any hobbies or pastimes?",
  "Q6: Over the last week, how much has your skin made it difficult for you to do any sport?",
  "Q7: Over the last week, has your skin prevented you from going to school or nursery?",
  "Q8: Over the last week, how much has your skin made you feel fed up or sad?",
  "Q9: Over the last week, how much has your skin caused problems with your sleep?",
  "Q10: Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?"
];

const cdlqiFormSections: FormSectionConfig[] = Array.from({ length: 10 }, (_, i) => {
  let cdlqi_options: InputOption[] = [
      { value: 3, label: 'Very much' }, { value: 2, label: 'A lot' },
      { value: 1, label: 'A little' }, { value: 0, label: 'Not at all' },
  ];
   if (i === 6) { // Question 7
       cdlqi_options.push({ value: 0, label: 'Not relevant / Does not apply (Scores 0)' });
   }

  return {
    id: `cdlqi_q${i + 1}`,
    label: cdlqiQuestionPrompts[i],
    type: 'select' as 'select',
    options: cdlqi_options,
    defaultValue: 0,
    validation: getValidationSchema('select', cdlqi_options, 0, 3),
  } as InputConfig;
});

export const cdlqiTool: Tool = {
  id: "cdlqi",
  name: "Children's Dermatology Life Quality Index (CDLQI)",
  acronym: "CDLQI",
  condition: "Quality of Life",
  keywords: ["cdlqi", "quality of life", "children", "pediatric", "skin disease", "patient reported"],
  description: "The CDLQI measures the impact of skin disease on quality of life in children aged 4–16. It's a 10-item questionnaire covering symptoms, feelings, leisure, school, personal relationships, sleep, and treatment. Each question is scored 0–3.",
  sourceType: 'Expert Consensus',
  icon: Baby,
  formSections: cdlqiFormSections,
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, number> = {};
    for (let i = 1; i <= 10; i++) {
      const val = Number(inputs[`cdlqi_q${i}`]) || 0;
      details[`Q${i}`] = val;
      score += val;
    }
    let interpretationText = "";
    if (score <= 2) {
      interpretationText = "Small effect on quality of life";
    } else if (score <= 8) {
      interpretationText = "Moderate effect on quality of life";
    } else if (score <= 15) {
      interpretationText = "Very large effect on quality of life";
    } else {
      interpretationText = "Extremely large effect on quality of life";
    }
    const interpretation = `CDLQI Score: ${score} (Range: 0-30). ${interpretationText}. Higher scores indicate greater impairment.`;
    return { score, interpretation, details };
  },
  references: [
    "Lewis-Jones, M. S., & Finlay, A. Y. (1995). The Children's Dermatology Life Quality Index (CDLQI): initial validation and practical use. British Journal of Dermatology, 132(6), 942-949.",
    "Cardiff University. (n.d.). CDLQI (Children's Dermatology Life Quality Index). Retrieved from https://www.cardiff.ac.uk/medicine/research/themes/dermatology/quality-of-life/childrens-dermatology-life-quality-index"
    // Additional references from the prompt could be added here if they are distinct and relevant.
    ]
};
