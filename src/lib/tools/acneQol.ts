
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { MessageSquare } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const acneQolTool: Tool = {
  id: "acneqol",
  name: "Acne-Specific Quality of Life Questionnaire",
  acronym: "Acne-QoL",
  condition: "Quality of Life",
  keywords: ["acneqol", "acne", "quality of life", "patient reported", "self-perception", "emotional impact", "social functioning", "acne symptoms"],
  description: "The Acne-QoL is a disease-specific HRQoL instrument developed to assess the impact of facial acne on adult patients. It consists of 19 items across four domains: self-perception, role-social, role-emotional, and acne symptoms. Each item is scored 0 to 6, with higher scores indicating better quality of life. The total score ranges from 0 to 114.",
  sourceType: 'Research',
  icon: MessageSquare,
  rationale: "The Acne-QoL is a disease-specific HRQoL instrument developed to assess the impact of facial acne on adult patients. It was designed to capture the unique psychosocial and functional impairments associated with acne, which may not be adequately measured by generic or dermatology-specific tools. The Acne-QoL consists of 19 items, each scored on a 7-point Likert scale (0 to 6), with higher scores indicating better quality of life. The instrument is divided into four domains: self-perception (7 items), role-social (5 items), role-emotional (5 items), and acne symptoms (2 items). Each domain score is calculated by summing the scores of the items within that domain, and the total score is the sum of all domain scores, with a possible range of 0 to 114. The Acne-QoL was developed and validated using classical test theory, with subsequent systematic reviews confirming its foundational status and widespread validation in both adolescents and adults. The instrument has been used in multiple countries and languages, with evidence supporting its reliability and validity.",
  clinicalPerformance: "The Acne-QoL demonstrates high internal consistency, with Cronbach’s alpha values for the total score and subscales typically exceeding 0.85, and ranging from 0.74 to 0.96 for various subdomains. Test-retest reliability is also high, with ICCs between 0.88 and 0.97 over a 24-hour interval in real-world studies. The Acne-QoL is not designed as a diagnostic tool, so sensitivity, specificity, and AUC are not typically reported. Systematic reviews have confirmed the Acne-QoL’s strong psychometric properties, including sufficient internal consistency, construct validity, and responsiveness. Comparative studies indicate that the Acne-QoL performs well relative to other acne-specific and dermatology-specific instruments, though no single PROM has demonstrated clear superiority in all domains. The Acne-QoL’s domain structure may not reflect all patient experiences, and cross-cultural validation is less extensive than for the DLQI or CDLQI. Some studies have noted floor effects in certain subdomains, and qualitative research has highlighted variability in patient perceptions of the instrument’s relevance and acceptability.",
  formSections: [
    {
      id:"self_perception_score",
      label: "Self-Perception Domain Score (0-42)",
      type:'number', min:0, max:42, defaultValue:0,
      description:"Enter the sum of scores for the 7 items in the Self-Perception domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 42)
    },
    {
      id:"role_social_score",
      label: "Role-Social Domain Score (0-30)",
      type:'number', min:0, max:30, defaultValue:0,
      description:"Enter the sum of scores for the 5 items in the Role-Social domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 30)
    },
    {
      id:"role_emotional_score",
      label: "Role-Emotional Domain Score (0-30)",
      type:'number', min:0, max:30, defaultValue:0,
      description:"Enter the sum of scores for the 5 items in the Role-Emotional domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 30)
    },
    {
      id:"acne_symptoms_score",
      label: "Acne Symptoms Domain Score (0-12)",
      type:'number', min:0, max:12, defaultValue:0,
      description:"Enter the sum of scores for the 2 items in the Acne Symptoms domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 12)
    }
  ],
  calculationLogic: (inputs) => {
      const selfPerceptionScore = Number(inputs.self_perception_score)||0;
      const roleSocialScore = Number(inputs.role_social_score)||0;
      const roleEmotionalScore = Number(inputs.role_emotional_score)||0;
      const acneSymptomsScore = Number(inputs.acne_symptoms_score)||0;
      const totalScore = selfPerceptionScore + roleSocialScore + roleEmotionalScore + acneSymptomsScore;

      let interpretation = `Acne-QoL Scores:
Self-Perception: ${selfPerceptionScore}/42
Role-Social: ${roleSocialScore}/30
Role-Emotional: ${roleEmotionalScore}/30
Acne Symptoms: ${acneSymptomsScore}/12
Total Score: ${totalScore}/114.
Higher scores indicate better Quality of Life (less impact from acne).`;

      return {
        score: totalScore,
        interpretation,
        details: {
          Self_Perception_Score: selfPerceptionScore,
          Role_Social_Score: roleSocialScore,
          Role_Emotional_Score: roleEmotionalScore,
          Acne_Symptoms_Score: acneSymptomsScore,
          Total_Acne_QoL_Score: totalScore
        }
      };
  },
  references: [
    "Kunesh J, Banna J, Greene A, Hartmark-Hill J. Assessing Top Quality of Life Measures in Acne Vulgaris Studies: A Crucial Dimension in Patient-Centric Care. Archives of Dermatological Research. 2024;316(9):623. doi:10.1007/s00403-024-03370-w.",
    "Chernyshov PV, Zouboulis CC, Tomas-Aragones L, et al. Quality of Life Measurement in Acne. Position Paper of the European Academy of Dermatology and Venereology Task Forces on Quality of Life and Patient Oriented Outcomes and Acne, Rosacea and Hidradenitis Suppurativa. Journal of the European Academy of Dermatology and Venereology : JEADV. 2018;32(2):194-208. doi:10.1111/jdv.14585.",
    "Hopkins ZH, Thiboutot D, Homsi HA, Perez-Chada LM, Barbieri JS. Patient-Reported Outcome Measures for Health-Related Quality of Life in Patients With Acne Vulgaris: A Systematic Review of Measure Development and Measurement Properties. JAMA Dermatology. 2022;158(8):900-911. doi:10.1001/jamadermatol.2022.2260.",
    "Hornsey S, Stuart B, Muller I, et al. Patient-Reported Outcome Measures for Acne: A Mixed-Methods Validation Study (Acne PROMs). BMJ Open. 2021;11(3):e034047. doi:10.1136/bmjopen-2019-034047."
  ]
};
