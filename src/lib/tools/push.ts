
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Assuming this icon is appropriate
import { getValidationSchema } from '../toolValidation';

const pushExudateOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Light" },
  { value: 2, label: "2 - Moderate" },
  { value: 3, label: "3 - Heavy" }
];

const pushTissueTypeOptions: InputOption[] = [
  { value: 0, label: "0 - Closed (Resurfaced/Epithelialized)" },
  { value: 1, label: "1 - Epithelial Tissue" },
  { value: 2, label: "2 - Granulation Tissue" },
  { value: 3, label: "3 - Slough" },
  { value: 4, label: "4 - Necrotic Tissue" }
];

const pushFormSections: FormSectionConfig[] = [
  {
    id: "push_length_cm",
    label: "Greatest Wound Length (cm) – measure head to toe",
    type: 'number',
    min: 0.0,
    max: 100.0,
    step: 0.1,
    defaultValue: 0,
    validation: getValidationSchema('number', [], 0, 100),
    description: "Measure the greatest head-to-toe length of the wound in centimeters."
  },
  {
    id: "push_width_cm",
    label: "Greatest Wound Width (cm) – measure side to side",
    type: 'number',
    min: 0.0,
    max: 100.0,
    step: 0.1,
    defaultValue: 0,
    validation: getValidationSchema('number', [], 0, 100),
    description: "Measure the greatest side-to-side width of the wound in centimeters."
  },
  {
    id: "push_exudate_amount",
    label: "Exudate Amount",
    type: 'select',
    options: pushExudateOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pushExudateOptions, 0, 3),
    description: "Select the category that best describes the amount of wound exudate."
  },
  {
    id: "push_tissue_type",
    label: "Tissue Type",
    type: 'select',
    options: pushTissueTypeOptions,
    defaultValue: 0,
    validation: getValidationSchema('select', pushTissueTypeOptions, 0, 4),
    description: "Select the category that best describes the predominant tissue type in the wound bed."
  }
];

export const pushTool: Tool = {
  id: "push",
  name: "Pressure Ulcer Scale for Healing",
  acronym: "PUSH",
  description: "The Pressure Ulcer Scale for Healing (PUSH Tool) is a quick, reliable instrument developed by the National Pressure Injury Advisory Panel (NPIAP) to monitor changes in pressure ulcer status over time by scoring three wound parameters: surface area, exudate amount, and tissue type.",
  condition: "Chronic Wounds, Pressure Ulcers, Diabetic Foot Ulcers, Venous Leg Ulcers, Surgical Wounds",
  keywords: ["push", "pressure ulcer", "wound healing", "monitoring", "score", "exudate", "tissue type", "surface area"],
  sourceType: 'Clinical Guideline',
  icon: ClipboardList,
  rationale: "The PUSH tool was developed to provide a standardized, evidence-based method for monitoring the healing of pressure ulcers over time. The National Pressure Ulcer Advisory Panel (NPUAP) formally recommended the PUSH tool to address the lack of consistency and objectivity in traditional wound assessments, which often relied on subjective clinical impressions and non-standardized documentation methods. The PUSH tool (version 3.0) assesses three key parameters: • Wound surface area: Measured as length × width in centimeters, then converted to a score from 0 to 10 based on size categories. • Exudate amount: Scored from 0 (none) to 3 (heavy), based on the amount of exudate present after dressing removal. • Tissue type: Scored from 0 (closed/resurfaced) to 4 (necrotic tissue), reflecting the predominant tissue type in the wound bed. The total PUSH score is the sum of these three subscores, with a maximum possible score of 17. Higher scores indicate more severe or less healed ulcers. The tool is designed for regular use (e.g., weekly) to monitor healing trajectories.",
  clinicalPerformance: "A prospective study in nursing home residents demonstrated that PUSH scores decreased significantly over time in healing ulcers, and the tool could differentiate between healing and non-healing ulcers. PUSH scores were highly correlated with both the Pressure Sore Status Tool and direct surface area measurements, supporting its construct validity. Another large prospective study confirmed the tool’s internal and external responsiveness, showing that PUSH could detect statistically significant changes in wound healing across a variety of acute and chronic wound types, including venous ulcers, neuropathic ulcers, burns, surgical wounds, and traumatic wounds. The effect size statistics were large, confirming the tool’s sensitivity to clinically meaningful changes. While the PUSH tool is generally considered reliable and easy to use, a retrospective study in a skilled nursing facility found only modest agreement between PUSH scores and traditional nursing assessments, with kappa statistics ranging from 0.007 to 0.298. This suggests that while PUSH provides a standardized and reproducible method for tracking wound healing, its concordance with subjective clinical impressions may be limited, highlighting the importance of standardized documentation.",
  formSections: pushFormSections,
  calculationLogic: (inputs) => {
    const lengthCm = Number(inputs.push_length_cm) || 0;
    const widthCm = Number(inputs.push_width_cm) || 0;
    const areaCm2 = parseFloat((lengthCm * widthCm).toFixed(2));

    let areaSubScore = 0;
    if (areaCm2 === 0) areaSubScore = 0;
    else if (areaCm2 <= 0.3) areaSubScore = 1;
    else if (areaCm2 <= 0.6) areaSubScore = 2;
    else if (areaCm2 <= 1.0) areaSubScore = 3;
    else if (areaCm2 <= 2.0) areaSubScore = 4;
    else if (areaCm2 <= 3.0) areaSubScore = 5;
    else if (areaCm2 <= 4.0) areaSubScore = 6;
    else if (areaCm2 <= 8.0) areaSubScore = 7;
    else if (areaCm2 <= 12.0) areaSubScore = 8;
    else if (areaCm2 <= 24.0) areaSubScore = 9;
    else if (areaCm2 > 24.0) areaSubScore = 10;

    const exudateSubScore = Number(inputs.push_exudate_amount) || 0;
    const tissueTypeSubScore = Number(inputs.push_tissue_type) || 0;

    const totalPushScore = areaSubScore + exudateSubScore + tissueTypeSubScore;

    let healingStatus = "Undefined";
    if (totalPushScore === 0) healingStatus = "Closed/Healed";
    else if (totalPushScore <= 5) healingStatus = "Minimal impairment (healing well)";
    else if (totalPushScore <= 10) healingStatus = "Moderate impairment (slow/delayed healing)";
    else if (totalPushScore <= 17) healingStatus = "Severe impairment (non-healing or worsening)";


    const interpretation = `Total PUSH Score: ${totalPushScore} (Range: 0–17). Healing Status: ${healingStatus}.
A decreasing score over time indicates improvement.
Area: ${areaCm2.toFixed(2)} cm² (Sub-score: ${areaSubScore}). Exudate: ${exudateSubScore}. Tissue Type: ${tissueTypeSubScore}.`;

    return {
      score: totalPushScore,
      interpretation,
      details: {
        area_cm2: areaCm2.toFixed(2),
        area_sub_score: areaSubScore,
        exudate_amount_sub_score: exudateSubScore,
        tissue_type_sub_score: tissueTypeSubScore,
        total_push_score: totalPushScore,
        healing_status_category: healingStatus
      }
    };
  },
  references: [
    "George-Saintilus E, Tommasulo B, Cal CE, et al. Pressure Ulcer PUSH Score and Traditional Nursing Assessment in Nursing Home Residents: Do They Correlate?. Journal of the American Medical Directors Association. 2009;10(2):141-4. doi:10.1016/j.jamda.2008.10.014.",
    "Gardner SE, Frantz RA, Bergquist S, Shin CD. A Prospective Study of the Pressure Ulcer Scale for Healing (PUSH). The Journals of Gerontology. Series A, Biological Sciences and Medical Sciences. 2005;60(1):93-7. doi:10.1093/gerona/60.1.93.",
    "Berlowitz DR, Ratliff C, Cuddigan J, Rodeheaver GT. The PUSH Tool: A Survey to Determine Its Perceived Usefulness. Advances in Skin & Wound Care. 2005 Nov-Dec;18(9):480-3. doi:10.1097/00129334-200511000-00011.",
    "Choi EP, Chin WY, Wan EY, Lam CL. Evaluation of the Internal and External Responsiveness of the Pressure Ulcer Scale for Healing (PUSH) Tool for Assessing Acute and Chronic Wounds. Journal of Advanced Nursing. 2016;72(5):1134-43. doi:10.1111/jan.12898."
  ]
};
