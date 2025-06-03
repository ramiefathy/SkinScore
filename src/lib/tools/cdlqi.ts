
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
  description: "A 10-question questionnaire to measure the impact of skin disease on the quality of life of children aged 4-16 years.",
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
    let interpretation = `CDLQI Score: ${score} (Range: 0-30). `;
    if (score === 0) interpretation += 'No effect at all on child\'s life.';
    else if (score <= 6) interpretation += 'Small effect on child\'s life.';
    else if (score <= 12) interpretation += 'Moderate effect on child\'s life.';
    else if (score <= 18) interpretation += 'Very large effect on child\'s life.';
    else interpretation += 'Extremely large effect on child\'s life.';
    interpretation += " (Severity bands examples: 0 No effect, 1-6 Small, 7-12 Moderate, 13-18 Very large, 19-30 Extremely large)";
    return { score, interpretation, details };
  },
  references: ["Lewis-Jones MS, Finlay AY. The Children's Dermatology Life Quality Index (CDLQI): initial validation and practical application. Br J Dermatol. 1995 Jul;132(6):942-9."]
};
