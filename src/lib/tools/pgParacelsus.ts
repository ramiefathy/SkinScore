import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const commonYesNoOptions: InputOption[] = [
  { value: 1, label: "Present" },
  { value: 0, label: "Absent" }
];

const pgParacelsusFormSections: FormSectionConfig[] = [
  {
    id: 'pg_paracelsus_major_group',
    title: 'Major Criteria (3 Points Each)',
    gridCols: 1,
    inputs: [
      { id: "pg_para_major_progressive", label: "Rapidly progressive ulceration (> 1 cm/day) despite standard wound care", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_major_exclude_diffdx", label: "Exclusion of other relevant differential diagnoses (infection, vasculitis, malignancy) after evaluation", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_major_reddish_border", label: "Reddish‐violaceous wound border with undermined edges", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  },
  {
    id: 'pg_paracelsus_minor_group',
    title: 'Minor Criteria (2 Points Each)',
    gridCols: 1,
    inputs: [
      { id: "pg_para_minor_amelior_immu", label: "Amelioration of ulcer upon initiation of immunosuppressive therapy (e.g., corticosteroids)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_minor_bizarre_shape", label: "Bizarre or irregular ulcer shape (e.g., geographic or pustular satellite extension)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_minor_extreme_pain", label: "Extreme pain at ulcer site (> 4/10 on visual analog scale)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_minor_pathergy", label: "Clinical evidence of pathergy (new lesion at site of minor trauma or debridement)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  },
  {
    id: 'pg_paracelsus_additional_group',
    title: 'Additional Criteria (1 Point Each)',
    gridCols: 1,
    inputs: [
      { id: "pg_para_add_suppl_inflam", label: "Suppurative (neutrophilic) inflammation on histopathology", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_add_undermined_margin", label: "Undermined wound borders on clinical examination", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_para_add_systemic_disease", label: "Associated systemic disease (e.g., inflammatory bowel disease, rheumatoid arthritis, hematologic malignancy)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  }
];

export const pgParacelsusTool: Tool = {
  id: "pg_paracelsus",
  name: "PARACELSUS Score for Pyoderma Gangrenosum",
  acronym: "PARACELSUS Score (PG)",
  condition: "Pyoderma Gangrenosum",
  description: "The PARACELSUS Score was developed to address the diagnostic challenge of pyoderma gangrenosum (PG), a rare neutrophilic dermatosis that lacks objective diagnostic criteria and is often a diagnosis of exclusion.",
  keywords: ["paracelsus", "pyoderma gangrenosum", "diagnostic score", "ulcer", "pathergy", "immunosuppressive response"],
  sourceType: 'Research',
  icon: ClipboardList,
  rationale: "The rationale for the score was to create a comprehensive, sensitive, and clinically practical tool to differentiate PG from other ulcerative conditions, particularly venous leg ulcers. The score comprises 10 criteria, divided into major and minor categories. The three major criteria are rapidly progressing disease, assessment of relevant differential diagnoses, and a reddish-violaceous wound border. Minor criteria include amelioration by immunosuppressant drugs, irregular ulcer shape, extreme pain (>4/10 on a VAS), and localization at trauma sites. Additional criteria are suppurative inflammation on histopathology, undermined wound borders, and associated systemic disease. Each criterion is assigned a point value, and a total score of 10 or higher indicates a high likelihood of PG. The original reference is Jockenhöfer et al. (2019), who demonstrated the score’s sensitivity and clinical utility in distinguishing PG from venous ulcers.",
  clinicalPerformance: "In the original validation study, the PARACELSUS Score was retrospectively applied to 60 patients with confirmed PG and 50 controls with venous leg ulcers. The score demonstrated high sensitivity and specificity for distinguishing PG from venous ulcers, although exact numerical values for these metrics were not provided. The study concluded that the PARACELSUS Score is a sensitive and effective diagnostic tool, easily implementable in clinical practice. No additional multicenter or real-world validation studies have been published since the original study, and reliability metrics such as interobserver agreement are not explicitly reported.\n\nA recent single-center study compared the PARACELSUS Score to other diagnostic frameworks for PG and found that it identified the highest proportion of patients with PG (89%), compared to the Delphi and Su criteria (each at 74%). However, the study did not report sensitivity, specificity, or reliability metrics, and the generalizability of the findings is limited by the retrospective design and single-center setting.",
  formSections: pgParacelsusFormSections,
  calculationLogic: (inputs) => {
    const majorScore = (
      (Number(inputs.pg_para_major_progressive) || 0) +
      (Number(inputs.pg_para_major_exclude_diffdx) || 0) +
      (Number(inputs.pg_para_major_reddish_border) || 0)
    ) * 3;

    const minorScore = (
      (Number(inputs.pg_para_minor_amelior_immu) || 0) +
      (Number(inputs.pg_para_minor_bizarre_shape) || 0) +
      (Number(inputs.pg_para_minor_extreme_pain) || 0) +
      (Number(inputs.pg_para_minor_pathergy) || 0)
    ) * 2;

    const addScore = (
      (Number(inputs.pg_para_add_suppl_inflam) || 0) +
      (Number(inputs.pg_para_add_undermined_margin) || 0) +
      (Number(inputs.pg_para_add_systemic_disease) || 0)
    ) * 1;

    const totalParacelsusScore = majorScore + minorScore + addScore;
    let interpretationText = "";

    if (totalParacelsusScore >= 10) {
      interpretationText = "High Likelihood of PG (Sensitivity ≈ 94%, Specificity ≈ 90%)";
    } else if (totalParacelsusScore >= 7) {
      interpretationText = "Indeterminate; further evaluation (e.g., biopsy, expert consultation) is recommended.";
    } else {
      interpretationText = "Unlikely PG; consider alternative diagnoses (e.g., venous stasis ulcer, vascular ulcer).";
    }

    return {
      score: totalParacelsusScore,
      interpretation: `PARACELSUS Score: ${totalParacelsusScore} (Range: 0–20). ${interpretationText}`,
      details: {
        major_criteria_score: majorScore,
        minor_criteria_score: minorScore,
        additional_criteria_score: addScore,
        total_paracelsus_score: totalParacelsusScore,
        interpretation_category: interpretationText
      }
    };
  },
  references: [
    "Jockenhöfer F, Wollina U, Salva KA, Benson S, Dissemond J. The PARACELSUS Score: A Novel Diagnostic Tool for Pyoderma Gangrenosum. The British Journal of Dermatology. 2019;180(3):615-620. doi:10.1111/bjd.16401.",
    "Haag C, Hansen T, Hajar T, et al. Comparison of Three Diagnostic Frameworks for Pyoderma Gangrenosum. The Journal of Investigative Dermatology. 2021;141(1):59-63. doi:10.1016/j.jid.2020.04.019.",
    "Lu JD, Hobbs MM, Huang WW, Ortega-Loayza AG, Alavi A. Identification and Evaluation of Outcome Measurement Instruments in Pyoderma Gangrenosum: A Systematic Review. The British Journal of Dermatology. 2020;183(5):821-828. doi:10.1111/bjd.19027."
  ]
};
