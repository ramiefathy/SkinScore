
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Palette } from 'lucide-react'; // Or UserCheck if focusing on clinician assessment
import { getValidationSchema } from '../toolValidation';

const ceaRosaceaOptions: InputOption[] = [
  { value: 0, label: "0 - Clear skin with no signs of erythema." },
  { value: 1, label: "1 - Almost clear; slight redness." },
  { value: 2, label: "2 - Mild erythema; definite redness, easily recognized." },
  { value: 3, label: "3 - Moderate erythema; marked redness." },
  { value: 4, label: "4 - Severe erythema; fiery redness." }
];

export const ceaRosaceaTool: Tool = {
  id: "cea_rosacea",
  name: "Clinician's Erythema Assessment (CEA) for Rosacea",
  acronym: "CEA Rosacea",
  condition: "Rosacea",
  keywords: ["cea", "rosacea", "erythema", "redness", "severity", "clinician-rated"],
  description: "The CEA is a clinician-reported outcome measure designed to quantify the severity of facial erythema in patients with rosacea. The CEA provides a standardized, reproducible, and objective measure of erythema, supporting both clinical trials and routine practice.",
  sourceType: 'Research',
  icon: Palette,
  rationale: "Erythema is a core feature of rosacea and a major driver of patient distress. The CEA provides a standardized, reproducible, and objective measure of erythema, supporting both clinical trials and routine practice. The CEA is a single-item, 5-point ordinal scale, with scores ranging from 0 (clear) to 4 (severe). The assessment is based on the clinician’s global impression of the intensity of erythema on the face. There are no subscores or domains. The reliability and validity of the CEA were established by Tan et al. in a study involving 12 board-certified dermatologists who rated erythema in 28 rosacea subjects. The CEA demonstrated high interrater reliability (ICC 0.601–0.576) and substantial agreement (weighted kappa 0.692). The CEA is widely used in clinical trials and has been included as a standard outcome measure in recent studies.",
  clinicalPerformance: "As a single-item measure, internal consistency is not applicable. The CEA demonstrates high interrater and good intrarater reliability when used by trained raters, with ICCs of 0.601 and 0.576 and a weighted kappa of 0.692. Sensitivity, specificity, and AUC may be reported in the context of defining response or remission in clinical trials, but these metrics are highly dependent on the population, setting, and study design. The CEA has been validated in clinical trials and real-world practice, with evidence supporting its reliability and utility in assessing facial erythema in rosacea. Comparative studies have highlighted the importance of standardized training for raters to ensure consistency. Limitations of the CEA include subjective scoring, interrater variability, and limited standardization across raters. The single-item structure may not capture the full spectrum of erythema severity or its impact on patients.",
  formSections: [
    {
      id: "ceaScore",
      label: "Erythema Grade (0–4)",
      type: 'select', // Changed to select to provide descriptive options
      options: ceaRosaceaOptions,
      defaultValue: 0,
      validation: getValidationSchema('select', ceaRosaceaOptions, 0, 4)
    }
  ],
  calculationLogic: (inputs) => {
    const grade = Number(inputs.ceaScore);
    const gradeLabelObj = ceaRosaceaOptions.find(opt => opt.value === grade);
    const gradeInterpretation = gradeLabelObj ? gradeLabelObj.label : `Grade ${grade} (Unknown description)`;

    return {
      score: grade,
      interpretation: `CEA for Rosacea: ${gradeInterpretation}.`,
      details: {
        Selected_CEA_Grade_Description: gradeInterpretation
      }
    };
  },
  references: [
    "Tan J, Liu H, Leyden JJ, Leoni MJ. Reliability of Clinician Erythema Assessment Grading Scale. Journal of the American Academy of Dermatology. 2014;71(4):760-3. doi:10.1016/j.jaad.2014.05.044.",
    "Wienholtz NKF, Christensen CE, Do TP, et al. Erenumab for Treatment of Persistent Erythema and Flushing in Rosacea: A Nonrandomized Controlled Trial. JAMA Dermatology. 2024;160(6):612-619. doi:10.1001/jamadermatol.2024.0408.",
    "van Stralen KJ, Stel VS, Reitsma JB, et al. Diagnostic Methods I: Sensitivity, Specificity, and Other Measures of Accuracy. Kidney International. 2009;75(12):1257-1263. doi:10.1038/ki.2009.92.",
    "Leeflang MM, Bossuyt PM, Irwig L. Diagnostic Test Accuracy May Vary With Prevalence: Implications for Evidence-Based Diagnosis. Journal of Clinical Epidemiology. 2009;62(1):5-12. doi:10.1016/j.jclinepi.2008.04.007.",
    "Vijfschagt ND, Burger H, Berger MY, et al. Variation in Sensitivity and Specificity of Diverse Diagnostic Tests Across Healthcare Settings: A Meta-Epidemiological Study. Journal of Clinical Epidemiology. 2025;:111816. doi:10.1016/j.jclinepi.2025.111816.",
    "Murad MH, Lin L, Chu H, et al. The Association of Sensitivity and Specificity With Disease Prevalence: Analysis of 6909 Studies of Diagnostic Test Accuracy. CMAJ : Canadian Medical Association Journal = Journal De l'Association Medicale Canadienne. 2023;195(27):E925-E931. doi:10.1503/cmaj.221802.",
    "Katrak P, Bialocerkowski AE, Massy-Westropp N, Kumar S, Grimmer KA. A Systematic Review of the Content of Critical Appraisal Tools. BMC Medical Research Methodology. 2004;4:22. doi:10.1186/1471-2288-4-22."
  ]
};
