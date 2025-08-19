import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const igaRosaceaOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory lesions (papules/pustules), no erythema." },
  { value: 1, label: "1 - Almost Clear: Rare inflammatory lesions; faint erythema." },
  { value: 2, label: "2 - Mild: Few inflammatory lesions (papules/pustules); mild erythema." },
  { value: 3, label: "3 - Moderate: Several to many inflammatory lesions; moderate erythema." },
  { value: 4, label: "4 - Severe: Numerous inflammatory lesions; severe erythema; may include plaques/nodules." }
];

export const igaRosaceaTool: Tool = {
  id: "iga_rosacea",
  name: "Investigator's Global Assessment (IGA) for Rosacea",
  acronym: "IGA-R",
  condition: "Rosacea",
  keywords: ["iga", "rosacea", "physician global assessment", "severity", "erythema", "papules", "pustules"],
  description: "The IGA is a clinician-rated global severity scale used to assess the overall severity of rosacea, integrating multiple clinical features such as erythema, papules, pustules, and telangiectasia. It provides a simple, standardized measure for use in clinical trials and practice.",
  sourceType: 'Research',
  icon: UserCheck,
  rationale: "The IGA is a clinician-rated global severity scale used to assess the overall severity of rosacea, integrating multiple clinical features such as erythema, papules, pustules, and telangiectasia. It provides a simple, standardized measure for use in clinical trials and practice. The IGA is typically a single-item, 5-point or 7-point ordinal scale, with scores ranging from 0 (clear) to 4 (severe) or higher. The score reflects the investigator’s overall impression of disease severity. There are no subscores or domains.",
  clinicalPerformance: "Internal consistency is not applicable for the IGA. Interobserver reliability is described as poor to moderate, while intraobserver agreement is moderate to strong. Sensitivity, specificity, and AUC may be reported in the context of defining response or remission, but these metrics are highly dependent on the population and study design. The IGA has been validated in clinical trials and real-world practice, with evidence supporting its use as a global severity measure. Comparative studies indicate that while the IGA is simple and reliable, it may not fully reflect the complexity of rosacea or capture all relevant clinical features. Criticisms of the IGA include its lack of specificity, potential for interrater variability, and the risk of obscuring specific features of rosacea. The global score may not adequately capture the heterogeneity of the disease or the impact of individual symptoms.",
  formSections: [
    {
      id: "iga_grade_rosacea",
      label: "Select IGA Grade for Rosacea",
      type: 'select',
      options: igaRosaceaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', igaRosaceaOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = Number(inputs.iga_grade_rosacea);
    const gradeDescription = igaRosaceaOptions.find(opt => opt.value === grade)?.label || "N/A";
    const gradeTitle = gradeDescription.substring(0, gradeDescription.indexOf(':')).trim();


    const interpretation = `IGA for Rosacea: Grade ${grade} (${gradeTitle}). This reflects the overall severity of rosacea based on inflammatory lesions and erythema. Full description: ${gradeDescription}`;
    return {
      score: grade,
      interpretation,
      details: {
        Selected_Grade_Description: gradeDescription
      }
    };
  },
  references: [
    "Erenumab for Treatment of Persistent Erythema and Flushing in Rosacea: A Nonrandomized Controlled Trial. Wienholtz NKF, Christensen CE, Do TP, et al. JAMA Dermatology. 2024;160(6):612-619. doi:10.1001/jamadermatol.2024.0408.",
    "Validity and Reliability of the Rosacea Area and Severity Index: A Novel Scoring System for Clinical Assessment of Rosacea Severity. Wienholtz NKF, Thyssen JP, Christensen CE, et al. Journal of the European Academy of Dermatology and Venereology : JEADV. 2023;37(3):573-580. doi:10.1111/jdv.18721.",
    "Biomarkers in Rosacea: A Systematic Review. Geng RSQ, Bourkas AN, Sibbald RG, Sibbald C. Journal of the European Academy of Dermatology and Venereology : JEADV. 2024;38(6):1048-1057. doi:10.1111/jdv.19732.",
    "A Systematic Review of the Content of Critical Appraisal Tools. Katrak P, Bialocerkowski AE, Massy-Westropp N, Kumar S, Grimmer KA. BMC Medical Research Methodology. 2004;4:22. doi:10.1186/1471-2288-4-22."
  ]
};
