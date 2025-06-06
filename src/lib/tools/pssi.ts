
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { User } from 'lucide-react';
import { getValidationSchema, severityOptions0to4, areaOptions0to6 } from '../toolValidation';

export const pssiTool: Tool = {
  id: "pssi",
  name: "Psoriasis Scalp Severity Index (PSSI)",
  acronym: "PSSI",
  description: "Specifically assesses the severity of scalp psoriasis.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pssi", "psoriasis", "scalp psoriasis", "scalp", "severity", "psoriatic arthritis"],
  sourceType: 'Clinical Guideline',
  icon: User,
  formSections: [
    { id: "pssi_erythema", label: "Scalp Erythema (E)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
    { id: "pssi_thickness", label: "Scalp Thickness (T)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
    { id: "pssi_scaling", label: "Scalp Scaling (S)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
    { id: "pssi_area", label: "Scalp Area (A)", type: 'select', options: areaOptions0to6, defaultValue:0, description: "% scalp area.", validation: getValidationSchema('select', areaOptions0to6,0,6) }
  ],
  calculationLogic: (inputs) => {
      const E = Number(inputs.pssi_erythema) || 0;
      const T = Number(inputs.pssi_thickness) || 0;
      const S = Number(inputs.pssi_scaling) || 0;
      const A = Number(inputs.pssi_area) || 0;
      const score = (E + T + S) * A;
      const interpretation = `PSSI Score: ${score} (Range: 0-72). Higher score indicates more severe scalp psoriasis. (E:${E} + T:${T} + S:${S}) x A:${A}.`;
      return { score, interpretation, details: { Erythema: E, Thickness: T, Scaling: S, Area_Score: A } };
  },
  references: ["Ortonne JP, et al. J Eur Acad Dermatol Venereol. 2004;18(Suppl 2):28."]
};
