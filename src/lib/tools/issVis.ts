
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ScalingIcon } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const issVisTool: Tool = {
  id: "iss_vis",
  name: "Ichthyosis Severity Score (ISS) / Visual Index for Ichthyosis Severity (VIS)",
  acronym: "ISS/VIS",
  condition: "Ichthyosis",
  keywords: ["ichthyosis", "severity score", "iss", "vis", "scaling", "erythema"],
  description: "Assesses overall ichthyosis severity. Specific components and scoring can vary (e.g., Yale VIS-ISS, Gånemo ISS). This tool accepts a pre-calculated total score.",
  sourceType: 'Clinical Guideline',
  icon: ScalingIcon,
  formSections: [
    { id: "total_iss_vis_score", label: "Total ISS/VIS Score", type: 'number', min:0, defaultValue: 0, description: "Enter the pre-calculated total score from the specific ISS/VIS version used.", validation: getValidationSchema('number',[],0) }
  ],
  calculationLogic: (inputs) => {
    const score = Number(inputs.total_iss_vis_score) || 0;
    const interpretation = `ISS/VIS Score: ${score}. Higher score indicates more severe ichthyosis. Interpretation and range depend on the specific version of the ISS/VIS used.`;
    return {
      score,
      interpretation,
      details: {
        User_Entered_Score: score
      }
    };
  },
  references: ["Gånemo A, et al. Severity assessment in ichthyoses: a validation study. Acta Derm Venereol. 2003.", "Milstone LM, et al. The Visual Index for Ichthyosis Severity (VIIS): a validatedỀinstrument for use in ichthyosis clinical trials. Br J Dermatol. 2020 (describes VIIS which is related)."]
};
