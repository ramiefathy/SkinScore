
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const vasPruritusTool: Tool = {
  id: "vas_pruritus",
  name: "Visual Analogue Scale (VAS) for Pruritus",
  acronym: "VAS Pruritus",
  condition: "Pruritus",
  keywords: ["vas", "visual analogue scale", "pruritus", "itch", "intensity", "patient reported"],
  description: "A simple scale for patients to rate the intensity of their itch, typically on a 10 cm line (0=no itch, 10=worst imaginable itch).",
  sourceType: 'Research',
  icon: SlidersHorizontal,
  formSections: [
    { id: "vas_score_cm", label: "VAS Score (cm or 0-10)", type: 'number', min:0, max:10, step:0.1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
  ],
  calculationLogic: (inputs) => {
    const score = parseFloat(Number(inputs.vas_score_cm).toFixed(1)) || 0;
    let severity = "";
    if (score === 0) severity = "No itch";
    else if (score < 3) severity = "Mild itch";
    else if (score < 7) severity = "Moderate itch";
    else if (score < 9) severity = "Severe itch";
    else severity = "Very severe itch";

    const interpretation = `VAS for Pruritus: ${score.toFixed(1)} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, >0-2.9 Mild, 3-6.9 Moderate, 7-8.9 Severe, 9-10 Very severe).`;
    return { score, interpretation, details: { Reported_VAS_Score: score, Assessed_Severity: severity } };
  },
  references: ["Huskisson EC. Measurement of pain. Lancet. 1974.", "Phan NQ, Blome C, Fritz F, et al. Assessment of pruritus intensity: prospective study on validity and reliability of the visual analogue scale, numerical rating scale and verbal rating scale in patients with chronic pruritus. Acta Derm Venereol. 2012."]
};
