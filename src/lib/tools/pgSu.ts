
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const commonYesNoOptions: InputOption[] = [
  { value: 1, label: "Present" },
  { value: 0, label: "Absent" }
];

const pgSuFormSections: FormSectionConfig[] = [
  {
    id: 'pg_su_major_criteria_group',
    title: 'Major Criteria (Both Required)',
    gridCols: 1,
    inputs: [
      { id: "pg_su_major_rapid_ulcer", label: "Rapid progression of a painful, necrolytic cutaneous ulcer with irregular, violaceous, undermined border", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_su_major_biopsy_neutrophil", label: "Biopsy of ulcer edge showing sterile neutrophilic infiltrate (no evidence of vasculitis or infection)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  },
  {
    id: 'pg_su_minor_criteria_group',
    title: 'Minor Criteria (Need ≥ 2)',
    gridCols: 1,
    inputs: [
      { id: "pg_su_minor_exclude_infxn", label: "Exclusion of infection via appropriate cultures and histopathology", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_su_minor_pathergy", label: "Pathergy phenomenon (new lesion at site of minor trauma, extending beyond the original injury)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_su_minor_history_ibd_arth", label: "History of inflammatory bowel disease, inflammatory arthritis, or hematologic malignancy", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_su_minor_characteristic_clinical", label: "Characteristic clinical features: multiple ulcers (≥ 1 on anterior lower leg), peripheral erythema, undermined borders", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  }
];

export const pgSuTool: Tool = {
  id: "pg_su",
  name: "Su Criteria for Pyoderma Gangrenosum",
  acronym: "Su Criteria (PG)",
  condition: "Pyoderma Gangrenosum",
  description: "Proposed by Su WP et al. (2004, Mayo Clinic), these criteria require both of two major criteria plus at least two of four minor criteria. In retrospective cohorts, sensitivity ≈ 86.2% and specificity ≈ 69.6%.",
  keywords: ["su", "pyoderma gangrenosum", "diagnostic criteria", "neutrophilic infiltrate", "undermined border", "pathergy"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: pgSuFormSections,
  calculationLogic: (inputs) => {
    const majorRapidUlcer = Number(inputs.pg_su_major_rapid_ulcer) || 0;
    const majorBiopsyNeutrophil = Number(inputs.pg_su_major_biopsy_neutrophil) || 0;
    const majorOK = majorRapidUlcer === 1 && majorBiopsyNeutrophil === 1;

    const minorCriteriaKeys = [
      "pg_su_minor_exclude_infxn",
      "pg_su_minor_pathergy",
      "pg_su_minor_history_ibd_arth",
      "pg_su_minor_characteristic_clinical"
    ];

    let minorCriteriaCount = 0;
    const minorCriteriaIndividualScores: Record<string, number> = {};
    minorCriteriaKeys.forEach(key => {
      const val = Number(inputs[key]) || 0;
      minorCriteriaIndividualScores[key] = val;
      minorCriteriaCount += val;
    });

    const meetsSuCriteria = majorOK && minorCriteriaCount >= 2;
    const score = meetsSuCriteria ? 1 : 0; // 1 if criteria met, 0 if not

    let interpretation = "";
    if (meetsSuCriteria) {
      interpretation = `Meets Su Criteria (Both major criteria present AND ${minorCriteriaCount} of 4 minor criteria present).\nSensitivity: ~86.2%, Specificity: ~69.6%.\nSupports clinical diagnosis of PG.`;
    } else {
      interpretation = `Does Not Meet Su Criteria. Both major criteria met: ${majorOK ? 'Yes' : 'No'}. Minor criteria met: ${minorCriteriaCount} of 4 (requires ≥2).\nSuggests alternative etiologies (e.g., infection, vasculitis, malignancy).`;
    }

    return {
      score,
      interpretation,
      details: {
        major_rapid_ulcer: majorRapidUlcer,
        major_biopsy_neutrophil: majorBiopsyNeutrophil,
        minor_criteria_count: minorCriteriaCount,
        minor_criteria_individual_scores: minorCriteriaIndividualScores,
        meets_su_criteria: meetsSuCriteria
      }
    };
  },
  references: [
    "Su WP, Davis MD, Weenig RH, Powell FC, Perry HO. Pyoderma Gangrenosum: Clinicopathologic Correlation and Proposed Diagnostic Criteria. Int J Dermatol. 2004;43(11):790–800.",
    "Weenig RH, Davis MD, Dahl PR, Su WP. Skin Ulcers Misdiagnosed as PG. N Engl J Med. 2002;347(18):1412–1418.",
    "Grimstad J, Nelson CA, Blackmon S, Schleich S. Comparison of Three PG Diagnostic Frameworks. J Wound Care. 2020;29(12):732–739."
  ]
};
