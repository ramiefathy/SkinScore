
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
  description: "The CDLQI is a pediatric adaptation of the DLQI, designed to assess the impact of skin diseases on the quality of life of children aged 4 to 16 years. It consists of 10 items, each scored from 0 to 3, covering symptoms, feelings, leisure, school, personal relationships, sleep, and treatment.",
  sourceType: 'Expert Consensus',
  icon: Baby,
  rationale: "The CDLQI is a pediatric adaptation of the DLQI, designed to assess the impact of skin diseases on the quality of life of children aged 4 to 16 years. It recognizes that children experience and express the burden of dermatological conditions differently from adults, affecting school performance, social interactions, and family dynamics. The CDLQI consists of 10 items, each scored from 0 to 3, with a total score range of 0 to 30. The items are tailored to be age-appropriate and cover similar domains as the adult DLQI. The CDLQI is typically reported as a single total score, though domain subscores can be calculated for research purposes. The CDLQI was developed and validated in the mid-1990s, with a comprehensive review by Salek et al. summarizing its clinical experience and psychometric properties across 28 countries and 44 languages. The instrument has been used in 14 skin conditions and validated in multiple cultural contexts. Content validity has been rated as sufficient in group discussion studies.",
  clinicalPerformance: "The CDLQI demonstrates high internal consistency, with Cronbach’s alpha values typically ranging from 0.82 to 0.92 in both original and translated versions. Test-retest reliability is also high, with a Cantonese validation study reporting a test-retest correlation (gamma) of 0.958 over a 7-day interval. The CDLQI is not designed as a diagnostic tool, so sensitivity, specificity, and AUC are not typically reported. The CDLQI has been validated in 44 languages and six cultural adaptations, with evidence of high reliability, validity, and responsiveness to change. Comparative studies confirm its utility in a wide range of pediatric dermatological conditions. Content validity has been rated as sufficient for use in atopic eczema and other conditions. Limitations of the CDLQI mirror those of the DLQI, including potential underrepresentation of certain domains and the challenge of proxy versus self-report in pediatric populations. The instrument may not address all pediatric-specific impacts, and content validity concerns have been raised in some contexts.",
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
    "Salek MS, Jung S, Brincat-Ruffini LA, et al. Clinical Experience and Psychometric Properties of the Children's Dermatology Life Quality Index (CDLQI), 1995-2012. The British Journal of Dermatology. 2013;169(4):734-59. doi:10.1111/bjd.12437.",
    "Gabes M, Apfelbacher C. IDQoL, CDLQI and the 45-Item CADIS Received a Sufficient Content Validity Rating During the HOME VII Meeting in Japan: A Group Discussion Study. Journal of the European Academy of Dermatology and Venereology : JEADV. 2021;35(2):458-463. doi:10.1111/jdv.16848.",
    "Chuh AA. Validation of a Cantonese Version of the Children's Dermatology Life Quality Index. Pediatric Dermatology. 2003 Nov-Dec;20(6):479-81. doi:10.1111/j.1525-1470.2003.20604.x.",
    "McLennan JD, MacMillan HL, Afifi TO. Questioning the Use of Adverse Childhood Experiences (ACEs) Questionnaires. Child Abuse & Neglect. 2020;101:104331. doi:10.1016/j.chiabu.2019.104331.",
    "Katrak P, Bialocerkowski AE, Massy-Westropp N, Kumar S, Grimmer KA. A Systematic Review of the Content of Critical Appraisal Tools. BMC Medical Research Methodology. 2004;4:22. doi:10.1186/1471-2288-4-22."
    ]
};
