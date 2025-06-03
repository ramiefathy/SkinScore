
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Users } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scqoli10Options: InputOption[] = [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}];

const scqoli10FormSections: FormSectionConfig[] = [
  { id: 'symptoms', label: 'Symptoms (itching, pain, discomfort)', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'emotions', label: 'Emotions (sadness, anxiety, anger)', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'daily_activities', label: 'Daily activities (work, household chores)', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'sleep', label: 'Sleep', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'social_life', label: 'Social life and leisure', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'self_perception', label: 'Self-perception (feeling ashamed or embarrassed)', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'relationships', label: 'Relationships with others', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'treatment_burden', label: 'Treatment burden (time, cost, side effects)', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'concentration', label: 'Concentration and memory', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
  { id: 'energy_vitality', label: 'Energy and vitality', type: 'select', options: scqoli10Options, defaultValue: 0, validation: getValidationSchema('select', scqoli10Options, 0, 4) },
];

export const scqoli10Tool: Tool = {
  id: 'scqoli-10',
  name: 'Simplified Cutaneous QoL Index (SCQOLI-10)',
  acronym: 'SCQOLI-10',
  description: 'A 10-item questionnaire for assessing quality of life in patients with chronic skin diseases.',
  condition: 'Quality of Life',
  keywords: ['scqoli-10', 'quality of life', 'chronic skin disease', 'patient reported'],
  sourceType: 'Expert Consensus',
  icon: Users,
  formSections: scqoli10FormSections,
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
};
