
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const dlqiFormSections: FormSectionConfig[] = Array.from({ length: 10 }, (_, i) => {
    const questionTexts = [
        "Over the last week, how itchy, sore, painful or stinging has your skin been?",
        "Over the last week, how embarrassed or self conscious have you been because of your skin?",
        "Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?",
        "Over the last week, how much has your skin influenced the clothes you wear?",
        "Over the last week, how much has your skin affected any social or leisure activities?",
        "Over the last week, how much has your skin made it difficult for you to do any sport?",
        "Over the last week, has your skin prevented you from working or studying?", // Q7
        "Over the last week, how much has your skin created problems with your partner or any of your close friends or relatives?",
        "Over the last week, how much has your skin caused any sexual difficulties?",
        "Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?"
    ];
    let q_options: InputOption[] = [
        { value: 3, label: 'Very much' },
        { value: 2, label: 'A lot' },
        { value: 1, label: 'A little' },
        { value: 0, label: 'Not at all' },
    ];
    if (i === 6) { // Question 7
        q_options.push({ value: 0, label: 'Not relevant (Scores 0)' });
    }
    return {
      id: `q${i + 1}`,
      label: `Q${i + 1}: ${questionTexts[i]}`,
      type: 'select' as 'select',
      options: q_options,
      defaultValue: 0,
      validation: getValidationSchema('select', q_options, 0, 3),
    } as InputConfig;
  });

export const dlqiTool: Tool = {
  id: 'dlqi',
  name: 'Dermatology Life Quality Index',
  acronym: 'DLQI',
  description: 'A 10-question questionnaire to measure the impact of skin disease on a person\'s quality of life.',
  condition: 'Quality of Life',
  keywords: ['dlqi', 'quality of life', 'skin disease', 'impact', 'patient reported'],
  sourceType: 'Expert Consensus',
  icon: ClipboardList,
  formSections: dlqiFormSections,
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, number> = {};
    for (let i = 1; i <= 10; i++) {
      const val = Number(inputs[`q${i}`]) || 0;
      details[`Q${i}`] = val;
      score += val;
    }
    let interpretation = '';
    if (score <= 1) interpretation = 'No effect at all on patient\'s life.';
    else if (score <= 5) interpretation = 'Small effect on patient\'s life.';
    else if (score <= 10) interpretation = 'Moderate effect on patient\'s life.';
    else if (score <= 20) interpretation = 'Very large effect on patient\'s life.';
    else interpretation = 'Extremely large effect on patient\'s life.';
    return { score, interpretation, details };
  },
  references: ["Finlay AY, Khan GK. Dermatology Life Quality Index (DLQI)--a simple practical measure for routine clinical use. Clin Exp Dermatol. 1994 May;19(3):210-6."]
};
