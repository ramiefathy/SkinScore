
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { CircleDot } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const nrsPruritusTool: Tool = {
  id: "nrs_pruritus",
  name: "Numeric Rating Scale (NRS) for Pruritus",
  acronym: "NRS Pruritus",
  condition: "Pruritus",
  keywords: ["nrs", "numeric rating scale", "pruritus", "itch", "intensity", "patient reported"],
  description: "A simple scale for patients to rate the intensity of their itch on an 11-point scale (0=no itch, 10=worst imaginable itch).",
  sourceType: 'Research',
  icon: CircleDot,
  formSections: [
    { id: "nrs_score", label: "NRS Score (0-10)", type: 'number', min:0, max:10, step:1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
  ],
  calculationLogic: (inputs) => {
    const score = Number(inputs.nrs_score) || 0;
    let severity = "";
    if (score === 0) severity = "No itch";
    else if (score <= 3) severity = "Mild itch";
    else if (score <= 6) severity = "Moderate itch";
    else if (score <= 8) severity = "Severe itch";
    else severity = "Very severe itch";

    const interpretation = `NRS for Pruritus: ${score} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, 1-3 Mild, 4-6 Moderate, 7-8 Severe, 9-10 Very severe).`;
    return { score, interpretation, details: { Reported_NRS_Score: score, Assessed_Severity: severity } };
  },
  references: ["Phan NQ, Blome C, Fritz F, et al. Assessment of pruritus intensity: prospective study on validity and reliability of the visual analogue scale, numerical rating scale and verbal rating scale in patients with chronic pruritus. Acta Derm Venereol. 2012."]
};
