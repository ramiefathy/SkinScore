
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ScalingIcon } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const issVisTool: Tool = {
  id: "iss_vis",
  name: "Ichthyosis Severity Score (ISS) / Visual Index for Ichthyosis Severity (VIS)",
  acronym: "ISS/VIS",
  condition: "Ichthyosis",
  keywords: ["ichthyosis", "severity score", "iss", "vis", "scaling", "erythema", "rule of nines"],
  description: "The Ichthyosis Severity Score (ISS) assesses 10 body sites (scalp, face, neck, torso, elbows, palms, upper extremities, knees, soles, lower extremities), each scored separately for scale and erythema on a 0–4 Likert scale (with half-points allowed). For each site, the sum of scale and erythema (range 0–8) is multiplied by a body region weighting based on the rule of nines, which differs for children and adults to reflect anatomical proportions. The weighted site scores are summed and then divided by the total possible weighting to yield a final composite score ranging from 0.0 (normal) to 8.0 (maximum severity). Palms and soles have unique descriptors due to their distinct morphology. When severity varies within a site, scores are averaged for that site. The ISS thus provides both global and site-specific severity, with high inter- and intrarater reliability for both scale and erythema. The Visual Index for Ichthyosis Severity (VIS) scores scale and erythema at four body sites (face, arm, leg, trunk), each on a 0–4 scale using written and visual standards. The subscores for each parameter and site are summed or averaged to yield a composite score, but the VIS does not weight sites by surface area and is less comprehensive than the ISS. This tool accepts a pre-calculated total ISS score.",
  sourceType: 'Clinical Guideline',
  icon: ScalingIcon,
  formSections: [
    { id: "total_iss_vis_score", label: "Total ISS Score (0.0 - 8.0)", type: 'number', min:0, max:8, step: 0.1, defaultValue: 0, description: "Enter the pre-calculated total ISS score.", validation: getValidationSchema('number',[],0, 8) }
  ],
  calculationLogic: (inputs) => {
    const score = parseFloat(Number(inputs.total_iss_vis_score).toFixed(1)) || 0;
    let severityInterpretation = "";
    if (score === 0.0) severityInterpretation = "Normal";
    else if (score <= 2.0) severityInterpretation = "Mild ichthyosis";
    else if (score <= 5.0) severityInterpretation = "Moderate ichthyosis";
    else severityInterpretation = "Severe ichthyosis";

    const interpretation = `ISS Score: ${score.toFixed(1)} (Range: 0.0-8.0). Severity: ${severityInterpretation}.`;
    return {
      score,
      interpretation,
      details: {
        User_Entered_ISS_Score: score,
        Severity_Category: severityInterpretation
      }
    };
  },
  references: ["Gånemo A, et al. Severity assessment in ichthyoses: a validation study. Acta Derm Venereol. 2003.", "Milstone LM, et al. The Visual Index for Ichthyosis Severity (VIIS): a validated instrument for use in ichthyosis clinical trials. Br J Dermatol. 2020."]
};

