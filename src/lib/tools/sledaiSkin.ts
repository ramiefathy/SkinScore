
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { FileHeart } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const sledaiSkinTool: Tool = {
  id: "sledai_skin",
  name: "SLEDAI - Skin Descriptors",
  acronym: "SLEDAI Skin",
  description: "The Systemic Lupus Erythematosus Disease Activity Index (SLEDAI) is a global disease activity index for SLE, incorporating 24 descriptors, including skin manifestations (rash, mucosal ulcers, alopecia).",
  condition: "Lupus",
  keywords: ["sledai", "lupus", "sle", "skin descriptors", "disease activity", "rash", "alopecia", "mucosal ulcers", "vasculitis"],
  sourceType: 'Clinical Guideline',
  icon: FileHeart,
  rationale: "Each descriptor is scored as present or absent, with rash and mucosal ulcers assigned 2 points each and alopecia 1 point. The total SLEDAI score is the sum of all present descriptors, with higher scores indicating greater disease activity. The SLEDAI-2K modification allows for persistent activity in certain descriptors, including skin, to be scored at subsequent visits.",
  clinicalPerformance: "SLEDAI and SLEDAI-2K have been validated in large cohorts, demonstrating high correlation with other disease activity indices and predictive validity for outcomes such as mortality. In pediatric populations, SLEDAI-2K correlates highly with the European Consensus Lupus Activity Measurement (ECLAM) and discriminates damage with moderate accuracy (AUC 0.74). The tool is feasible for routine use, with electronic reminders improving documentation rates in pediatric practice. Limitations include omission of some serious manifestations, inability to capture change within an organ system, and fixed severity weightings. No validated MCID exists for SLEDAI or its skin descriptors, though a 4-point change is sometimes used as a threshold for improvement.",
  formSections: [
    { id: "rash", label: "Rash (New/Recurrent inflammatory type - 2 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "alopecia", label: "Alopecia (New/Recurrent abnormal, diffuse, or patchy hair loss - 1 point)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
    { id: "mucosal_ulcers", label: "Mucosal Ulcers (New/Recurrent oral or nasal - 2 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
  ],
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, string> = {};
    if (inputs.rash) { score += 2; details.Rash = "Present (2 pts)"; } else { details.Rash = "Absent (0 pts)"; }
    if (inputs.alopecia) { score += 1; details.Alopecia = "Present (1 pt)"; } else { details.Alopecia = "Absent (0 pts)"; }
    if (inputs.mucosal_ulcers) { score += 2; details.Mucosal_Ulcers = "Present (2 pts)"; } else { details.Mucosal_Ulcers = "Absent (0 pts)"; }

    const interpretation = `SLEDAI Skin Descriptors Score: ${score}. This score contributes to the total SLEDAI. Higher score indicates greater skin-related disease activity.`;
    return { score, interpretation, details };
  },
  references: [
    "Gladman DD, Ibañez D, Urowitz MB. Systemic Lupus Erythematosus Disease Activity Index 2000. The Journal of Rheumatology. 2002;29(2):288-91.",
    "Castrejón I, Tani C, Jolly M, Huang A, Mosca M. Indices to Assess Patients With Systemic Lupus Erythematosus in Clinical Trials, Long-Term Observational Studies, and Clinical Care. Clinical and Experimental Rheumatology. 2014 Sep-Oct;32(5 Suppl 85):S-85-95.",
    "Sato JO, Corrente JE, Saad-Magalhães C. Correlation Between the Modified Systemic Lupus Erythematosus Disease Activity Index 2000 and the European Consensus Lupus Activity Measurement in Juvenile Systemic Lupus Erythematosus. Lupus. 2016;25(13):1479-1484. doi:10.1177/0961203316651737.",
    "Nelson MC, Mosley C, Bennett T, Orenstein E, Rouster-Stevens K. A Single-Center Model for Implementation of SLEDAI Documentation Adherence in Childhood-Onset Systemic Lupus Erythematosus (cSLE). Lupus. 2023;32(12):1447-1452. doi:10.1177/09612033231206451.",
    "Inês LS, Fredi M, Jesus D, et al. What Is the Best Instrument to Measure Disease Activity in SLE? - SLE-DAS vs Easy BILAG. Autoimmunity Reviews. 2024;23(1):103428. doi:10.1016/j.autrev.2023.103428.",
    "Bombardier C, Gladman DD, Urowitz MB, Caron D, Chang CH. Derivation of the SLEDAI. A disease activity index for lupus patients. The Committee on Prognosis Studies in SLE. Arthritis Rheum. 1992 Jun;35(6):630-40."
  ]
};
