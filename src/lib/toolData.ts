import type { Tool } from './types';
import { Calculator, Stethoscope, ClipboardList, Users, FileText, Pill } from 'lucide-react';
import { z } from 'zod';

export const toolData: Tool[] = [
  {
    id: 'pasi-simplified',
    name: 'Simplified Psoriasis Area and Severity Index',
    acronym: 'PASI',
    description: 'A tool to assess the severity and extent of psoriasis by evaluating erythema, induration, desquamation, and area of involvement across four body regions. This is a simplified version for demonstration.',
    condition: 'Psoriasis',
    keywords: ['psoriasis', 'severity', 'skin', 'index', 'erythema', 'induration', 'desquamation'],
    sourceType: 'Research',
    icon: Stethoscope,
    inputs: [
      { id: 'head_erythema', label: 'Head: Erythema (Redness)', type: 'select', options: Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` })), defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'head_induration', label: 'Head: Induration (Thickness)', type: 'select', options: Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` })), defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'head_desquamation', label: 'Head: Desquamation (Scaling)', type: 'select', options: Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` })), defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'head_area', label: 'Head: Area Affected (%)', type: 'select', options: Array.from({ length: 7 }, (_, i) => ({ value: i, label: `${i} - ${['0%', '1-9%', '10-29%', '30-49%', '50-69%', '70-89%', '90-100%'][i]}` })), defaultValue: 0, validation: z.number().min(0).max(6) },
      // Simplified: only head for demo. Full PASI has Trunk, Upper, Lower limbs.
    ],
    calculationLogic: (inputs) => {
      const h_e = Number(inputs.head_erythema);
      const h_i = Number(inputs.head_induration);
      const h_d = Number(inputs.head_desquamation);
      const h_a = Number(inputs.head_area);

      const sumHead = (h_e + h_i + h_d) * h_a * 0.1; // 0.1 for head area weight
      // In a full PASI, sumTrunk * 0.3, sumUpper * 0.2, sumLower * 0.4 would be added.
      const score = sumHead; // Simplified total score

      let interpretation = '';
      if (score === 0) interpretation = 'No Psoriasis symptoms or Cleared.';
      else if (score < 3) interpretation = 'Mild Psoriasis.';
      else if (score < 7) interpretation = 'Moderate Psoriasis.';
      else interpretation = 'Severe Psoriasis.';
      
      return { score: parseFloat(score.toFixed(2)), interpretation, details: { 'Head Score Component': parseFloat(sumHead.toFixed(2)) } };
    },
    references: ["Fredriksson T, Pettersson U. Severe psoriasis--oral therapy with a new retinoid. Dermatologica. 1978;157(4):238-44."]
  },
  {
    id: 'dlqi',
    name: 'Dermatology Life Quality Index',
    acronym: 'DLQI',
    description: 'A 10-question questionnaire to measure the impact of skin disease on a person\'s quality of life.',
    condition: 'Various Skin Conditions',
    keywords: ['quality of life', 'skin disease', 'impact', 'DLQI', 'patient reported'],
    sourceType: 'Clinical Guideline',
    icon: ClipboardList,
    inputs: Array.from({ length: 10 }, (_, i) => ({
      id: `q${i + 1}`,
      label: `Question ${i + 1}: ${[
        "Over the last week, how itchy, sore, painful or stinging has your skin been?",
        "Over the last week, how embarrassed or self conscious have you been because of your skin?",
        "Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?",
        "Over the last week, how much has your skin influenced the clothes you wear?",
        "Over the last week, how much has your skin affected any social or leisure activities?",
        "Over the last week, how much has your skin made it difficult for you to do any sport?",
        "Over the last week, has your skin prevented you from working or studying? (If no, select N/A)",
        "Over the last week, how much has your skin created problems with your partner or any of your close friends or relatives?",
        "Over the last week, how much has your skin caused any sexual difficulties?",
        "Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?"
      ][i]}`,
      type: 'select',
      options: [
        { value: 3, label: 'Very much' },
        { value: 2, label: 'A lot' },
        { value: 1, label: 'A little' },
        { value: 0, label: 'Not at all' },
        ...(i === 6 ? [{ value: 0, label: 'Not relevant (N/A)' }] : []) // Question 7 has N/A option, scored as 0
      ],
      defaultValue: 0,
      validation: z.number().min(0).max(3),
    })),
    calculationLogic: (inputs) => {
      let score = 0;
      for (let i = 1; i <= 10; i++) {
        score += Number(inputs[`q${i}`]);
      }

      let interpretation = '';
      if (score >= 0 && score <= 1) interpretation = 'No effect at all on patient\'s life.';
      else if (score >= 2 && score <= 5) interpretation = 'Small effect on patient\'s life.';
      else if (score >= 6 && score <= 10) interpretation = 'Moderate effect on patient\'s life.';
      else if (score >= 11 && score <= 20) interpretation = 'Very large effect on patient\'s life.';
      else if (score >= 21 && score <= 30) interpretation = 'Extremely large effect on patient\'s life.';
      
      return { score, interpretation };
    },
    references: ["Finlay AY, Khan GK. Dermatology Life Quality Index (DLQI)--a simple practical measure for routine clinical use. Clin Exp Dermatol. 1994 May;19(3):210-6."]
  },
   {
    id: 'scqoli-10',
    name: 'Simplified Cutaneous QoL Index (SCQOLI-10)',
    acronym: 'SCQOLI-10',
    description: 'A 10-item questionnaire for assessing quality of life in patients with chronic skin diseases.',
    condition: 'Chronic Skin Diseases',
    keywords: ['quality of life', 'chronic skin disease', 'SCQOLI', 'patient reported'],
    sourceType: 'Expert Consensus',
    icon: Users,
    inputs: [
      { id: 'symptoms', label: 'Symptoms (itching, pain, discomfort)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'emotions', label: 'Emotions (sadness, anxiety, anger)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'daily_activities', label: 'Daily activities (work, household chores)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'sleep', label: 'Sleep', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'social_life', label: 'Social life and leisure', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'self_perception', label: 'Self-perception (feeling ashamed or embarrassed)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'relationships', label: 'Relationships with others', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'treatment_burden', label: 'Treatment burden (time, cost, side effects)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'concentration', label: 'Concentration and memory', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
      { id: 'energy_vitality', label: 'Energy and vitality', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: z.number().min(0).max(4) },
    ],
    calculationLogic: (inputs) => {
      const score = Object.values(inputs).reduce((sum: number, value) => sum + Number(value), 0);
      let interpretation = 'Interpretation based on total score (0-40): ';
      if (score <= 10) interpretation += 'Low impact on QoL.';
      else if (score <= 20) interpretation += 'Moderate impact on QoL.';
      else if (score <= 30) interpretation += 'High impact on QoL.';
      else interpretation += 'Very high impact on QoL.';
      return { score, interpretation };
    },
    references: ["Misery L, et al. Development and validation of a new tool for the global assessment of quality of life in patients with chronic skin disorders: the SCQOLI-10. J Eur Acad Dermatol Venereol. 2021."]
  }
];
