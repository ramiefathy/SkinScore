
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SquarePen } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const ihs4Tool: Tool = {
  id: "ihs4",
  name: "International Hidradenitis Suppurativa Severity Score System (IHS4)",
  acronym: "IHS4",
  condition: "Hidradenitis Suppurativa",
  keywords: ["ihs4", "hs", "hidradenitis suppurativa", "severity", "dynamic score", "inflammatory nodules", "abscesses", "draining tunnels"],
  description: "The International Hidradenitis Suppurativa Severity Score System (IHS4) is a validated, dynamic scoring system for hidradenitis suppurativa (HS) severity. The IHS4 is calculated as: IHS4 = (number of nodules) × 1 + (number of abscesses) × 2 + (number of draining tunnels) × 4. Scores classify disease as mild (≤3), moderate (4–10), or severe (≥11). IHS4 is more quantitative and responsive than static systems like Hurley staging, and correlates well with other dynamic measures such as the HS-PGA and HiSCR, though agreement is not perfect due to the clinical heterogeneity of HS.",
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
    "Zouboulis, C. C., Tzellos, T., Kyrgidis, A., et al. (2017). Development and validation of the International Hidradenitis Suppurativa Severity Score System (IHS4). Journal of the American Academy of Dermatology, 77(4), 633-641.",
    "Horváth B, et al. Validation of the International Hidradenitis Suppurativa Severity Score System (IHS4) - A multicenter study. J Am Acad Dermatol. 2020.",
    "Ingram JR, et al. The Hidradenitis Suppurativa Core Outcome Set International Collaboration (HISCORE). Br J Dermatol. 2019."
  ]
};

