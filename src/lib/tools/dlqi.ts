
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const dlqiQuestionTexts = [
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

const dlqiFormSections: FormSectionConfig[] = Array.from({ length: 10 }, (_, i) => {
    let q_options: InputOption[] = [
        { value: 3, label: 'Very much' },
        { value: 2, label: 'A lot' },
        { value: 1, label: 'A little' },
        { value: 0, label: 'Not at all' },
    ];
    if (i === 6) { // Question 7 special handling
        q_options = [
            { value: 3, label: 'Yes (Prevented work/study)' },
            { value: 0, label: 'No' }, // "No" also scores 0 if work/study not relevant to the disease's impact
            { value: 0, label: 'Not relevant (Scores 0)' },
        ];
    }
    return {
      id: `q${i + 1}`,
      label: `Q${i + 1}: ${dlqiQuestionTexts[i]}`,
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
  description: 'To assess the impact of skin disease on adult patients’ quality of life. It is a 10-item self-administered questionnaire covering symptoms, feelings, daily activities, leisure, work/school, personal relationships, and treatment over the previous week. Each item scored 0 (not at all) to 3 (very much). The DLQI is widely validated and used in clinical trials and practice to assess dermatology-specific quality of life.',
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
    let interpretationText = '';
    if (score <= 1) interpretationText = 'No effect at all on patient\'s life';
    else if (score <= 5) interpretationText = 'Small effect on patient\'s life';
    else if (score <= 10) interpretationText = 'Moderate effect on patient\'s life';
    else if (score <= 20) interpretationText = 'Very large effect on patient\'s life';
    else interpretationText = 'Extremely large effect on patient\'s life';
    const interpretation = `Total DLQI Score: ${score} (Range: 0–30). ${interpretationText}.`;
    return { score, interpretation, details };
  },
  references: [
    "Finlay, A. Y., & Khan, G. K. (1994). Dermatology Life Quality Index (DLQI)--a simple practical measure for routine clinical use. Clinical and Experimental Dermatology, 19(3), 210–216.",
    "Hongbo, Y., Thomas, C. L., Harrison, M. A., Salek, M. S., & Finlay, A. Y. (2005). Translating the science of quality of life into practice: what do dermatology life quality index scores mean? Journal of Investigative Dermatology, 125(4), 659–664."
  ]
};
