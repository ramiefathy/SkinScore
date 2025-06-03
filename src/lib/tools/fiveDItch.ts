
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Puzzle } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const fiveDItchOptions: InputOption[] = [{value:1, label:"1"}, {value:2, label:"2"}, {value:3, label:"3"}, {value:4, label:"4"}, {value:5, label:"5"}];

export const fiveDItchTool: Tool = {
  id: "five_d_itch",
  name: "5-D Itch Scale",
  acronym: "5-D Itch",
  condition: "Pruritus",
  keywords: ["5d itch", "pruritus", "itch", "multidimensional", "patient reported"],
  description: "A multidimensional patient-reported outcome measure for chronic pruritus, assessing Duration, Degree, Direction, Disability, and Distribution.",
  sourceType: 'Research',
  icon: Puzzle,
  formSections: [
    { id: "d1_duration", label: "Domain 1: Duration (Total hours itching per day)", type: 'select', options: [{value:1, label:"1 (<1 hr)"}, {value:2, label:"2 (1-3 hrs)"}, {value:3, label:"3 (4-6 hrs)"}, {value:4, label:"4 (7-12 hrs)"}, {value:5, label:"5 (>12 hrs)"}], defaultValue:1, validation: getValidationSchema('select',fiveDItchOptions,1,5)},
    { id: "d2_degree", label: "Domain 2: Degree (Severity of worst itch episode)", type: 'select', options: [{value:1, label:"1 (Mild)"}, {value:2, label:"2 (Mild-Moderate)"}, {value:3, label:"3 (Moderate)"}, {value:4, label:"4 (Moderate-Severe)"}, {value:5, label:"5 (Severe)"}], defaultValue:1, validation: getValidationSchema('select',fiveDItchOptions,1,5)},
    { id: "d3_direction", label: "Domain 3: Direction (Itch getting better or worse over past month)", type: 'select', options: [{value:1, label:"1 (Much better)"}, {value:2, label:"2 (Somewhat better)"}, {value:3, label:"3 (No change)"}, {value:4, label:"4 (Somewhat worse)"}, {value:5, label:"5 (Much worse)"}], defaultValue:3, validation: getValidationSchema('select',fiveDItchOptions,1,5)},
    { id: "d4_disability", label: "Domain 4: Disability (Impact on QoL - sleep, mood, activities)", type: 'select', options: [{value:1, label:"1 (Not at all)"}, {value:2, label:"2 (A little)"}, {value:3, label:"3 (Moderately)"}, {value:4, label:"4 (A lot)"}, {value:5, label:"5 (Very much)"}], defaultValue:1, validation: getValidationSchema('select',fiveDItchOptions,1,5)},
    { id: "d5_distribution", label: "Domain 5: Distribution (Body parts affected)", type: 'select', options: [{value:1, label:"1 (1-2 parts)"}, {value:2, label:"2 (3-5 parts)"}, {value:3, label:"3 (6-10 parts)"}, {value:4, label:"4 (11-18 parts)"}, {value:5, label:"5 (All over/Almost all over)"}], defaultValue:1, validation: getValidationSchema('select',fiveDItchOptions,1,5)},
  ],
  calculationLogic: (inputs) => {
    const d1 = Number(inputs.d1_duration) || 1;
    const d2 = Number(inputs.d2_degree) || 1;
    const d3 = Number(inputs.d3_direction) || 1;
    const d4 = Number(inputs.d4_disability) || 1;
    const d5 = Number(inputs.d5_distribution) || 1;
    const totalScore = d1 + d2 + d3 + d4 + d5;

    const interpretation = `5-D Itch Scale Total Score: ${totalScore} (Range: 5-25). Higher score indicates more severe and impactful pruritus. No universally defined severity bands, used to track change.`;
    return { score: totalScore, interpretation, details: { D1_Duration_Score: d1, D2_Degree_Score: d2, D3_Direction_Score: d3, D4_Disability_Score: d4, D5_Distribution_Score: d5 } };
  },
  references: ["Elman S, Hynan LS, Gabriel V, Mayo MJ. The 5-D Itch Scale: a new measure of pruritus. Br J Dermatol. 2010 Mar;162(3):587-93."]
};
