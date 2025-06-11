
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SquarePen } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const ihs4Tool: Tool = {
  id: "ihs4",
  name: "International Hidradenitis Suppurativa Severity Score System (IHS4)",
  acronym: "IHS4",
  condition: "Hidradenitis Suppurativa",
  keywords: ["ihs4", "hs", "hidradenitis suppurativa", "severity", "dynamic score", "inflammatory nodules", "abscesses", "draining tunnels"],
  description: "Developed by the European HS Foundation (EHSF), the IHS4 is a simple, dynamic scoring system designed for clinical practice and trials. It quantifies HS severity based on a weighted count of key inflammatory lesions (inflammatory nodules, abscesses, draining tunnels/fistulas), making it sensitive to change.",
  sourceType: 'Clinical Guideline',
  icon: SquarePen,
  formSections: [
    { id: "nodules", label: "Number of Inflammatory Nodules (N) (x1 point each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "abscesses", label: "Number of Abscesses (A) (x2 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "drainingTunnels", label: "Number of Draining Tunnels/Fistulas (DT) (x4 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
  ],
  calculationLogic: (inputs) => {
    const nodules = Number(inputs.nodules) || 0;
    const abscesses = Number(inputs.abscesses) || 0;
    const drainingTunnels = Number(inputs.drainingTunnels) || 0;
    const totalScore = (nodules * 1) + (abscesses * 2) + (drainingTunnels * 4);

    let severity = "";
    if (totalScore <= 3) severity = "Mild HS";
    else if (totalScore <= 10) severity = "Moderate HS";
    else severity = "Severe HS";

    const interpretation = `IHS4 Score: ${totalScore}. Severity: ${severity} HS.
Formula: (Nodules × 1) + (Abscesses × 2) + (Draining Tunnels × 4).
Severity bands: ≤3 Mild; 4–10 Moderate; ≥11 Severe.`;
    return {
      score: totalScore,
      interpretation,
      details: {
        Nodules_Count: nodules,
        Abscesses_Count: abscesses,
        Draining_Tunnels_Count: drainingTunnels,
        Nodules_Contribution: nodules * 1,
        Abscesses_Contribution: abscesses * 2,
        Draining_Tunnels_Contribution: drainingTunnels * 4,
        Total_IHS4_Score: totalScore,
        Severity_Category: severity
      }
    };
  },
  references: [
    "Zouboulis, C. C., Tzellos, T., Kyrgidis, A., et al. (2017). Development and validation of the International Hidradenitis Suppurativa Severity Score System (IHS4). Journal of the American Academy of Dermatology, 77(4), 633-641."
  ]
};
