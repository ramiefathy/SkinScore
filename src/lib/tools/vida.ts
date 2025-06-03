
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const vidaActivityOptions: InputOption[] = [
  {value:4, label:"+4 (Active for ≤6 weeks: new lesions and/or spread of existing lesions)"},
  {value:3, label:"+3 (Active for 6 weeks to 3 months)"},
  {value:2, label:"+2 (Active for 3 to 6 months)"},
  {value:1, label:"+1 (Active for 6 to 12 months)"},
  {value:0, label:"0 (Stable for ≥1 year: no new lesions, no spread, no repigmentation)"},
  {value:-1, label:"-1 (Regressive for ≥1 year: spontaneous repigmentation, no new lesions, no spread)"}
];

export const vidaTool: Tool = {
  id: "vida",
  name: "Vitiligo Disease Activity (VIDA) Score",
  acronym: "VIDA",
  condition: "Vitiligo",
  keywords: ["vida", "vitiligo", "activity", "patient reported"],
  description: "Assesses current vitiligo activity based on patient's perception of new lesions, existing lesion spread, or repigmentation over specific timeframes.",
  sourceType: 'Research',
  icon: Activity,
  formSections: [
    { id:"activity_status", label:"Current Vitiligo Activity Status", type:"select",
      options: vidaActivityOptions,
      defaultValue:0, validation:getValidationSchema('select',vidaActivityOptions,-1,4)
    }
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.activity_status);
      const scoreLabel = vidaActivityOptions.find(opt => opt.value === score)?.label || "Invalid score";

      let interpretation = `VIDA Score: ${score < 0 ? '' : '+'}${score}. (${scoreLabel}). `;
      if (score > 0) interpretation += "Indicates active disease.";
      else if (score === 0) interpretation += "Indicates stable disease.";
      else interpretation += "Indicates regressive disease with spontaneous repigmentation.";
      return { score, interpretation, details: { vida_description: scoreLabel } };
  },
  references: ["Njoo MD, Spuls PI, Bos JD, Westerhof W, Bossuyt PM. Nonsurgical repigmentation therapies in vitiligo. Meta-analysis of the literature. Arch Dermatol. 1998;134(12):1532-1540.", "Original description: Njoo MD, Das PK, Bos JD, Westerhof W. Association of the Koebner phenomenon with disease activity and therapeutic responsiveness in vitiligo. Arch Dermatol. 2000;136(3):414-5." ]
};
