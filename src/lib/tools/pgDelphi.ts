
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const commonYesNoOptions: InputOption[] = [
  { value: 1, label: "Present" },
  { value: 0, label: "Absent" }
];

const pgDelphiFormSections: FormSectionConfig[] = [
  {
    id: 'pg_delphi_major_criterion_group',
    title: 'Major Criterion (Required)',
    gridCols: 1,
    inputs: [
      {
        id: "pg_delphi_major_biopsy",
        label: "Biopsy of ulcer edge demonstrating a neutrophilic infiltrate without vasculitis or infection",
        type: 'select',
        options: commonYesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', commonYesNoOptions, 0, 1)
      }
    ]
  },
  {
    id: 'pg_delphi_minor_criteria_group',
    title: 'Minor Criteria (Need ≥ 4 to fulfill)',
    gridCols: 1, // Or 2 if preferred for layout
    inputs: [
      { id: "pg_delphi_minor_exclude_infxn", label: "Exclusion of infection by appropriate cultures and/or histology", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_pathergy", label: "History of pathergy (new lesion or ulceration at site of minor trauma or surgery)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_ibd_or_arth", label: "History of inflammatory bowel disease or inflammatory arthritis", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_rapid_ulcer", label: "History of papule, pustule, or vesicle that rapidly ulcerated (≤ 4 days) prior to presentation", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_erythema_border", label: "Peripheral erythema, undermining borders, and tenderness at the ulcer site", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_multiple_ulcers", label: "Multiple ulcerations, at least one located on an anterior lower leg", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_cribriform_scars", label: "Cribriform (‘wrinkled paper’) scars at healed ulcer sites", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_response_immu", label: "Decrease in ulcer size within one month of initiating immunosuppressive medication(s)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  }
];

export const pgDelphiTool: Tool = {
  id: "pg_delphi",
  name: "Delphi Consensus Criteria for Ulcerative Pyoderma Gangrenosum",
  acronym: "Delphi Criteria (PG)",
  condition: "Pyoderma Gangrenosum",
  description: "Developed via a multi-centre Delphi process (2015–2017), these criteria require one major criterion—histopathology showing a neutrophilic infiltrate at the ulcer edge (without evidence of vasculitis or infection)—plus at least four of eight minor criteria. Meeting the major criterion and ≥4 minors yields sensitivity ≈ 86% and specificity ≈ 90% for diagnosing ulcerative PG.",
  keywords: ["delphi", "pyoderma gangrenosum", "ulcerative", "diagnostic criteria", "neutrophilic infiltrate", "pathergy", "inflammatory bowel disease"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: pgDelphiFormSections,
  calculationLogic: (inputs) => {
    const majorBiopsyPresent = Number(inputs.pg_delphi_major_biopsy) || 0;

    const minorCriteriaKeys = [
      "pg_delphi_minor_exclude_infxn",
      "pg_delphi_minor_pathergy",
      "pg_delphi_minor_ibd_or_arth",
      "pg_delphi_minor_rapid_ulcer",
      "pg_delphi_minor_erythema_border",
      "pg_delphi_minor_multiple_ulcers",
      "pg_delphi_minor_cribriform_scars",
      "pg_delphi_minor_response_immu"
    ];

    let minorCriteriaCount = 0;
    const minorCriteriaIndividualScores: Record<string, number> = {};
    minorCriteriaKeys.forEach(key => {
      const val = Number(inputs[key]) || 0;
      minorCriteriaIndividualScores[key] = val;
      minorCriteriaCount += val;
    });

    const meetsDelphiCriteria = majorBiopsyPresent === 1 && minorCriteriaCount >= 4;
    const score = meetsDelphiCriteria ? 1 : 0; // 1 if criteria met, 0 if not

    let interpretation = "";
    if (meetsDelphiCriteria) {
      interpretation = `Meets Delphi Criteria (Major criterion present AND ${minorCriteriaCount} of 8 minor criteria present).\nSensitivity: ~86%, Specificity: ~90%.\nHigh likelihood of true ulcerative PG; supports initiation of immunosuppressive therapy.`;
    } else {
      interpretation = `Does Not Meet Delphi Criteria. Major criterion present: ${majorBiopsyPresent === 1 ? 'Yes' : 'No'}. Minor criteria met: ${minorCriteriaCount} of 8 (requires ≥4).\nConsider alternative diagnoses (e.g., venous stasis ulcer, vasculitis, infection).`;
    }

    return {
      score,
      interpretation,
      details: {
        major_biopsy_present: majorBiopsyPresent,
        minor_criteria_count: minorCriteriaCount,
        minor_criteria_individual_scores: minorCriteriaIndividualScores,
        meets_delphi_criteria: meetsDelphiCriteria
      }
    };
  },
  references: [
    "Maverakis E, Wang E, Shinkai K, et al. Diagnostic Criteria of Ulcerative Pyoderma Gangrenosum: Delphi Consensus. JAMA Dermatol. 2018;154(4):461–466.",
    "Maverakis E, Wang E, Shinkai K, et al. Delphi Consensus on PG: Supplement. JAMA Dermatol. 2018;154(4):S1–S15.",
    "Grimstad J, Nelson CA, Blackmon S, Schleich S. Comparison of PG Diagnostic Frameworks vs Venous Ulcers. J Wound Care. 2020;29(12):732–739.",
    "Weenig RH, Davis MD, Dahl PR, Su WP. Skin Ulcers Misdiagnosed as PG. N Engl J Med. 2002;347(18):1412–1418."
  ]
};
