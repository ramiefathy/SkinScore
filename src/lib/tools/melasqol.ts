import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users2 } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const melasqolTool: Tool = {
  id: "melasqol",
  name: "Melasma Quality of Life Scale (MELASQOL)",
  acronym: "MELASQOL",
  condition: "Quality of Life",
  keywords: ["melasqol", "melasma", "quality of life", "patient reported", "psychosocial impact"],
  description: "The MELASQOL (Melasma Quality of Life Scale) is a 10-item patient-reported outcome measure specifically designed to assess the psychosocial impact of melasma.",
  sourceType: 'Research',
  icon: Users2,
  rationale: "The MELASQOL was developed to specifically assess the impact of melasma—a chronic pigmentary disorder—on patients’ health-related quality of life (HRQoL). The rationale for its creation was the recognition that generic dermatology instruments, such as the DLQI, may not adequately capture the unique psychosocial burden of melasma, which is often characterized by emotional distress and social impairment due to visible skin changes. The MELASQOL is intended to provide a disease-specific measure that can inform both clinical care and research by quantifying the psychosocial impact of melasma and monitoring changes over time. The MELASQOL consists of 10 items, each scored on a 7-point Likert scale (1 = not bothered at all, 7 = bothered all the time). The total score is the sum of all items, ranging from 10 to 70, with higher scores indicating greater impairment. There are no formal subscores or domains; the total score is interpreted as a global measure of melasma-related quality of life impairment.",
  clinicalPerformance: "The MELASQOL demonstrates high internal consistency, with Cronbach’s alpha values typically reported between 0.88 and 0.92 in both original and real-world studies, including various translations (Spanish, Portuguese, French, Turkish, among others). Test-retest reliability is generally high when reported, but specific values are less frequently published. The MELASQOL is not designed as a diagnostic tool, so sensitivity, specificity, and AUC are not typically reported or relevant. Validation studies have confirmed the MELASQOL’s reliability and validity across multiple languages and cultural contexts. Systematic reviews have highlighted its strong psychometric properties and its ability to capture the unique impact of melasma on quality of life. Comparative studies indicate that the MELASQOL is more sensitive than generic instruments in detecting the psychosocial burden of melasma. The MELASQOL has been criticized for limited item coverage and potential oversimplification, as it may not capture all psychosocial impacts relevant to diverse patient populations. The lack of subscores or domain-specific analysis may also limit its ability to identify specific areas of impairment.",
  formSections: [
    {id:"total_score", label:"Total MELASQOL Score (10-70)", type:'number', min:10, max:70, defaultValue:10, description:"Enter the sum of scores from the 10 questions (each question 1-7).", validation:getValidationSchema('number', [], 10, 70)}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||10;
      const interpretation = `MELASQOL Score: ${score} (Range: 10-70). Higher score indicates worse quality of life.`;
      return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: [
    "Zhu Y, Zeng X, Ying J, et al. Evaluating the Quality of Life Among Melasma Patients Using the MELASQoL Scale: A Systematic Review and Meta-Analysis. PloS One. 2022;17(1):e0262833. doi:10.1371/journal.pone.0262833.",
    "Lieu TJ, Pandya AG. Melasma Quality of Life Measures. Dermatologic Clinics. 2012;30(2):269-80, viii. doi:10.1016/j.det.2011.11.009.",
    "Balkrishnan R, McMichael AJ, Camacho FT, et al. Development and Validation of a Health-Related Quality of Life Instrument for Women With Melasma. The British Journal of Dermatology. 2003;149(3):572-7. doi:10.1046/j.1365-2133.2003.05419.x.",
    "Lacey RE, Minnis H. Practitioner Review: Twenty Years of Research With Adverse Childhood Experience Scores - Advantages, Disadvantages and Applications to Practice. Journal of Child Psychology and Psychiatry, and Allied Disciplines. 2020;61(2):116-130. doi:10.1111/jcpp.13135.",
    "McLennan JD, MacMillan HL, Afifi TO. Questioning the Use of Adverse Childhood Experiences (ACEs) Questionnaires. Child Abuse & Neglect. 2020;101:104331. doi:10.1016/j.chiabu.2019.104331."
  ]
};
