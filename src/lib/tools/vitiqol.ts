
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Users } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const vitiqolTool: Tool = {
  id: "vitiqol",
  name: "Vitiligo-specific Quality of Life (VitiQoL)",
  acronym: "VitiQoL",
  condition: "Quality of Life",
  keywords: ["vitiqol", "vitiligo", "quality of life", "patient reported"],
  description: "VitiQoL is a patient-reported outcome measure designed to assess the health-related quality of life (HRQoL) specifically in individuals with vitiligo. The purpose is to capture the unique psychosocial and functional impacts of vitiligo, which are often not adequately reflected by generic dermatology QoL instruments.",
  sourceType: 'Research',
  icon: Users,
  rationale: "The rationale is that vitiligo, while often asymptomatic, can have profound effects on self-esteem, social participation, and emotional well-being, necessitating a disease-specific tool. The original VitiQoL consists of 15 items, each scored on a 7-point Likert scale (0 = not at all, 6 = all the time), yielding a total score range of 0–90, with higher scores indicating greater impairment. Factor analysis has identified three domains (subscores): participation limitation, stigma, and behavior. Some language adaptations (e.g., Turkish) have modified the number of items and domains based on psychometric validation, but the core structure remains similar. The total score is the sum of all item scores, and subscores can be calculated for each domain by summing relevant items. VitiQoL was developed and validated by Lilly et al., with subsequent cross-cultural adaptations and validations in other populations.",
  clinicalPerformance: "The original validation study demonstrated high internal consistency (Cronbach’s alpha = 0.935), strong convergent validity with other dermatology-specific HRQoL instruments (Skindex-16, r = 0.82; DLQI, r = 0.83), and a clear factor structure. Known-groups validity was demonstrated for the VitiQoL behavior subscale between individuals with exposed and unexposed patches. However, the study did not assess test-retest reliability or responsiveness due to the prolonged time course necessary to observe clinically significant change in vitiligo. Subsequent studies in Brazil and Turkey have confirmed the VitiQoL's reliability, test-retest stability, and convergent validity in real-world outpatient populations. The Turkish adaptation (VitiQoL-TR) demonstrated excellent internal consistency (Cronbach’s alpha = 0.922), strong test-retest reliability (r = 0.883; ICC = 0.939), and strong convergent validity with Skindex-16 and moderate validity with DLQI. The VitiQoL has also been used in multinational, population-based studies, where higher scores were associated with greater disease extent, progression, and psychosocial burden. The VitiQoL has been validated in outpatient and cross-cultural studies, confirming its reliability and feasibility in routine practice for adults. In a Brazilian study, the VitiQoL was found to be easy to administer and provided important information about the impact of vitiligo, with stigma identified as a major contributor to quality-of-life impairment. The instrument has been used in large, multinational surveys to assess the relationship between disease characteristics and quality of life, further supporting its utility in real-world settings. As a patient-reported outcome measure, the VitiQoL is not designed for diagnostic sensitivity or specificity. Its clinical performance is evaluated in terms of internal consistency, test-retest reliability, convergent and known-groups validity, and responsiveness. While internal consistency and convergent validity are well established, data on responsiveness to clinical change are limited, and further research is needed to assess this property. There are no direct, tool-specific validation or comparative studies of the VitiQoL in pediatric populations. In studies assessing quality of life in both children and adults with vitiligo, the VitiQoL was used only in adults, while the Children’s Dermatology Life Quality Index (CDLQI) was employed for pediatric patients. The current consensus is that the VitiQoL is not validated for pediatric use, and the CDLQI remains the preferred instrument for assessing quality of life in children with vitiligo.",
  formSections: [
    {id:"total_score", label:"Total VitiQoL Score", type:'number', defaultValue:0, description:"Enter the sum of scores from the questionnaire items. Range depends on the version (e.g., 0-90 for 15 items scored 0-6).", validation:getValidationSchema('number')}
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.total_score)||0;
      const interpretation = `VitiQoL Score: ${score}. Higher score indicates worse quality of life. Refer to the specific VitiQoL version for detailed interpretation and range.`;
      return { score, interpretation, details: { score_source: "User-entered total score" } };
  },
  references: [
    "Lilly E, Lu PD, Borovicka JH, et al. Development and validation of a vitiligo-specific quality-of-life instrument (VitiQoL). J Am Acad Dermatol. 2013;69(1):e11-8. doi:10.1016/j.jaad.2012.01.038.",
    "Özkesici Kurt B, Sayılı U, Öcal Durmuş DÇ, et al. Validation of the Vitiligo-Specific Quality-of-Life Instrument (VitiQoL) for the Turkish Language: The VitiQoL-TR Study. Archives of Dermatological Research. 2025;317(1):478. doi:10.1007/s00403-025-03968-8.",
    "Catucci Boza J, Giongo N, Machado P, et al. Quality of Life Impairment in Children and Adults With Vitiligo: A Cross-Sectional Study Based on Dermatology-Specific and Disease-Specific Quality of Life Instruments. Dermatology (Basel, Switzerland). 2016;232(5):619-625. doi:10.1159/000448656.",
    "Bibeau K, Pandya AG, Ezzedine K, et al. Vitiligo Prevalence and Quality of Life Among Adults in Europe, Japan and the USA. Journal of the European Academy of Dermatology and Venereology : JEADV. 2022;36(10):1831-1844. doi:10.1111/jdv.18257."
  ]
};
