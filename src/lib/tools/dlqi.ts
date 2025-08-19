
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
    let q_options: InputOption[];
    let defaultValue: string | number;

    if (i === 6) { // This is Question 7
        q_options = [
            { value: '3', label: 'Yes (Prevented work/study)' },
            { value: '0_no', label: 'No' },
            { value: '0_nr', label: 'Not relevant' },
        ];
        defaultValue = '0_no';
    } else if (i === 8) { // This is Question 9 (sexual difficulties)
        q_options = [
            { value: 3, label: 'Very much' },
            { value: 2, label: 'A lot' },
            { value: 1, label: 'A little' },
            { value: 0, label: 'Not at all' },
            { value: '0_nr', label: 'Not relevant' }, // Add not relevant option
        ];
        defaultValue = 0;
    }
    else {
        q_options = [
            { value: 3, label: 'Very much' },
            { value: 2, label: 'A lot' },
            { value: 1, label: 'A little' },
            { value: 0, label: 'Not at all' },
        ];
        defaultValue = 0;
    }

    return {
      id: `q${i + 1}`,
      label: `Q${i + 1}: ${dlqiQuestionTexts[i]}`,
      type: 'select' as 'select',
      options: q_options,
      defaultValue: defaultValue,
      validation: getValidationSchema('select', q_options),
    } as InputConfig;
  });

export const dlqiTool: Tool = {
  id: 'dlqi',
  name: 'Dermatology Life Quality Index',
  acronym: 'DLQI',
  description: 'The DLQI is a dermatology-specific HRQoL instrument designed to measure the impact of skin diseases on adult patients’ daily lives. It is a 10-item self-administered questionnaire covering symptoms, feelings, daily activities, leisure, work/school, personal relationships, and treatment over the previous week. Each item scored 0 (not at all) to 3 (very much).',
  condition: 'Quality of Life',
  keywords: ['dlqi', 'quality of life', 'skin disease', 'impact', 'patient reported'],
  sourceType: 'Expert Consensus',
  icon: ClipboardList,
  rationale: "The DLQI is a dermatology-specific HRQoL instrument designed to measure the impact of skin diseases on adult patients’ daily lives. Its purpose is to provide a standardized, validated method for quantifying the effect of dermatological conditions on quality of life, supporting both clinical decision-making and research. The DLQI consists of 10 items, each scored on a 4-point scale (0 = not at all, 1 = a little, 2 = a lot, 3 = very much). The total score ranges from 0 to 30, with higher scores indicating greater impairment. While the DLQI covers six conceptual domains (symptoms and feelings, daily activities, leisure, work/school, personal relationships, and treatment), it is most commonly reported as a single total score.",
  clinicalPerformance: "The DLQI consistently demonstrates high internal consistency, with Cronbach’s alpha values most commonly reported between 0.80 and 0.92. Test-retest reliability is also strong, though specific ICC or Pearson’s r values are not always reported. The DLQI is not designed as a diagnostic tool, so sensitivity, specificity, and AUC are rarely reported or relevant. The DLQI has been validated in over 44 languages and used in a wide range of dermatological conditions. Comparative studies have shown that while the DLQI is widely used and easy to administer, it may be less sensitive than instruments like the Skindex-16 in detecting small impairments, particularly in patients with mild symptoms. The DLQI’s performance varies by disease, severity, and setting, but it remains the most commonly used dermatology-specific HRQoL instrument. Criticisms of the DLQI include its simple additive scoring, which may mask the relative importance of individual items, and limited sensitivity to certain domains, such as psychosocial impacts. Content validity concerns have been raised, particularly regarding its ability to capture the full spectrum of disease burden in diverse populations. Ceiling effects have also been reported, with some patients indicating no quality of life impairment despite significant disease.",
  formSections: dlqiFormSections,
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, number> = {};
    for (let i = 1; i <= 10; i++) {
      const rawVal = inputs[`q${i}`];
      let numVal = 0;
      
      // For Q7, '3' scores 3, others score 0.
      if (i === 7) {
        if (rawVal === '3') {
          numVal = 3;
        } else { // '0_no' and '0_nr'
          numVal = 0;
        }
      }
      // For Q9, '0_nr' scores 0
      else if (i === 9) {
          if (rawVal === '0_nr') {
              numVal = 0;
          } else {
              numVal = Number(rawVal) || 0;
          }
      }
      else {
        numVal = Number(rawVal) || 0;
      }
      
      details[`Q${i}`] = numVal;
      score += numVal;
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
      "Chernyshov PV, Finlay AY, Tomas-Aragones L, et al. Quality of Life Measurement in Rosacea. Position Statement of the European Academy of Dermatology and Venereology Task Forces on Quality of Life and Patient Oriented Outcomes and Acne, Rosacea and Hidradenitis Suppurativa. Journal of the European Academy of Dermatology and Venereology : JEADV. 2023;37(5):954-964. doi:10.1111/jdv.18918.",
      "Kunesh J, Banna J, Greene A, Hartmark-Hill J. Assessing Top Quality of Life Measures in Acne Vulgaris Studies: A Crucial Dimension in Patient-Centric Care. Archives of Dermatological Research. 2024;316(9):623. doi:10.1007/s00403-024-03370-w.",
      "A Comparison of the Different Questionnaires Used to Measure Health-Related Quality of Life in Patients With Dermatological Conditions. The British Journal of Dermatology. 2022;186(3):e111-e133. doi:10.1111/bjd.20985.",
      "Chernyshov PV, Zouboulis CC, Tomas-Aragones L, et al. Quality of Life Measurement in Acne. Position Paper of the European Academy of Dermatology and Venereology Task Forces on Quality of Life and Patient Oriented Outcomes and Acne, Rosacea and Hidradenitis Suppurativa. Journal of the European Academy of Dermatology and Venereology : JEADV. 2018;32(2):194-208. doi:10.1111/jdv.14585.",
      "Chiu CW, Tsai J, Huang YC. Health-Related Quality of Life of Patients With Rosacea: A Systematic Review and Meta-Analysis of Real-World Data. Acta Dermato-Venereologica. 2024;104:adv40053. doi:10.2340/actadv.v104.40053.",
      "Smith H, Layton AM, Thiboutot D, et al. Identifying the Impacts of Acne and the Use of Questionnaires to Detect These Impacts: A Systematic Literature Review. American Journal of Clinical Dermatology. 2021;22(2):159-171. doi:10.1007/s40257-020-00564-6.",
      "Chernyshov PV. The Evolution of Quality of Life Assessment and Use in Dermatology. Dermatology (Basel, Switzerland). 2019;235(3):167-174. doi:10.1159/000496923.",
      "Hahn HB, Melfi CA, Chuang TY, et al. Use of the Dermatology Life Quality Index (DLQI) in a Midwestern US Urban Clinic. Journal of the American Academy of Dermatology. 2001;45(1):44-8. doi:10.1067/mjd.2001.110880.",
      "Vyas J, Johns JR, Ali FM, et al. A Systematic Review of 207 Studies Describing Validation Aspects of the Dermatology Life Quality Index. Acta Dermato-Venereologica. 2024;104:adv41120. doi:10.2340/actadv.v104.41120.",
      "Jorge MFS, Sousa TD, Pollo CF, et al. Dimensionality and Psychometric Analysis of DLQI in a Brazilian Population. Health and Quality of Life Outcomes. 2020;18(1):268. doi:10.1186/s12955-020-01523-9.",
      "Lacey RE, Minnis H. Practitioner Review: Twenty Years of Research With Adverse Childhood Experience Scores - Advantages, Disadvantages and Applications to Practice. Journal of Child Psychology and Psychiatry, and Allied Disciplines. 2020;61(2):116-130. doi:10.1111/jcpp.13135.",
      "McLennan JD, MacMillan HL, Afifi TO. Questioning the Use of Adverse Childhood Experiences (ACEs) Questionnaires. Child Abuse & Neglect. 2020;101:104331. doi:10.1016/j.chiabu.2019.104331.",
      "Finlay AY, Khan GK. Dermatology Life Quality Index (DLQI)--a simple practical measure for routine clinical use. Clin Exp Dermatol. 1994 May;19(3):210-6."
  ]
};
