
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ShieldAlert } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scortenFactors = [
  { key: "age_ge40", label: "Age ≥ 40 years" },
  { key: "malignancy_present", label: "Associated malignancy (cancer)" },
  { key: "heart_rate_ge120", label: "Heart rate ≥ 120 beats/minute" },
  { key: "bsa_gt10", label: "Initial percentage of body surface area (BSA) detachment > 10%" },
  { key: "serum_urea_gt10", label: "Serum urea level > 10 mmol/L (or > 28 mg/dL)" },
  { key: "serum_bicarbonate_lt20", label: "Serum bicarbonate level < 20 mmol/L (or < 20 mEq/L)" },
  { key: "serum_glucose_gt14", label: "Serum glucose level > 14 mmol/L (or > 252 mg/dL)" }
];

const scortenFormSections: FormSectionConfig[] = scortenFactors.map(factor => ({
  id: factor.key,
  label: factor.label,
  type: 'checkbox',
  defaultValue: false,
  validation: getValidationSchema('checkbox')
} as InputConfig));


export const scortenTool: Tool = {
  id: "scorten",
  name: "SCORTEN",
  acronym: "SCORTEN",
  description: "A severity-of-illness score to predict mortality in patients with Stevens-Johnson Syndrome (SJS) or Toxic Epidermal Necrolysis (TEN).",
  condition: "SJS/TEN",
  keywords: ["scorten", "sjs", "ten", "stevens-johnson syndrome", "toxic epidermal necrolysis", "prognosis", "mortality", "drug reaction"],
  sourceType: 'Clinical Guideline',
  icon: ShieldAlert,
  formSections: scortenFormSections,
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, string> = {};
    scortenFactors.forEach(factor => {
        if (inputs[factor.key]) {
          score++;
          details[factor.label] = "Present (1 pt)";
        } else {
          details[factor.label] = "Absent (0 pts)";
        }
    });

    const mortalityMap: Record<number, string> = {
        0: "3.2%", 1: "12.1%", 2: "35.3%", 3: "58.3%", 4: "58.3%+", 5: ">90%", 6: ">90%", 7: ">90%"
    };

    let mortalityPrediction = ">90%";
    if (score <= 3) mortalityPrediction = mortalityMap[score];
    else if (score === 4) mortalityPrediction = mortalityMap[4];


    const interpretation = `SCORTEN: ${score} (Range: 0-7). Predicted mortality risk (approximate): ${mortalityPrediction}. This score helps estimate prognosis in SJS/TEN.`;
    return { score, interpretation, details };
  },
  references: ["Bastuji-Garin S, et al. SCORTEN: a severity-of-illness score for toxic epidermal necrolysis. J Invest Dermatol. 2000 Aug;115(2):149-53."]
};
