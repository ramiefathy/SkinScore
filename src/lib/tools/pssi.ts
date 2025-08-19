import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { User } from 'lucide-react';
import { getValidationSchema, severityOptions0to4, areaOptions0to6 } from '../toolValidation';

export const pssiTool: Tool = {
  id: "pssi",
  name: "Psoriasis Scalp Severity Index (PSSI)",
  acronym: "PSSI",
  description: "The PSSI was developed as a modification of the PASI to specifically assess the severity of scalp psoriasis, a common and therapeutically challenging site.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pssi", "psoriasis", "scalp psoriasis", "scalp", "severity", "psoriatic arthritis"],
  sourceType: 'Clinical Guideline',
  icon: User,
  rationale: "The rationale was to provide a standardized, objective measure for scalp involvement, which is often underrepresented in global severity indices. The scalp is divided into four quadrants. For each quadrant, erythema, induration, and scaling are scored from 0 to 4. The score for each quadrant is calculated as the sum of the three parameters multiplied by the percentage of area involved (expressed as a decimal). The total PSSI score is the sum of the scores for all four quadrants, with a range of 0 to 72.",
  clinicalPerformance: "The PSSI has been used in clinical trials to monitor response to scalp-targeted therapies, but there is limited published data on its reliability, validity, or comparative performance in routine practice. It is considered a useful tool for detailed assessment of scalp involvement, but its complexity and time requirements may limit its use outside of research settings. No recent validation or head-to-head comparative studies were found in the provided references.",
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
      const interpretation = `PSSI Score: ${score} (Range: 0-72). Higher score indicates more severe scalp psoriasis. (E:${E} + T:${T} + S:${S}) x A:${A}. Note: This calculator uses a simplified, single-region assessment of the entire scalp.`;
      return { score, interpretation, details: { Erythema: E, Thickness: T, Scaling: S, Area_Score: A } };
  },
  references: [
    "Chalmers RJ. Assessing Psoriasis Severity and Outcomes for Clinical Trials and Routine Clinical Practice. Dermatologic Clinics. 2015;33(1):57-71. doi:10.1016/j.det.2014.09.005.",
    "Patel M, Liu SW, Qureshi A, Merola JF. The Brigham Scalp Nail Inverse Palmoplantar Psoriasis Composite Index (B-Snipi): A Novel Index to Measure All Non-Plaque Psoriasis Subsets. The Journal of Rheumatology. 2014;41(6):1230-2. doi:10.3899/jrheum.140177."
  ]
};
