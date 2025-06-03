
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SquarePen } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const ihs4Tool: Tool = {
  id: "ihs4",
  name: "International Hidradenitis Suppurativa Severity Score System (IHS4)",
  acronym: "IHS4",
  condition: "Hidradenitis Suppurativa",
  keywords: ["ihs4", "hs", "hidradenitis suppurativa", "severity", "dynamic score"],
  description: "A validated, dynamic scoring system for HS severity based on lesion counts.",
  sourceType: 'Clinical Guideline',
  icon: SquarePen,
  formSections: [
    { id: "nodules_count", label: "Number of Inflammatory Nodules (x1 point each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "abscesses_count", label: "Number of Abscesses (x2 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "draining_tunnels_count", label: "Number of Draining Tunnels/Fistulas (x4 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
  ],
  calculationLogic: (inputs) => {
    const Nn = Number(inputs.nodules_count) || 0;
    const Na = Number(inputs.abscesses_count) || 0;
    const Ndt = Number(inputs.draining_tunnels_count) || 0;
    const score = (Nn * 1) + (Na * 2) + (Ndt * 4);

    let severity = "";
    if (score <= 3) severity = "Mild HS";
    else if (score <= 10) severity = "Moderate HS";
    else severity = "Severe HS";

    const interpretation = `IHS4 Score: ${score}. Assessed Severity: ${severity}. (Severity bands: ≤3 Mild; 4-10 Moderate; ≥11 Severe).`;
    return {
      score,
      interpretation,
      details: {
        Nodules_Contribution: Nn * 1,
        Abscesses_Contribution: Na * 2,
        Draining_Tunnels_Contribution: Ndt * 4,
        Severity_Category: severity
      }
    };
  },
  references: ["Zouboulis CC, et al. Development and validation of the International Hidradenitis Suppurativa Severity Score System (IHS4), a novel dynamic scoring system to assess HS severity. Br J Dermatol. 2017 Dec;177(6):1401-1409."]
};
