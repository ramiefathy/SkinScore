
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ShieldQuestion } from 'lucide-react';
import { getValidationSchema, ctcaeCriteriaSnippets, ctcaeAdverseEventOptions as skinAdverseEventOptions } from '../toolValidation';

const ctcaeGradeOptions: InputOption[] = [
  { value: 1, label: "Grade 1 - Mild" },
  { value: 2, label: "Grade 2 - Moderate" },
  { value: 3, label: "Grade 3 - Severe" },
  { value: 4, label: "Grade 4 - Life-threatening" },
  { value: 5, label: "Grade 5 - Death" }
];

export const ctcaeSkinTool: Tool = {
  id: "ctcae_skin",
  name: "CTCAE - Skin Toxicities",
  acronym: "CTCAE Skin",
  description: "The Common Terminology Criteria for Adverse Events (CTCAE) is a standardized tool for grading adverse events in oncology, including dermatologic toxicities.",
  condition: "Adverse Drug Reactions",
  keywords: ["ctcae", "skin toxicity", "adverse event", "drug reaction", "grading", "chemotherapy", "oncology", "NCI"],
  sourceType: 'Clinical Guideline',
  icon: ShieldQuestion,
  rationale: "The CTCAE, developed by the National Cancer Institute, is the standard clinician-reported outcome measure for grading the severity of adverse events, including dermatologic toxicities, in oncology trials and practice. The rationale is to provide a reproducible, standardized framework for reporting the type and severity of skin toxicities (e.g., rash, pruritus, xerosis, paronychia, alopecia) associated with cancer therapies, facilitating consistent communication, regulatory reporting, and clinical decision-making. Each skin event is graded independently on a scale from 1 (mild) to 5 (death related to adverse event), based on objective criteria such as body surface area involved, impact on activities of daily living, and need for intervention.",
  clinicalPerformance: "A 2024 systematic review by Shaigany et al. found that the CTCAE is the most frequently used instrument for grading dermatologic adverse events in cancer trials, but formal psychometric validation is limited. For acneiform rash, the CTCAE demonstrated sufficient construct validity, with strong correlations to other clinician-reported outcome measures and moderate to high correlations with patient-reported outcome measures. For other skin toxicities, such as pruritus, xerosis, paronychia, and alopecia, construct validity is less robust, and reliability data are largely absent except for acneiform rash, where moderate to strong interrater reliability has been reported. Sensitivity and specificity are not reported, as the CTCAE is not a diagnostic tool. In pediatric populations, the CTCAE has been adapted into the Pediatric Patient-Reported Outcomes version (Ped-PRO-CTCAE), which has demonstrated strong construct validity and moderate to high test-retest reliability for symptom adverse events in children aged 7–18 years, though not specifically for skin toxicities. Studies have shown poor-to-fair agreement between clinician-reported CTCAE grades and child or caregiver-reported outcomes, with clinicians tending to underreport the severity of symptomatic adverse events compared to patients and caregivers.",
  formSections: [
    {
      id: "ae_term_select",
      label: "Select Cutaneous Adverse Event",
      type: 'select',
      options: skinAdverseEventOptions, // Imported from toolValidation
      defaultValue: skinAdverseEventOptions[0]?.value || "Other",
      validation: getValidationSchema('select', skinAdverseEventOptions)
    },
    {
      id: "ctcae_grade",
      label: "CTCAE Grade (1-5)",
      type: 'select',
      options: ctcaeGradeOptions,
      defaultValue: 1,
      description: "Select grade. Specific criteria summary for the chosen AE will be shown in results.",
      validation: getValidationSchema('select', ctcaeGradeOptions, 1, 5)
    }
  ],
  calculationLogic: (inputs) => {
    const selectedAe = inputs.ae_term_select as string;
    const grade = Number(inputs.ctcae_grade);
    const gradeLabel = ctcaeGradeOptions.find(opt => opt.value === grade)?.label || `Grade ${grade}`;

    let aeSpecificCriteria = "N/A";
    if (ctcaeCriteriaSnippets[selectedAe] && ctcaeCriteriaSnippets[selectedAe][grade]) {
        aeSpecificCriteria = ctcaeCriteriaSnippets[selectedAe][grade];
    } else if (ctcaeCriteriaSnippets[selectedAe] && !ctcaeCriteriaSnippets[selectedAe][grade] && (grade === 4 || grade === 5)) {
        if (grade === 4 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Life-threatening consequences; urgent intervention indicated.";
        else if (grade === 5 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Death related to AE.";
        else aeSpecificCriteria = `${gradeLabel} for ${selectedAe}. Refer to full CTCAE manual for specific criteria.`;
    } else if (selectedAe === "Other") {
        aeSpecificCriteria = `${gradeLabel} for "Other" AE. Document specific criteria manually.`;
    } else {
        aeSpecificCriteria = `Criteria for ${selectedAe} ${gradeLabel} not pre-defined in this tool's snippets. ${gradeLabel}. Refer to full CTCAE manual.`;
    }

    const interpretation = `Adverse Event: ${selectedAe}\nCTCAE Grade: ${gradeLabel}\nCriteria Summary: ${aeSpecificCriteria}\n(Refer to full CTCAE documentation for complete definitions and all terms. Psychometric properties like validity and reliability can vary across different skin toxicities.)`;

    return {
        score: grade,
        interpretation,
        details: {
          Adverse_Event_Term: selectedAe,
          Selected_Grade_Label: gradeLabel,
          Criteria_Summary: aeSpecificCriteria
        }
    };
  },
  references: [
    "Shaigany S, Mastacouris N, Tannenbaum R, et al. Outcome Measurement Instruments Used to Evaluate Dermatologic Adverse Events in Cancer Trials: A Systematic Review. JAMA Dermatology. 2024;160(6):651-657. doi:10.1001/jamadermatol.2024.0053.",
    "Peuvrel L, Cassecuel J, Bernier C, et al. TOXICAN: A Guide for Grading Dermatological Adverse Events of Cancer Treatments. Supportive Care in Cancer : Official Journal of the Multinational Association of Supportive Care in Cancer. 2018;26(8):2871-2877. doi:10.1007/s00520-018-4153-x.",
    "Reeve BB, McFatrich M, Mack JW, et al. Validity and Reliability of the Pediatric Patient-Reported Outcomes Version of the Common Terminology Criteria for Adverse Events. Journal of the National Cancer Institute. 2020;112(11):1143-1152. doi:10.1093/jnci/djaa016.",
    "Reeve BB, McFatrich M, Lin L, et al. Validation of the Caregiver Pediatric Patient-Reported Outcomes Version of the Common Terminology Criteria for Adverse Events Measure. Cancer. 2021;127(9):1483-1494. doi:10.1002/cncr.33389.",
    "Freyer DR, Lin L, Mack JW, et al. Lack of Concordance in Symptomatic Adverse Event Reporting by Children, Clinicians, and Caregivers: Implications for Cancer Clinical Trials. Journal of Clinical Oncology : Official Journal of the American Society of Clinical Oncology. 2022;40(15):1623-1634. doi:10.1200/JCO.21.02669."
    ]
};
