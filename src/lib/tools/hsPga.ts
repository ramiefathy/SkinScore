
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const hsPgaTool: Tool = {
  id: "hspga",
  name: "HS-PGA (Hidradenitis Suppurativa Physician's Global Assessment)",
  acronym: "HS-PGA",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hspga", "hs", "hidradenitis suppurativa", "pga", "physician global assessment", "severity"],
  description: "A static, 6-point scale for clinicians to globally assess the severity of Hidradenitis Suppurativa. Specific definitions for each grade vary slightly across trials.",
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    { id: "abscesses_count", label: "Number of Abscesses (A)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
    { id: "inflammatory_nodules_count", label: "Number of Inflammatory Nodules (IN)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
    { id: "draining_fistulas_count", label: "Number of Draining Fistulas (DF)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
    { id: "non_inflammatory_nodules_count", label: "Number of Non-Inflammatory Nodules (NIN) (e.g., for Grade 0/1 distinction)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)}
  ],
  calculationLogic: (inputs) => {
    const A = Number(inputs.abscesses_count) || 0;
    const IN = Number(inputs.inflammatory_nodules_count) || 0;
    const DF = Number(inputs.draining_fistulas_count) || 0;
    const NIN = Number(inputs.non_inflammatory_nodules_count) || 0;

    let pgaScore = -1;
    let description = "Undetermined - use clinical judgment or direct PGA selection.";

    if (A === 0 && IN === 0 && DF === 0 && NIN === 0) {
        pgaScore = 0; description = "Clear: No inflammatory or non-inflammatory HS lesions.";
    } else if (A === 0 && IN === 0 && DF === 0 && NIN > 0) {
        pgaScore = 1; description = "Minimal: No abscesses, inflammatory nodules, or draining fistulas; only non-inflammatory nodules present.";
    } else if (A === 0 && DF === 0 && IN > 0 && IN <= 4) {
        pgaScore = 2; description = "Mild: 1-4 inflammatory nodule(s); no abscess(es) or draining fistula(s).";
    } else if (A <= 2 && DF === 0 && IN === 0) {
        pgaScore = 2; description = "Mild: ≤2 abscess(es); no inflammatory nodule(s) or draining fistula(s).";
    } else if (DF <= 2 && A === 0 && IN === 0) {
        pgaScore = 2; description = "Mild: ≤2 draining fistula(s); no inflammatory nodule(s) or abscess(es).";
    } else if ((A > 0 || DF > 0 || IN > 0)) {
        if ((A <= 5 && DF <= 5 && (A+DF) <= 5 && IN < 10) && !((A > 2 && IN === 0 && DF === 0) || (DF > 2 && IN === 0 && A === 0))) {
           if ((A+DF) >=1 || IN >=5) {pgaScore = 3; description = "Moderate: Some abscesses/fistulas (total ≤5) and/or several inflammatory nodules (<10).";}
           else if (pgaScore===-1 && (A > 0 || IN > 0 || DF > 0)) {pgaScore = 2; description="Mild: Few mixed inflammatory lesions."}
        }
        if (((A > 5 || DF > 5 || (A+DF) > 5) || ( (A+DF) >=1 && IN >= 10 )) && !((A+DF) > 10) ) {
            pgaScore = 4; description = "Severe: Multiple abscesses/fistulas (total >5) or many inflammatory nodules (≥10) with some A/DF.";
        }
        if ((A+DF) > 10 || (A+IN+DF > 20 && (A+DF) >=5) ) {
            pgaScore = 5; description = "Very Severe: Extensive/confluent lesions or very numerous lesions.";
        }
    }
    if(pgaScore === -1 && (A > 0 || IN > 0 || DF > 0)) {
        pgaScore = 3; description = "Moderate (General fallback - use clinical judgment).";
    }


    const interpretation = `HS-PGA Score: ${pgaScore === -1 ? 'N/A' : pgaScore} - ${description}. This score is a global assessment. Precise definitions can vary.`;
    return { score: pgaScore, interpretation, details: { Abscesses: A, Inflammatory_Nodules: IN, Draining_Fistulas: DF, Non_Inflammatory_Nodules: NIN, Calculated_Description: description } };
  },
  references: ["HS-PGA scales are often defined in specific clinical trial protocols. Example: Kimball AB, et al. JAMA Dermatol. 2012. FDA Adalimumab Prescribing Information."]
};
