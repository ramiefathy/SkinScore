
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const vigaAdOptions: InputOption[] = [
  { value: 0, label: "0 - Clear: No inflammatory signs of AD (no erythema, no induration/papulation, no oozing/crusting)." },
  { value: 1, label: "1 - Almost Clear: Barely perceptible erythema, barely perceptible induration/papulation, and no oozing/crusting." },
  { value: 2, label: "2 - Mild: Mild erythema, mild induration/papulation, and +/- oozing/crusting." },
  { value: 3, label: "3 - Moderate: Moderate erythema, moderate induration/papulation, and +/- oozing/crusting." },
  { value: 4, label: "4 - Severe: Marked erythema, marked induration/papulation/lichenification, and +/- oozing/crusting." }
];

export const vigaAdTool: Tool = {
  id: "viga_ad",
  name: "Validated IGA for AD (vIGA-AD™)",
  acronym: "vIGA-AD",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["viga-ad", "iga", "atopic dermatitis", "ad", "eczema", "physician global assessment", "validated"],
  description: "The vIGA-AD™ is a standardized, clinician-reported outcome measure developed to provide a reliable and valid assessment of atopic dermatitis (AD) severity. Its purpose is to harmonize disease severity assessment in clinical trials and registries, addressing the lack of standardization in previous Investigator Global Assessment (IGA) scales.",
  sourceType: 'Research',
  icon: UserCheck,
  rationale: "The rationale is to facilitate regulatory approval processes and enable consistent comparison of therapeutic efficacy across studies. The vIGA-AD™ is a 5-point ordinal scale, with each point anchored by detailed morphologic descriptors: 0: Clear (no signs of AD), 1: Almost clear (just perceptible erythema and/or papulation/infiltration), 2: Mild (mild erythema and/or papulation/infiltration), 3: Moderate (moderate erythema and/or papulation/infiltration), 4: Severe (severe erythema and/or papulation/infiltration). The assessment is based on the global evaluation of the overall severity of AD lesions, considering erythema, induration/papulation, oozing/crusting, and lichenification, but does not provide separate subscores for each feature. The final score is a single integer (0–4) reflecting the overall severity. The original reference is Simpson et al., with reliability and validity established in both development and subsequent multicenter studies.",
  clinicalPerformance: "The vIGA-AD™ has undergone rigorous psychometric evaluation in both development and validation studies. In the original development study, expert consensus was achieved around the 5-point scale, and content validity was established. Interrater and intrarater reliability were strong (Kendall's W 0.809–0.819; ICC 0.817–0.852; weighted kappa 0.857–0.889). In large phase III clinical trials, the vIGA-AD™ demonstrated moderate-to-good test-retest reliability, moderate-to-large correlations with EASI and BSA, and strong known-groups validity and responsiveness. A 1-point change in vIGA-AD™ was identified as a clinically meaningful difference. A large prospective practice-based study in the United States evaluated the measurement properties of the vIGA-AD™ and its product with body surface area (vIGABSA) in 653 patients, including both adults and children, seen in dermatology clinics. The study found that vIGABSA and vIGA*cBSA had good convergent validity with established clinician- and patient-reported outcomes, strong reliability (ICC 0.72–0.74), and good responsiveness to clinical change. The tools were found to be feasible for use in routine clinical practice, offering efficiency advantages over more complex severity indices such as the EASI. Registry-based studies, such as the TARGET-AD registry, have also demonstrated that vIGA-AD™ scores are positively correlated with patient-reported disease severity and quality of life, supporting its clinical utility in real-world settings. The vIGA-AD™ is not a diagnostic tool and thus sensitivity and specificity are not typically reported. Its clinical performance is evaluated in terms of reliability, validity, and responsiveness to change. The vIGA-AD™ has been used in mixed-age and pediatric cohorts, with studies demonstrating good reliability, validity, and responsiveness in children and adults. However, detailed age-stratified psychometric analyses are limited, and most validation data are derived from mixed-age or adult-dominant samples. The tool is increasingly used in pediatric atopic dermatitis trials and registries, and its measurement properties are considered sufficient for use in children, with ongoing efforts to further validate and standardize its application in this population.",
  displayType: 'staticList',
  formSections: [
    {
      id: "viga_grade",
      label: "Select vIGA-AD™ Grade",
      type: 'select',
      options: vigaAdOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', vigaAdOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
      const grade = Number(inputs.viga_grade);
      const gradeLabel = vigaAdOptions.find(opt => opt.value === grade)?.label || "N/A";
      const gradeText = gradeLabel.substring(gradeLabel.indexOf(" - ") + 3);
      const gradeTitle = gradeLabel.substring(0, gradeLabel.indexOf(":")).trim();

      const interpretation = `vIGA-AD™ Grade: ${gradeTitle}. ${gradeText}`;
      return { score: grade, interpretation, details: { grade_text: gradeTitle, description: gradeText } };
  },
  references: [
    "Simpson EL, Bissonnette R, Paller AS, et al. The Validated Investigator Global Assessment for Atopic Dermatitis (vIGA-AD™): A Clinical Outcome Measure for the Severity of Atopic Dermatitis. The British Journal of Dermatology. 2022;187(4):531-538. doi:10.1111/bjd.21615.",
    "Simpson E, Bissonnette R, Eichenfield LF, et al. The Validated Investigator Global Assessment for Atopic Dermatitis (vIGA-AD): The Development and Reliability Testing of a Novel Clinical Outcome Measurement Instrument for the Severity of Atopic Dermatitis. Journal of the American Academy of Dermatology. 2020;83(3):839-846. doi:10.1016/j.jaad.2020.04.104.",
    "Silverberg JI, Lei D, Yousaf M, et al. Measurement Properties of the Product of Investigator's Global Assessment and Body Surface Area in Children and Adults With Atopic Dermatitis. Journal of the European Academy of Dermatology and Venereology : JEADV. 2021;35(1):180-187. doi:10.1111/jdv.16846.",
    "Guttman-Yassky E, Bar J, Rothenberg-Lausell C, et al. Do Atopic Dermatitis Patient-Reported Outcomes Correlate With Validated Investigator Global Assessment? Insights From TARGET-AD Registry. Journal of Drugs in Dermatology : JDD. 2023;22(4):344-354. doi:10.36849/JDD.7473."
  ]
};
