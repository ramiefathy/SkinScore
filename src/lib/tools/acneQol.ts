
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { MessageSquare } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

// Max scores for domains: Self-Perception 30 (5 items * 6), Role-Social 24 (4 items * 6),
// Role-Emotional 30 (5 items * 6), Acne Symptoms 30 (5 items * 6)
// Total 19 items, Max score 114.

export const acneQolTool: Tool = {
  id: "acneqol",
  name: "Acne-Specific Quality of Life (Acne-QoL)",
  acronym: "Acne-QoL",
  condition: "Quality of Life",
  keywords: ["acneqol", "acne", "quality of life", "patient reported", "self-perception", "emotional impact", "social functioning", "acne symptoms"],
  description: "A 19-item questionnaire measuring how facial acne affects patients’ quality of life across four domains: Self-Perception (max 30), Role-Social (max 24), Role-Emotional (max 30), and Acne Symptoms (max 30). Each item is scored 0 (e.g., 'not at all affected') to 6 (e.g., 'extremely affected'). Higher scores indicate better QoL (less impact). Total score ranges from 0 to 114.",
  sourceType: 'Research',
  icon: MessageSquare,
  formSections: [
    {
      id:"self_perception_score",
      label: "Self-Perception Domain Score (0-30)",
      type:'number', min:0, max:30, defaultValue:0,
      description:"Enter the sum of scores for the 5 items in the Self-Perception domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 30)
    },
    {
      id:"role_social_score",
      label: "Role-Social Domain Score (0-24)",
      type:'number', min:0, max:24, defaultValue:0,
      description:"Enter the sum of scores for the 4 items in the Role-Social domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 24)
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
      label: "Acne Symptoms Domain Score (0-30)",
      type:'number', min:0, max:30, defaultValue:0,
      description:"Enter the sum of scores for the 5 items in the Acne Symptoms domain (each item 0-6). Higher is better QoL.",
      validation: getValidationSchema('number', [], 0, 30)
    }
  ],
  calculationLogic: (inputs) => {
      const selfPerceptionScore = Number(inputs.self_perception_score)||0;
      const roleSocialScore = Number(inputs.role_social_score)||0;
      const roleEmotionalScore = Number(inputs.role_emotional_score)||0;
      const acneSymptomsScore = Number(inputs.acne_symptoms_score)||0;
      const totalScore = selfPerceptionScore + roleSocialScore + roleEmotionalScore + acneSymptomsScore;

      let interpretation = `Acne-QoL Scores:
Self-Perception: ${selfPerceptionScore}/30
Role-Social: ${roleSocialScore}/24
Role-Emotional: ${roleEmotionalScore}/30
Acne Symptoms: ${acneSymptomsScore}/30
Total Score: ${totalScore}/114.
Higher scores indicate better Quality of Life (less impact from acne).
Example interpretation bands for Total Score (0-114):
0-30: Extremely large negative effect on QoL.
31-60: Moderate negative effect.
61-90: Small negative effect.
>90: No or minimal negative effect (nearly normal QoL).
A change of ~10-12 points total is often considered clinically important.`;

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
      "Girman CJ, Hartmaier S, Thiboutot D, et al. Development of a new measure for evaluating the impact of acne on quality of life: The Acne-QoL. Psychopharmacol Bull. 1996;32(3):503-9.",
      "Fehnel SE, McLeod LD, Brandman J, et al. Responsiveness of the Acne-Specific Quality of Life Questionnaire (Acne-QoL) to treatment for acne vulgaris in a placebo-controlled clinical trial. Qual Life Res. 2002;11(8):809-816.",
      "Dreno B, et al. Impact of adapalene 0.1% gel plus clindamycin 1% solution versus adapalene 0.1% gel on the quality of life of patients with acne vulgaris. J Eur Acad Dermatol Venereol. 2003;17(2):171-6.",
      "McLeod LD, et al. Further development and validation of the Acne-Specific Quality of Life (Acne-QoL) instrument. J Dermatolog Treat. 2003;14(3):137-44.",
      "Salek MS, et al. Acne-specific quality of life questionnaire (Acne-QoL©): a new tool for the assessment of the psychosocial impact of acne. Br J Dermatol. 2013 Nov;169(5):1000-7. (This seems to be a review or later validation, the original is earlier)."
    ]
};

    