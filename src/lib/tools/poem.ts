
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
  description: "A patient-reported outcome measure (PROM) that quantifies eczema severity from the patient’s perspective. POEM is a simple 7-question survey focusing on frequency of eczema symptoms (itch, sleep loss, bleeding, weeping, cracking, flaking, dryness) over the past week.",
  sourceType: 'Research',
  icon: MessageSquare,
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
    if (totalScore <= 2) severityCategory = "Clear or almost clear eczema";
    else if (totalScore <= 7) severityCategory = "Mild eczema";
    else if (totalScore <= 16) severityCategory = "Moderate eczema";
    else if (totalScore <= 24) severityCategory = "Severe eczema";
    else severityCategory = "Very severe eczema";

    const interpretation = `Total POEM Score: ${totalScore} (Range: 0-28).\nSeverity Category: ${severityCategory}.\nHigher scores indicate more frequent or persistent symptoms.`;

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
    "Charman CR, Venn AJ, Williams HC. The patient-oriented eczema measure: development and initial validation of a new tool for measuring eczema severity from the patients' perspective. Arch Dermatol. 2004;140(12):1513-1519.",
    "Spuls PI, Gerbens LAA, Simpson E, et al. POEM, a core instrument to measure symptoms in routine clinical practice: a HOME statement. Br J Dermatol. 2017;176(3):679-685.",
    "NICE guidelines on Atopic Eczema in under 12s (CG57) recommend POEM for monitoring."
  ]
};
