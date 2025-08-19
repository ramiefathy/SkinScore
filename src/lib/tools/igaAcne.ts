import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

// Updated to 5-point scale (0-4)
const igaAcneOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory or non-inflammatory lesions." },
  { value: 1, label: "1 - Almost Clear: Rare non-inflammatory lesions (NILs) with no more than one small inflammatory lesion (IL)." },
  { value: 2, label: "2 - Mild: Some NILs, no more than a few ILs (papules/pustules only, no nodules)." },
  { value: 3, label: "3 - Moderate: Many NILs, may have some ILs, no more than one small nodule." },
  { value: 4, label: "4 - Severe: Numerous NILs and ILs, may have a few nodules." }
];

const baselineIgaOptions: InputOption[] = [
  { value: -1, label: "N/A (Baseline not assessed)" },
  ...igaAcneOptions
];


export const igaAcneTool: Tool = {
  id: "iga_acne",
  name: "IGA for Acne Vulgaris",
  acronym: "IGA Acne",
  condition: "Acne Vulgaris",
  keywords: ["iga", "acne", "acne vulgaris", "physician global assessment", "severity"],
  description: "The Investigator's Global Assessment (IGA) for Acne Vulgaris is a static, clinician-rated, 5-point ordinal scale (0–4) used to assess the overall severity of acne based on lesion counts and types.",
  sourceType: 'Research',
  icon: UserCheck,
  rationale: "The IGA is a clinician-reported, ordinal scale used to assess the overall severity of acne vulgaris. The rationale is to provide a simple, rapid, and reproducible method for grading acne severity in both clinical practice and research, facilitating therapeutic decision-making and standardized outcome reporting. The IGA is typically a 5-point scale (0–4), with each point anchored by descriptive criteria ranging from clear to severe. The American Academy of Dermatology, in its 2024 Guidelines of Care for the Management of Acne Vulgaris, recognizes the IGA as the most commonly used acne grading tool in the United States, with good agreement between clinician and patient ratings.",
  clinicalPerformance: "The IGA has been used extensively in both clinical trials and real-world practice, including in adolescent populations. Studies have demonstrated good inter- and intra-rater reliability, strong face validity, and good agreement with patient ratings. The U.S. Food and Drug Administration recommends the use of a 5-point IGA scale as a primary endpoint in acne clinical trials, with treatment success typically defined as achieving a score of clear or almost clear or a 2-point reduction from baseline. Sensitivity and specificity are not routinely reported, as the IGA is not a diagnostic tool but a severity grading instrument. The IGA is widely used in adolescents, but formal validation in younger children is limited, and further work is needed to standardize descriptors and validate the tool for use in both facial and truncal acne and across age groups.",
  formSections: [
    {
      id: "current_iga_grade",
      label: "Current IGA Grade (0-4)",
      type: 'select',
      options: igaAcneOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaAcneOptions ,0,4) // Max changed to 4
    },
    {
      id: "baseline_iga_grade",
      label: "Baseline IGA Grade (0-4 or N/A)",
      type: 'select',
      options: baselineIgaOptions,
      defaultValue: -1,
      description: "Select baseline grade if assessing treatment success (≥2 grade improvement AND final grade 0 or 1).",
      validation: getValidationSchema('select', baselineIgaOptions ,-1,4) // Max changed to 4
    }
  ],
  calculationLogic: (inputs) => {
      const currentGrade = Number(inputs.current_iga_grade);
      const baselineGrade = Number(inputs.baseline_iga_grade);

      const currentGradeLabel = igaAcneOptions.find(opt => opt.value === currentGrade)?.label || "Invalid Grade";
      const baselineGradeLabel = baselineIgaOptions.find(opt => opt.value === baselineGrade)?.label || "N/A";

      let treatmentSuccess = "N/A";
      if (baselineGrade !== -1 && baselineGrade >= 0) {
          // Treatment success definition: current grade 0 or 1 AND at least a 2-grade improvement from baseline
          if (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) {
              treatmentSuccess = "Achieved";
          } else {
              treatmentSuccess = "Not Achieved";
          }
      }

      let interpretation = `Current IGA Acne Grade: ${currentGradeLabel}. `;
      if (baselineGrade !== -1) {
          interpretation += `\nBaseline IGA Grade: ${baselineGradeLabel}. \nTreatment Success (Current grade 0 or 1 AND ≥2 grade reduction from baseline): ${treatmentSuccess}.`;
      }

      return {
        score: currentGrade,
        interpretation,
        details: {
          Current_IGA_Description: currentGradeLabel,
          Baseline_IGA_Description: baselineGradeLabel,
          Treatment_Success_Criteria_Met: treatmentSuccess
        }
      };
  },
  references: [
    "Reynolds RV, Yeung H, Cheng CE, et al. Guidelines of Care for the Management of Acne Vulgaris. Journal of the American Academy of Dermatology. 2024;90(5):1006.e1-1006.e30. doi:10.1016/j.jaad.2023.12.017.",
    "Cho SI, Yang JH, Suh DH. Analysis of Trends and Status of Physician-Based Evaluation Methods in Acne Vulgaris From 2000 to 2019. The Journal of Dermatology. 2021;48(1):42-48. doi:10.1111/1346-8138.15613.",
    "Pascoe VL, Enamandram M, Corey KC, et al. Using the Physician Global Assessment in a Clinical Setting to Measure and Track Patient Outcomes. JAMA Dermatology. 2015;151(4):375-81. doi:10.1001/jamadermatol.2014.3513.",
    "Tan J, Wolfe B, Weiss J, et al. Acne Severity Grading: Determining Essential Clinical Components and Features Using a Delphi Consensus. Journal of the American Academy of Dermatology. 2012;67(2):187-93. doi:10.1016/j.jaad.2011.09.005.",
    "Tan JKL, Jones E, Allen E, et al. Evaluation of Essential Clinical Components and Features of Current Acne Global Grading Scales. Journal of the American Academy of Dermatology. 2013;69(5):754-761. doi:10.1016/j.jaad.2013.07.029.",
    "Bernardis E, Shou H, Barbieri JS, et al. Development and Initial Validation of a Multidimensional Acne Global Grading System Integrating Primary Lesions and Secondary Changes. JAMA Dermatology. 2020;156(3):296-302. doi:10.1001/jamadermatol.2019.4668."
  ]
};
