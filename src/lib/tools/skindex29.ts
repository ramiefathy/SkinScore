
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Presentation } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const skindex29Tool: Tool = {
  id: "skindex29",
  name: "Skindex-29",
  acronym: "Skindex-29",
  condition: "Quality of Life",
  keywords: ["skindex", "quality of life", "symptoms", "emotions", "functioning", "patient reported"],
  description: "Skindex-29 is a dermatology-specific health-related quality of life instrument designed to measure the impact of skin diseases on patients’ lives.",
  sourceType: 'Research',
  icon: Presentation,
  rationale: "It consists of 29 items grouped into three domains: symptoms (7 items), emotions (10 items), and functioning (12 items). Each item is scored on a 5-point Likert scale, and responses are transformed to a linear scale from 0 to 100, with higher scores indicating greater impairment. Domain scores and an overall score are calculated by averaging the relevant items.",
  clinicalPerformance: "Skindex-29 has been extensively validated in diverse dermatologic conditions, demonstrating high internal consistency (Cronbach’s alpha 0.87–0.96), test-retest reliability, and construct validity. Anchor-based studies have identified cut-off values for severely impaired HRQoL: ≥52 for symptoms, ≥39 for emotions, ≥37 for functioning, and ≥44 for the overall score. The tool is responsive to change and is recommended for HRQoL assessment in dermatology research and practice. Short-form versions (Skindex-16, Skindex-17) have been developed and validated, providing similar information with reduced respondent burden. In pediatric populations, Skindex-29 demonstrates good reliability and concordance with Skindex-Teen in adolescents, supporting its use in this age group. Digital and web-based versions preserve psychometric properties and facilitate remote monitoring.",
  formSections: [
    { id: "symptoms_score", label: "Symptoms Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Symptoms domain.", validation: getValidationSchema('number',[],0,100)},
    { id: "emotions_score", label: "Emotions Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Emotions domain.", validation: getValidationSchema('number',[],0,100)},
    { id: "functioning_score", label: "Functioning Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Functioning domain.", validation: getValidationSchema('number',[],0,100)},
  ],
  calculationLogic: (inputs) => {
    const symptoms = Number(inputs.symptoms_score) || 0;
    const emotions = Number(inputs.emotions_score) || 0;
    const functioning = Number(inputs.functioning_score) || 0;
    const averageScore = parseFloat(((symptoms + emotions + functioning) / 3).toFixed(1));

    const interpretation = `Skindex-29 Scores: Symptoms=${symptoms.toFixed(1)}, Emotions=${emotions.toFixed(1)}, Functioning=${functioning.toFixed(1)}. Overall Average=${averageScore}. Higher scores indicate worse quality of life.
Severity Cut-offs (example): Symptoms ≥52, Emotions ≥39, Functioning ≥37, Overall ≥44 indicate severely impaired HRQoL.`;
    return { score: averageScore, interpretation, details: { Symptoms_Domain: symptoms, Emotions_Domain: emotions, Functioning_Domain: functioning, Overall_Average_Score: averageScore } };
  },
  references: [
    "Archer S, Donoso FS, Carver T, et al. Exploring the Barriers to and Facilitators of Implementing CanRisk in Primary Care: A Qualitative Thematic Framework Analysis. The British Journal of General Practice : The Journal of the Royal College of General Practitioners. 2023;73(733):e586-e596.",
    "Pfaffenlehner M, Behrens M, Zöller D, et al. Methodological Challenges Using Routine Clinical Care Data for Real-World Evidence: A Rapid Review Utilizing a Systematic Literature Search and Focus Group Discussion. BMC Medical Research Methodology. 2025;25(1):8.",
    "Johnson E, Emani VK, Ren J. Breadth of Coverage, Ease of Use, and Quality of Mobile Point-of-Care Tool Information Summaries: An Evaluation. JMIR mHealth and uHealth. 2016;4(4):e117.",
    "Jayadevappa R, Cook R, Chhatre S. Minimal Important Difference to Infer Changes in Health-Related Quality Of life-a Systematic Review. Journal of Clinical Epidemiology. 2017;89:188-198.",
    "Sedaghat AR. Understanding the Minimal Clinically Important Difference (MCID) of Patient-Reported Outcome Measures. Otolaryngology--Head and Neck Surgery : Official Journal of American Academy of Otolaryngology-Head and Neck Surgery. 2019;161(4):551-560.",
    "Zhang Y, Xi X, Huang Y. The Anchor Design of Anchor-Based Method to Determine the Minimal Clinically Important Difference: A Systematic Review. Health and Quality of Life Outcomes. 2023;21(1):74.",
    "Mouelhi Y, Jouve E, Castelli C, Gentile S. How Is the Minimal Clinically Important Difference Established in Health-Related Quality of Life Instruments? Review of Anchors and Methods. Health and Quality of Life Outcomes. 2020;18(1):136.",
    "Both H, Essink-Bot ML, Busschbach J, Nijsten T. Critical Review of Generic and Dermatology-Specific Health-Related Quality of Life Instruments. The Journal of Investigative Dermatology. 2007;127(12):2726-39.",
    "Chren MM. The Skindex Instruments to Measure the Effects of Skin Disease on Quality of Life. Dermatologic Clinics. 2012;30(2):231-6, xiii.",
    "Nguyen HL, Bonadurer GF, Tollefson MM. Vascular Malformations and Health-Related Quality of Life: A Systematic Review and Meta-analysis. JAMA Dermatology. 2018;154(6):661-669.",
    "Chren MM, Lasek RJ, Quinn LM, Mostow EN, Zyzanski SJ. Skindex, a Quality-of-Life Measure for Patients With Skin Disease: Reliability, Validity, and Responsiveness. The Journal of Investigative Dermatology. 1996;107(5):707-13.",
    "Abeni D, Picardi A, Pasquini P, Melchi CF, Chren MM. Further Evidence of the Validity and Reliability of the Skindex-29: An Italian Study on 2,242 Dermatological Outpatients. Dermatology (Basel, Switzerland). 2002;204(1):43-9.",
    "De Korte J, Mombers FM, Sprangers MA, Bos JD. The Suitability of Quality-of-Life Questionnaires for Psoriasis Research: A Systematic Literature Review. Archives of Dermatology. 2002;138(9):1221-7; discussion 1227.",
    "Prinsen CA, Lindeboom R, Sprangers MA, Legierse CM, de Korte J. Health-Related Quality of Life Assessment in Dermatology: Interpretation of Skindex-29 Scores Using Patient-Based Anchors. The Journal of Investigative Dermatology. 2010;130(5):1318-22.",
    "Sampogna F, Spagnoli A, Di Pietro C, et al. Field Performance of the Skindex-17 Quality of Life Questionnaire: A Comparison With the Skindex-29 in a Large Sample of Dermatological Outpatients. The Journal of Investigative Dermatology. 2013;133(1):104-9.",
    "Pascual MG, Schmiege SJ, Manson SM, Kohn LL. Comparison of the Skindex-Teen and the Skindex-29 Quality of Life Survey Instruments in a Predominantly American Indian Adolescent Population. Pediatric Dermatology. 2024 Jul-Aug;41(4):606-612.",
    "Recinos PF, Dunphy CJ, Thompson N, et al. Patient Satisfaction With Collection of Patient-Reported Outcome Measures in Routine Care. Advances in Therapy. 2017;34(2):452-465."
  ]
};
