
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
  description: "A weighted diagnostic tool to differentiate pyoderma gangrenosum (PG) from other ulcerative conditions. The score comprises 10 criteria across major (3 pts), minor (2 pts), and additional (1 pt) categories, with a total score range of 0–20. A score of ≥10 strongly suggests PG, showing high sensitivity (~94%) and specificity (~90%) in its original validation against venous ulcers. Further prospective validation is needed to establish broader reliability.",
  keywords: ["paracelsus", "pyoderma gangrenosum", "diagnostic score", "ulcer", "pathergy", "immunosuppressive response"],
  sourceType: 'Research',
  icon: ClipboardList,
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
