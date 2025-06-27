
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
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
        label: "Biopsy of ulcer edge demonstrating a neutrophilic infiltrate",
        type: 'select',
        options: commonYesNoOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', commonYesNoOptions)
      }
    ]
  },
  {
    id: 'pg_delphi_minor_criteria_group',
    title: 'Minor Criteria (Need ≥ 4 to fulfill)',
    gridCols: 1,
    inputs: [
      { id: "pg_delphi_minor_exclude_infxn", label: "1. Exclusion of infection", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_pathergy", label: "2. History of pathergy", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_ibd_or_arth", label: "3. History of inflammatory bowel disease or inflammatory arthritis", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_rapid_ulcer", label: "4. History of papule, pustule, or vesicle that rapidly ulcerated", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_erythema_border", label: "5. Peripheral erythema, undermining borders, and tenderness at the ulcer site", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_multiple_ulcers", label: "6. Multiple ulcerations, at least one located on an anterior lower leg", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_cribriform_scars", label: "7. Cribriform (‘wrinkled paper’) scars at healed ulcer sites", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) },
      { id: "pg_delphi_minor_response_immu", label: "8. Decrease in ulcer size within one month of initiating immunosuppressive medication(s)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions, 0, 1) }
    ]
  }
];

export const pgDelphiTool: Tool = {
  id: "pg_delphi",
  name: "Delphi Consensus Criteria for Ulcerative Pyoderma Gangrenosum",
  acronym: "Delphi Criteria (PG)",
  condition: "Pyoderma Gangrenosum",
  description: "The Delphi consensus criteria provide a standardized diagnostic framework for ulcerative pyoderma gangrenosum (PG), requiring 1 major criterion (biopsy of ulcer edge showing neutrophilic infiltrate) and at least 4 of 8 minor criteria.",
  keywords: ["delphi", "pyoderma gangrenosum", "ulcerative", "diagnostic criteria", "neutrophilic infiltrate", "pathergy", "inflammatory bowel disease"],
  sourceType: 'Research',
  icon: ClipboardList,
  rationale: "The Delphi Consensus Criteria were developed to standardize the diagnosis of ulcerative pyoderma gangrenosum (PG), a rare neutrophilic dermatosis. The rationale was to move from a diagnosis of exclusion to an evidence-based, consensus-driven framework to improve diagnostic accuracy and facilitate research. Diagnosis requires one major criterion (biopsy of ulcer edge demonstrating neutrophilic infiltrate) and at least four of eight minor criteria, which include: exclusion of infection, pathergy, history of inflammatory bowel disease or arthritis, rapid ulceration, characteristic ulcer features, multiple ulcers, cribriform scarring, and response to immunosuppression. The criteria are categorical. The criteria were developed by Maverakis et al. through a Delphi process involving international experts.",
  clinicalPerformance: "Validation studies report sensitivity of 70–85% and specificity of 80–95% compared to expert clinical diagnosis. Inter-rater reliability is generally good, with kappa values above 0.6. The criteria have been validated in both retrospective and prospective cohorts, including diverse populations, but most data are from adult cohorts.\n\nValidation and Comparative Studies\nThe Delphi criteria have been compared to other diagnostic frameworks, such as the PARACELSUS and Su criteria. In a retrospective cohort, the PARACELSUS score identified the highest proportion of PG cases (89%), followed by Delphi and Su criteria (74% each). Multirater agreement among the three frameworks was moderate (Fleiss’ kappa 0.44).\n\nLimitations and Controversies\nThe criteria are based on expert consensus rather than large-scale prospective validation. The major criterion is not unique to PG, and minor criteria may overlap with other diseases. Exclusion of infection can be challenging, and the criteria do not incorporate standardized histopathological or laboratory findings. Generalizability to pediatric and geriatric populations, as well as diverse ethnic groups, requires further study.",
  formSections: pgDelphiFormSections,
  calculationLogic: (inputs) => {
    const majorBiopsyPresent = Number(inputs.pg_delphi_major_biopsy) === 1;

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
    const minorCriteriaDetails: Record<string, string> = {};
    minorCriteriaKeys.forEach((key, index) => {
      const present = Number(inputs[key]) === 1;
      if (present) {
        minorCriteriaCount++;
      }
      minorCriteriaDetails[`Minor_Criterion_${index + 1}`] = present ? "Present" : "Absent";
    });

    const meetsDelphiCriteria = majorBiopsyPresent && minorCriteriaCount >= 4;
    const score = meetsDelphiCriteria ? 1 : 0; // 1 if criteria met, 0 if not

    let interpretationText = "";
    if (meetsDelphiCriteria) {
      interpretationText = `Meets Delphi Criteria for Ulcerative PG (Major criterion present AND ${minorCriteriaCount} of 8 minor criteria met).\nThis indicates a high likelihood of pyoderma gangrenosum (Sensitivity ≈ 86%, Specificity ≈ 90%).`;
    } else {
      interpretationText = `Does Not Meet Delphi Criteria for Ulcerative PG.
Major criterion met: ${majorBiopsyPresent ? 'Yes' : 'No'}.
Minor criteria met: ${minorCriteriaCount} of 8 (Requires ≥ 4).
Consider alternative diagnoses.`;
    }

    return {
      score: score, // "Met" (1) or "Not Met" (0)
      interpretation: interpretationText,
      details: {
        Major_Criterion_Biopsy: majorBiopsyPresent ? "Present" : "Absent",
        Minor_Criteria_Met_Count: minorCriteriaCount,
        ...minorCriteriaDetails,
        Overall_Delphi_Criteria_Status: meetsDelphiCriteria ? "Met" : "Not Met"
      }
    };
  },
  references: [
    "Maverakis E, Ma C, Shinkai K, et al. Diagnostic Criteria of Ulcerative Pyoderma Gangrenosum: A Delphi Consensus of International Experts. JAMA Dermatology. 2018; 154(4):461-466. doi:10.1001/jamadermatol.2017.5980.",
    "Haag C, Hansen T, Hajar T, et al. Comparison of Three Diagnostic Frameworks for Pyoderma Gangrenosum. The Journal of Investigative Dermatology. 2021;141(1):59-63. doi:10.1016/j.jid.2020.04.019.",
    "Lu JD, Hobbs MM, Huang WW, Ortega-Loayza AG, Alavi A. Identification and Evaluation of Outcome Measurement Instruments in Pyoderma Gangrenosum: A Systematic Review. The British Journal of Dermatology. 2020;183(5):821-828. doi:10.1111/bjd.19027.",
    "Jockenhöfer F, Wollina U, Salva KA, Benson S, Dissemond J. The PARACELSUS Score: A Novel Diagnostic Tool for Pyoderma Gangrenosum. The British Journal of Dermatology. 2019;180(3):615-620. doi:10.1111/bjd.16401.",
    "Kamal K, Xia E, Li SJ, et al. Eligibility Criteria for Active Ulcerative Pyoderma Gangrenosum in Clinical Trials: A Delphi Consensus on Behalf of the UPGRADE (Understanding Pyoderma Gangrenosum: Review and Assessment of Disease Effects) Group. The Journal of Investigative Dermatology. 2024;144(6):1295-1300.e6. doi:10.1016/j.jid.2023.12.006."
  ]
};
