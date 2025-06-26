
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

    const interpretation = `Skindex-29 Scores: Symptoms=${symptoms.toFixed(1)}, Emotions=${emotions.toFixed(1)}, Functioning=${functioning.toFixed(1)}. Overall Average=${averageScore}. Higher scores indicate worse quality of life. Each domain and the average score range from 0 to 100.`;
    return { score: averageScore, interpretation, details: { Symptoms_Domain: symptoms, Emotions_Domain: emotions, Functioning_Domain: functioning, Overall_Average_Score: averageScore } };
  },
  references: [
    "Chren MM, Lasek RJ, Quinn LM, Mostow EN, Zyzanski SJ. Skindex, a Quality-of-Life Measure for Patients With Skin Disease: Reliability, Validity, and Responsiveness. The Journal of Investigative Dermatology. 1996;107(5):707-13. doi:10.1111/1523-1747.ep12365600.",
    "Abeni D, Picardi A, Pasquini P, Melchi CF, Chren MM. Further Evidence of the Validity and Reliability of the Skindex-29: An Italian Study on 2,242 Dermatological Outpatients. Dermatology (Basel, Switzerland). 2002;204(1):43-9. doi:10.1159/000051809.",
    "Both H, Essink-Bot ML, Busschbach J, Nijsten T. Critical Review of Generic and Dermatology-Specific Health-Related Quality of Life Instruments. The Journal of Investigative Dermatology. 2007;127(12):2726-39. doi:10.1038/sj.jid.5701142.",
    "Chren MM. The Skindex Instruments to Measure the Effects of Skin Disease on Quality of Life. Dermatologic Clinics. 2012;30(2):231-6, xiii. doi:10.1016/j.det.2011.11.003.",
    "Nguyen HL, Bonadurer GF, Tollefson MM. Vascular Malformations and Health-Related Quality of Life: A Systematic Review and Meta-analysis. JAMA Dermatology. 2018;154(6):661-669. doi:10.1001/jamadermatol.2018.0002.",
    "De Korte J, Mombers FM, Sprangers MA, Bos JD. The Suitability of Quality-of-Life Questionnaires for Psoriasis Research: A Systematic Literature Review. Archives of Dermatology. 2002;138(9):1221-7; discussion 1227. doi:10.1001/archderm.138.9.1221.",
    "Prinsen CA, Lindeboom R, Sprangers MA, Legierse CM, de Korte J. Health-Related Quality of Life Assessment in Dermatology: Interpretation of Skindex-29 Scores Using Patient-Based Anchors. The Journal of Investigative Dermatology. 2010;130(5):1318-22. doi:10.1038/jid.2009.404.",
    "Sampogna F, Spagnoli A, Di Pietro C, et al. Field Performance of the Skindex-17 Quality of Life Questionnaire: A Comparison With the Skindex-29 in a Large Sample of Dermatological Outpatients. The Journal of Investigative Dermatology. 2013;133(1):104-9. doi:10.1038/jid.2012.244.",
    "Pascual MG, Schmiege SJ, Manson SM, Kohn LL. Comparison of the Skindex-Teen and the Skindex-29 Quality of Life Survey Instruments in a Predominantly American Indian Adolescent Population. Pediatric Dermatology. 2024 Jul-Aug;41(4):606-612. doi:10.1111/pde.15592.",
    "Recinos PF, Dunphy CJ, Thompson N, et al. Patient Satisfaction With Collection of Patient-Reported Outcome Measures in Routine Care. Advances in Therapy. 2017;34(2):452-465. doi:10.1007/s12325-016-0463-x."
  ]
};
