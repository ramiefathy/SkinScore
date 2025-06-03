
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ShieldQuestion } from 'lucide-react';
import { getValidationSchema, ctcaeCriteriaSnippets, ctcaeAdverseEventOptions as skinAdverseEventOptions } from '../toolValidation';

const ctcaeGradeOptions: InputOption[] = [
  { value: 1, label: "Grade 1" }, { value: 2, label: "Grade 2" }, { value: 3, label: "Grade 3" },
  { value: 4, label: "Grade 4" }, { value: 5, label: "Grade 5" }
];

export const ctcaeSkinTool: Tool = {
  id: "ctcae_skin",
  name: "CTCAE - Skin Toxicities",
  acronym: "CTCAE Skin",
  description: "Standardized grading of dermatologic Adverse Events (AEs) using the Common Terminology Criteria for Adverse Events. Select an AE and then its grade.",
  condition: "Adverse Drug Reactions",
  keywords: ["ctcae", "skin toxicity", "adverse event", "drug reaction", "grading", "chemotherapy", "oncology"],
  sourceType: 'Clinical Guideline',
  icon: ShieldQuestion,
  formSections: [
    {
      id: "ae_term_select",
      label: "Select Cutaneous Adverse Event",
      type: 'select',
      options: skinAdverseEventOptions,
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
    const gradeMap: Record<number, string> = { 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Life-threatening", 5: "Death" };

    let aeSpecificCriteria = "N/A";
    if (ctcaeCriteriaSnippets[selectedAe] && ctcaeCriteriaSnippets[selectedAe][grade]) {
        aeSpecificCriteria = ctcaeCriteriaSnippets[selectedAe][grade];
    } else if (ctcaeCriteriaSnippets[selectedAe] && !ctcaeCriteriaSnippets[selectedAe][grade] && (grade === 4 || grade === 5)) {
        if (grade === 4 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Life-threatening consequences; urgent intervention indicated.";
        else if (grade === 5 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Death related to AE.";
        else aeSpecificCriteria = `Grade ${grade} (${gradeMap[grade] || 'N/A'}) for ${selectedAe}. Refer to CTCAE manual.`;
    } else if (selectedAe === "Other") {
        aeSpecificCriteria = `Grade ${grade} (${gradeMap[grade] || 'N/A'}) for "Other" AE. Document specific criteria manually.`;
    } else {
        aeSpecificCriteria = `Criteria for ${selectedAe} Grade ${grade} not pre-defined in this tool's snippets. Grade ${grade} generally corresponds to: ${gradeMap[grade] || 'N/A'}. Refer to full CTCAE manual.`;
    }

    const interpretation = `Adverse Event: ${selectedAe}\nCTCAE Grade: ${grade} (${gradeMap[grade] || 'N/A'})\nCriteria Summary: ${aeSpecificCriteria}\n(Refer to full CTCAE v5.0/v6.0 documentation for complete definitions and all terms.)`;

    return {
        score: grade,
        interpretation,
        details: {
          Adverse_Event_Term: selectedAe,
          Selected_Grade: grade,
          Grade_Description: gradeMap[grade] || "N/A",
          Criteria_Summary: aeSpecificCriteria
        }
    };
  },
  references: ["National Cancer Institute (NCI). Common Terminology Criteria for Adverse Events (CTCAE). (Current version should be cited, e.g., v5.0, v6.0)"]
};
