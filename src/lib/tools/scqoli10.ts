
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Users } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const scqoli10Tool: Tool = {
  id: 'scqolit', // Renamed from scqoli-10 to match new focus
  name: 'Skin Cancer Quality of Life Impact Tool',
  acronym: 'SCQOLIT',
  description: 'The SCQOLI-10 is a 10-item patient-reported outcome measure designed to assess quality of life in individuals with non-melanoma skin cancer (NMSC), including basal cell carcinoma and squamous cell carcinoma. The rationale for its development was the recognition that NMSC, while rarely fatal, can cause significant morbidity and psychosocial burden, necessitating a disease-specific quality of life instrument. Each item is scored on a Likert scale, with the total score reflecting the overall impact of skin cancer on the patient’s quality of life. Higher scores indicate greater impairment.',
  condition: 'Non-Melanoma Skin Cancer',
  keywords: ['scqolit', 'quality of life', 'non-melanoma skin cancer', 'nmsc', 'basal cell carcinoma', 'squamous cell carcinoma', 'patient reported'],
  sourceType: 'Research',
  icon: Users,
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
    "Burdon-Jones D, Gibbons K. The Skin Cancer Quality of Life Impact Tool (SCQOLIT): A Validated Health-Related Quality of Life Questionnaire for Non-Metastatic Skin Cancers. Journal of the European Academy of Dermatology and Venereology : JEADV. 2013;27(9):1109-13. doi:10.1111/j.1468-3083.2012.04669.x.",
    "Jarratt Barnham I, Borsky K, Harrison C, et al. SCQOLIT-SF: A Revised Outcome Measure for Assessing Patient-Reported Outcomes in Non-Melanoma Skin Cancers. Journal of Plastic, Reconstructive & Aesthetic Surgery : JPRAS. 2025;102:159-166. doi:10.1016/j.bjps.2025.01.030.",
    "Wali GN, Gibbons E, Kelly L, Reed JR, Matin RN. Use of the Skin Cancer Quality of Life Impact Tool (SCQOLIT) - A Feasibility Study in Non-Melanoma Skin Cancer. Journal of the European Academy of Dermatology and Venereology : JEADV. 2020;34(3):491-501. doi:10.1111/jdv.15887.",
    "Peterson AM, Miller B, Ioerger P, et al. Most-Cited Patient-Reported Outcome Measures Within Otolaryngology—Revisiting the Minimal Clinically Important Difference: A Review. JAMA Otolaryngology-- Head & Neck Surgery. 2023;149(3):261-276. doi:10.1001/jamaoto.2022.4703.",
    "Jayadevappa R, Cook R, Chhatre S. Minimal Important Difference to Infer Changes in Health-Related Quality Of life-a Systematic Review. Journal of Clinical Epidemiology. 2017;89:188-198. doi:10.1016/j.jclinepi.2017.06.009.",
    "Sedaghat AR. Understanding the Minimal Clinically Important Difference (MCID) of Patient-Reported Outcome Measures. Otolaryngology--Head and Neck Surgery : Official Journal of American Academy of Otolaryngology-Head and Neck Surgery. 2019;161(4):551-560. doi:10.1177/0194599819852604.",
    "Chernyshov PV, Lallas A, Tomas-Aragones L, et al. Quality of Life Measurement in Skin Cancer Patients: Literature Review and Position Paper of the European Academy of Dermatology and Venereology Task Forces on Quality of Life and Patient Oriented Outcomes, Melanoma and Non-Melanoma Skin Cancer. Journal of the European Academy of Dermatology and Venereology : JEADV. 2019;33(5):816-827. doi:10.1111/jdv.15487.",
    "Gibbons E, Casañas i Comabella C, Fitzpatrick R. A Structured Review of Patient-Reported Outcome Measures for Patients With Skin Cancer, 2013. The British Journal of Dermatology. 2013;168(6):1176-86. doi:10.1111/bjd.12310.",
    "Bull C, Teede H, Watson D, Callander EJ. Selecting and Implementing Patient-Reported Outcome and Experience Measures to Assess Health System Performance. JAMA Health Forum. 2022;3(4):e220326. doi:10.1001/jamahealthforum.2022.0326.",
    "Bowden A, Fox-Rushby JA. A Systematic and Critical Review of the Process of Translation and Adaptation of Generic Health-Related Quality of Life Measures in Africa, Asia, Eastern Europe, the Middle East, South America. Social Science & Medicine (1982). 2003;57(7):1289-306. doi:10.1016/s0277-9536(02)00503-8."
  ]
};
