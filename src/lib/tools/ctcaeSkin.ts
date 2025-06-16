
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
  description: "The CTCAE is a standardized tool developed by the National Cancer Institute for grading the severity of adverse events, including dermatologic toxicities, in oncology clinical trials. Its purpose is to ensure uniform reporting and facilitate clinical decision-making regarding cancer therapy modifications. Skin toxicities are graded on a 5-point scale (Grade 1: mild, Grade 2: moderate, Grade 3: severe, Grade 4: life-threatening, Grade 5: death). Each skin event (e.g., rash, pruritus, hand-foot syndrome) has specific criteria for each grade, based on extent, symptoms, and impact on function. Calculation is categorical, not formulaic, and relies on clinician assessment of defined criteria for each event and grade.",
  condition: "Adverse Drug Reactions",
  keywords: ["ctcae", "skin toxicity", "adverse event", "drug reaction", "grading", "chemotherapy", "oncology", "NCI"],
  sourceType: 'Clinical Guideline',
  icon: ShieldQuestion,
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
    "Chen AP, Setser A, Anadkat MJ, et al. Grading Dermatologic Adverse Events of Cancer Treatments: The Common Terminology Criteria for Adverse Events Version 4.0. Journal of the American Academy of Dermatology. 2012;67(5):1025-39. doi:10.1016/j.jaad.2012.02.010.",
    "Shaigany S, Mastacouris N, Tannenbaum R, et al. Outcome Measurement Instruments Used to Evaluate Dermatologic Adverse Events in Cancer Trials: A Systematic Review. JAMA Dermatology. 2024;160(6):651-657. doi:10.1001/jamadermatol.2024.0053.",
    "Atherton PJ, Burger KN, Loprinzi CL, et al. Using the Skindex-16 and Common Terminology Criteria for Adverse Events to Assess Rash Symptoms: Results of a Pooled-Analysis (N0993). Supportive Care in Cancer : Official Journal of the Multinational Association of Supportive Care in Cancer. 2012;20(8):1729-35. doi:10.1007/s00520-011-1266-x.",
    "Basch E, Becker C, Rogak LJ, et al. Composite Grading Algorithm for the National Cancer Institute's Patient-Reported Outcomes Version of the Common Terminology Criteria for Adverse Events (PRO-CTCAE). Clinical Trials (London, England). 2021;18(1):104-114. doi:10.1177/1740774520975120.",
    "National Cancer Institute (NCI). Common Terminology Criteria for Adverse Events (CTCAE). (Current version should be cited, e.g., v5.0, v6.0)"
    ]
};
