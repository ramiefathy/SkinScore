import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hsPgaGradeOptions: InputOption[] = [
  { value: 0, label: "0 - Clear (no inflammatory or non-inflammatory nodules)" },
  { value: 1, label: "1 - Minimal (1 nodule or abscess)" },
  { value: 2, label: "2 - Mild (2–5 nodules or abscesses)" },
  { value: 3, label: "3 - Moderate (6–10 nodules or abscesses)" },
  { value: 4, label: "4 - Severe (11–20 nodules or abscesses)" },
  { value: 5, label: "5 - Very Severe (>20 nodules or abscesses)" }
];

export const hsPgaTool: Tool = {
  id: "hspga",
  name: "HS-PGA (Hidradenitis Suppurativa Physician's Global Assessment)",
  acronym: "HS-PGA",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hspga", "hs", "hidradenitis suppurativa", "pga", "physician global assessment", "severity"],
  description: "The HS-PGA is a global, physician-reported outcome measure designed to assess overall HS severity, primarily for use in clinical trials. It is based on lesion counts and the extent of involvement, providing a standardized, reproducible anchor for disease severity.",
  sourceType: 'Research',
  icon: UserCheck,
  displayType: 'staticList',
  rationale: "The HS-PGA is a global, physician-reported outcome measure designed to assess overall HS severity, primarily for use in clinical trials. It is based on lesion counts and the extent of involvement, providing a standardized, reproducible anchor for disease severity. The HS-PGA is typically a 6-point scale: 0: Clear (no inflammatory or non-inflammatory nodules), 1: Minimal (1 nodule or abscess), 2: Mild (2–5 nodules or abscesses), 3: Moderate (6–10 nodules or abscesses), 4: Severe (11–20 nodules or abscesses), 5: Very severe (>20 nodules or abscesses). Some versions may include additional criteria such as the presence of draining tunnels or the number of affected regions. The scale is categorical, with no formal subscores.",
  clinicalPerformance: "The HS-PGA has demonstrated high intrarater reliability (ICC > 0.75) and moderate interrater reliability, with performance comparable to other major scoring systems. It correlates well with IHS4 and other severity measures (ρ > 0.6), and moderately with patient-reported outcomes such as DLQI. However, the HS-PGA may be less sensitive to small but clinically meaningful changes in disease activity compared to lesion-based scores such as IHS4 or HiSCR.",
  formSections: [
    {
      id: "hs_pga_grade_display",
      label: "HS-PGA Grades",
      type: 'select',
      options: hsPgaGradeOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', hsPgaGradeOptions, 0, 5)
    }
  ],
  calculationLogic: (inputs) => {
    // This logic is not used for 'staticList' display but is kept for completeness
    const grade = Number(inputs.pgaGrade) || 0;
    const gradeLabel = hsPgaGradeOptions.find(opt => opt.value === grade)?.label || "Invalid Grade";
    const interpretationText = `HS-PGA Grade ${gradeLabel}. A common trial endpoint is achieving a ≥2-grade reduction from baseline.`;

    return {
      score: grade,
      interpretation: interpretationText,
      details: {
        Selected_HS_PGA_Grade: gradeLabel
      }
    };
  },
  references: [
    "Alikhan A, Sayed C, Alavi A, et al. North American clinical management guidelines for hidradenitis suppurativa: A publication from the United States and Canadian Hidradenitis Suppurativa Foundations: Part I: Diagnosis, evaluation, and the use of complementary and procedural management. J Am Acad Dermatol. 2019;81(1):76-90.",
    "Saunte DML, Jemec GBE. Hidradenitis Suppurativa: Advances in Diagnosis and Treatment. JAMA. 2017;318(20):2019-2032.",
    "Włodarek K, Stefaniak A, Matusiak Ł, Szepietowski JC. Could Residents Adequately Assess the Severity of Hidradenitis Suppurativa? Interrater and Intrarater Reliability Assessment of Major Scoring Systems. Dermatology (Basel, Switzerland). 2020;236(1):8-14.",
    "Daoud M, Suppa M, Benhadou F, et al. Overview and Comparison of the Clinical Scores in Hidradenitis Suppurativa: A Real-Life Clinical Data. Frontiers in Medicine. 2023;10:1145152.",
    "Garg A, Zema C, Ciaravino V, et al. Validation of the Hidradenitis Suppurativa Investigator Global Assessment: A Novel Hidradenitis Suppurativa–Specific Investigator Global Assessment for Use in Interventional Trials. JAMA Dermatology. 2023;159(6):606-612."
  ]
};
