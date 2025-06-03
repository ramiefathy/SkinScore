
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { Presentation } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const skindex29Tool: Tool = {
  id: "skindex29",
  name: "Skindex-29",
  acronym: "Skindex-29",
  condition: "Quality of Life",
  keywords: ["skindex", "quality of life", "symptoms", "emotions", "functioning", "patient reported"],
  description: "A 29-item questionnaire assessing the effects of skin diseases on patients' quality of life, divided into three domains: Symptoms, Emotions, and Functioning. Scores are typically transformed to a 0-100 scale for each domain and overall.",
  sourceType: 'Research',
  icon: Presentation,
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
  references: ["Chren MM, Lasek RJ, Sahay AP, Sands LP. Measurement properties of Skindex-29: a quality-of-life measure for patients with skin disease. J Cutan Med Surg. 1997.", "Chren MM. The Skindex instruments to measure the effects of skin disease on quality of life. Dermatol Clin. 2012 Apr;30(2):231-6, xiii."]
};
