
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const scqoli10Tool: Tool = {
  id: 'scqolit',
  name: 'Skin Cancer Quality of Life Impact Tool',
  acronym: 'SCQOLIT',
  description: 'The SCQOLI-10 is a 10-item patient-reported outcome measure designed to assess quality of life in individuals with non-melanoma skin cancer (NMSC), including basal cell carcinoma and squamous cell carcinoma.',
  condition: 'Non-Melanoma Skin Cancer',
  keywords: ['scqolit', 'quality of life', 'non-melanoma skin cancer', 'nmsc', 'basal cell carcinoma', 'squamous cell carcinoma', 'patient reported'],
  sourceType: 'Research',
  icon: Users,
  rationale: "The rationale for its development was the recognition that NMSC, while rarely fatal, can cause significant morbidity and psychosocial burden, necessitating a disease-specific quality of life instrument. Each item is scored on a Likert scale, with the total score reflecting the overall impact of skin cancer on the patient’s quality of life. Higher scores indicate greater impairment.",
  clinicalPerformance: "The SCQOLI-10 has demonstrated good internal consistency (Cronbach’s alpha 0.84) and validity in NMSC populations. It is sensitive to changes over time, with scores decreasing after treatment, and is feasible for use in routine dermatology clinics. Recent psychometric analyses using factor analysis and Rasch Measurement Theory have led to the development of a short-form version (SCQOLIT-SF), which maintains unidimensionality and improves interpretability through continuous Rasch scoring. The tool is acceptable to patients and clinicians, facilitates communication, and helps express patient needs. However, there is a negative skew in item responses, suggesting the tool may be more relevant for patients with significant disease burden. There is no published MCID for SCQOLI-10, limiting interpretation of meaningful change.",
  formSections: [
    {
      id: "total_score",
      label: "Total SCQOLIT Score",
      type: 'number',
      min: 0,
      defaultValue: 0,
      description: "Enter the calculated total score from the 10-item questionnaire. Higher scores indicate greater impairment of quality of life.",
      validation: getValidationSchema('number', [], 0)
    }
  ],
  calculationLogic: (inputs) => {
    const score = Number(inputs.total_score) || 0;
    let interpretation = `SCQOLIT Score: ${score}. Higher scores indicate worse quality of life. No validated Minimal Clinically Important Difference (MCID) exists for SCQOLI-10, limiting interpretation of meaningful change.`;
    return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: [
    "Bull C, Teede H, Watson D, Callander EJ. Selecting and Implementing Patient-Reported Outcome and Experience Measures to Assess Health System Performance. JAMA Health Forum. 2022;3(4):e220326.",
    "Peterson AM, Miller B, Ioerger P, et al. Most-Cited Patient-Reported Outcome Measures Within Otolaryngology—Revisiting the Minimal Clinically Important Difference: A Review. JAMA Otolaryngology-- Head & Neck Surgery. 2023;149(3):261-276.",
    "Jayadevappa R, Cook R, Chhatre S. Minimal Important Difference to Infer Changes in Health-Related Quality Of life-a Systematic Review. Journal of Clinical Epidemiology. 2017;89:188-198.",
    "Burdon-Jones D, Gibbons K. The Skin Cancer Quality of Life Impact Tool (SCQOLIT): A Validated Health-Related Quality of Life Questionnaire for Non-Metastatic Skin Cancers. Journal of the European Academy of Dermatology and Venereology : JEADV. 2013;27(9):1109-13.",
    "Jarratt Barnham I, Borsky K, Harrison C, et al. SCQOLIT-SF: A Revised Outcome Measure for Assessing Patient-Reported Outcomes in Non-Melanoma Skin Cancers. Journal of Plastic, Reconstructive & Aesthetic Surgery : JPRAS. 2025;102:159-166.",
    "Wali GN, Gibbons E, Kelly L, Reed JR, Matin RN. Use of the Skin Cancer Quality of Life Impact Tool (SCQOLIT) - A Feasibility Study in Non-Melanoma Skin Cancer. Journal of the European Academy of Dermatology and Venereology : JEADV. 2020;34(3):491-501.",
    "Sedaghat AR. Understanding the Minimal Clinically Important Difference (MCID) of Patient-Reported Outcome Measures. Otolaryngology--Head and Neck Surgery : Official Journal of American Academy of Otolaryngology-Head and Neck Surgery. 2019;161(4):551-560.",
    "Zhang Y, Xi X, Huang Y. The Anchor Design of Anchor-Based Method to Determine the Minimal Clinically Important Difference: A Systematic Review. Health and Quality of Life Outcomes. 2023;21(1):74.",
    "Mouelhi Y, Jouve E, Castelli C, Gentile S. How Is the Minimal Clinically Important Difference Established in Health-Related Quality of Life Instruments? Review of Anchors and Methods. Health and Quality of Life Outcomes. 2020;18(1):136.",
    "Chernyshov PV, Lallas A, Tomas-Aragones L, et al. Quality of Life Measurement in Skin Cancer Patients: Literature Review and Position Paper of the European Academy of Dermatology and Venereology Task Forces on Quality of Life and Patient Oriented Outcomes, Melanoma and Non-Melanoma Skin Cancer. Journal of the European Academy of Dermatology and Venereology : JEADV. 2019;33(5):816-827.",
    "Gibbons E, Casañas i Comabella C, Fitzpatrick R. A Structured Review of Patient-Reported Outcome Measures for Patients With Skin Cancer, 2013. The British Journal of Dermatology. 2013;168(6):1176-86.",
    "Nyongesa V, Kathono J, Mwaniga S, et al. Cultural and Contextual Adaptation of Mental Health Measures in Kenya: An Adolescent-Centered Transcultural Adaptation of Measures Study. PloS One. 2022;17(12):e0277619."
  ]
};
