import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { MessageSquare } from 'lucide-react'; // Or another suitable icon like FileText
import { getValidationSchema } from '../toolValidation';

const poemQuestionOptions: InputOption[] = [
  { value: 0, label: "0 days (No days)" },
  { value: 1, label: "1-2 days" },
  { value: 2, label: "3-4 days" },
  { value: 3, label: "5-6 days" },
  { value: 4, label: "Every day (7 days)" }
];

const poemQuestions: { id: string; label: string }[] = [
  { id: "poem_q1_itch", label: "Over the last week, on how many days has your child's/your skin been itchy because of their/your eczema?" },
  { id: "poem_q2_sleep", label: "Over the last week, on how many nights has your child's/your sleep been disturbed because of their/your eczema?" },
  { id: "poem_q3_bleeding", label: "Over the last week, on how many days has your child's/your skin been bleeding because of their/your eczema?" },
  { id: "poem_q4_weeping", label: "Over the last week, on how many days has your child's/your skin been weeping (leaking fluid) because of their/your eczema?" },
  { id: "poem_q5_cracking", label: "Over the last week, on how many days has your child's/your skin been cracked because of their/your eczema?" },
  { id: "poem_q6_flaking", label: "Over the last week, on how many days has your child's/your skin been flaking or peeling off because of their/your eczema?" },
  { id: "poem_q7_dryness", label: "Over the last week, on how many days has your child's/your skin been dry or rough because of their/your eczema?" },
];

const poemFormSections: FormSectionConfig[] = poemQuestions.map(q => ({
  id: q.id,
  label: q.label,
  type: 'select',
  options: poemQuestionOptions,
  defaultValue: 0,
  validation: getValidationSchema('select', poemQuestionOptions, 0, 4)
} as InputConfig));

export const poemTool: Tool = {
  id: "poem",
  name: "Patient-Oriented Eczema Measure",
  acronym: "POEM",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["poem", "patient-reported", "eczema symptoms", "quality of life", "symptom frequency", "atopic dermatitis", "NICE", "HOME initiative"],
  description: "The POEM is a patient-reported outcome measure (PROM) that quantifies eczema severity from the patient’s perspective. POEM is a simple 7-question survey focusing on frequency of eczema symptoms (itch, sleep loss, bleeding, weeping, cracking, flaking, dryness) over the past week.",
  sourceType: 'Research',
  icon: MessageSquare,
  rationale: "The POEM consists of seven items, each addressing a core symptom: itching, sleep disturbance, bleeding, weeping/oozing, cracking, flaking, and dryness/roughness. Each item is scored from 0 (\"no days\") to 4 (\"every day\"), for a total score range of 0 to 28. Severity bands are defined as 0–7 (mild), 8–19 (moderate), and 20–28 (severe). A change of ≥3 points is considered the minimal clinically important difference (MCID).",
  clinicalPerformance: "The POEM has demonstrated good internal consistency (Cronbach's alpha = 0.86), construct validity, and responsiveness in both clinical trials and real-world practice. It correlates moderately to strongly with other patient-reported and clinician-reported measures, including the Dermatology Life Quality Index (DLQI), ItchyQOL, and Eczema Area and Severity Index (EASI). Test-retest reliability is good, and the POEM is feasible for use in both research and clinical settings, with a median completion time of 1 minute.\n\nValidation and Comparative Studies\nThe POEM has been validated in multiple populations and languages. Comparative studies have shown that the POEM has better measurement properties than the Patient-Oriented Scoring Atopic Dermatitis (PO-SCORAD) and is more strongly correlated with quality of life measures. The POEM is the preferred patient-reported outcome for assessing symptoms of atopic dermatitis.\n\nReal-World Implementation\nThe POEM is widely used due to its brevity, patient-centered focus, and strong psychometric properties. Barriers include limited awareness among some clinicians and a lack of integration into EHRs, while facilitators include its ease of use and alignment with patient-centered care.",
  formSections: poemFormSections,
  calculationLogic: (inputs) => {
    let totalScore = 0;
    const individualScores: Record<string, number> = {};

    poemQuestions.forEach(q => {
      const score = Number(inputs[q.id]) || 0;
      totalScore += score;
      individualScores[q.id] = score;
    });

    let severityCategory = "";
    if (totalScore <= 7) severityCategory = "Mild eczema";
    else if (totalScore <= 19) severityCategory = "Moderate eczema";
    else severityCategory = "Severe eczema";

    const interpretation = `Total POEM Score: ${totalScore} (Range: 0-28).\nSeverity Category: ${severityCategory}.\nHigher scores indicate more frequent or persistent symptoms. A change of 3 or more points is considered clinically meaningful (MCID).`;

    return {
      score: totalScore,
      interpretation,
      details: {
        Individual_Question_Scores: individualScores,
        Total_POEM_Score: totalScore,
        Severity_Category: severityCategory
      }
    };
  },
  references: [
    "Silverberg JI, Gelfand JM, Margolis DJ, et al. Severity Strata for POEM, PO-SCORAD, and DLQI in US Adults With Atopic Dermatitis. Annals of Allergy, Asthma & Immunology : Official Publication of the American College of Allergy, Asthma, & Immunology. 2018;121(4):464-468.e3. doi:10.1016/j.anai.2018.07.004.",
    "Howells L, Ratib S, Chalmers JR, Bradshaw L, Thomas KS. How Should Minimally Important Change Scores for the Patient-Oriented Eczema Measure Be Interpreted? A Validation Using Varied Methods. The British Journal of Dermatology. 2018;178(5):1135-1142. doi:10.1111/bjd.16367.",
    "Silverberg JI, Margolis DJ, Boguniewicz M, et al. Validation of Five Patient-Reported Outcomes for Atopic Dermatitis Severity in Adults. The British Journal of Dermatology. 2020;182(1):104-111. doi:10.1111/bjd.18002.",
    "Silverberg JI, Lei D, Yousaf M, et al. Comparison of Patient-Oriented Eczema Measure and Patient-Oriented Scoring Atopic Dermatitis vs Eczema Area and Severity Index and Other Measures of Atopic Dermatitis: A Validation Study. Annals of Allergy, Asthma & Immunology. 2020;125(1):78-83. doi:10.1016/j.anai.2020.03.006."
  ]
};
