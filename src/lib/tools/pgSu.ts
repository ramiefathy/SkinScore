
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
  description: "Proposed by Su WP et al., these criteria require both of two major criteria plus at least two of four minor criteria to standardize the diagnosis of pyoderma gangrenosum (PG). In retrospective cohorts, sensitivity is approximately 86.2% and specificity is approximately 69.6%.",
  keywords: ["su", "pyoderma gangrenosum", "diagnostic criteria", "neutrophilic infiltrate", "undermined border", "pathergy"],
  sourceType: 'Research',
  icon: ClipboardList,
  rationale: "The Su Criteria were developed to standardize the diagnosis of pyoderma gangrenosum (PG), a rare neutrophilic dermatosis characterized by chronic, painful ulcerations. Historically, PG has been a diagnosis of exclusion, leading to significant diagnostic uncertainty and misclassification in both clinical practice and research. The Su Criteria were first proposed by Su et al. in 2004 (as referenced in subsequent studies) to provide a reproducible, evidence-based framework for PG diagnosis, facilitating more consistent case ascertainment in clinical trials and epidemiological studies. The Su Criteria consist of one major criterion and eight minor criteria. The major criterion is a biopsy of the ulcer edge demonstrating a neutrophilic infiltrate. The minor criteria include: (1) exclusion of infection, (2) pathergy, (3) history of inflammatory bowel disease or inflammatory arthritis, (4) history of papule, pustule, or vesicle ulcerating within four days of appearing, (5) peripheral erythema, undermining border, and tenderness at ulceration site, (6) multiple ulcerations, at least one on the anterior lower leg, (7) cribriform or “wrinkled paper” scars at healed ulcer sites, and (8) decrease in ulcer size within one month of initiating immunosuppressive medication. A diagnosis of PG is established when the major criterion and at least four of the eight minor criteria are met. The criteria are binary (present/absent) and are not weighted or summed to produce a continuous score.",
  clinicalPerformance: "The Su Criteria have been used in large retrospective cohort studies for case validation. In a comparative study of three diagnostic frameworks (Su, PARACELSUS, Delphi), the Su Criteria identified 74% of expert-validated PG cases, with moderate agreement with other frameworks (Fleiss' kappa 0.44). A separate Delphi consensus study proposed a similar framework and reported sensitivity and specificity of 86% and 90%, respectively, for a set of criteria closely related to the Su Criteria. However, the Su Criteria have not been formally validated in large, prospective, multi-center studies, and their performance may vary depending on the clinical setting and patient population. The lack of a gold standard for PG diagnosis remains a limitation, and the criteria are best used as part of a comprehensive clinical assessment.",
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
    "Ashchyan HJ, Butler DC, Nelson CA, et al. The Association of Age With Clinical Presentation and Comorbidities of Pyoderma Gangrenosum. JAMA Dermatology. 2018;154(4):409-413. doi:10.1001/jamadermatol.2017.5978.",
    "Haag C, Hansen T, Hajar T, et al. Comparison of Three Diagnostic Frameworks for Pyoderma Gangrenosum. The Journal of Investigative Dermatology. 2021;141(1):59-63. doi:10.1016/j.jid.2020.04.019.",
    "Maverakis E, Ma C, Shinkai K, et al. Diagnostic Criteria of Ulcerative Pyoderma Gangrenosum: A Delphi Consensus of International Experts. JAMA Dermatology. 2018;154(4):461-466. doi:10.1001/jamadermatol.2017.5980.",
    "Lu JD, Hobbs MM, Huang WW, Ortega-Loayza AG, Alavi A. Identification and Evaluation of Outcome Measurement Instruments in Pyoderma Gangrenosum: A Systematic Review. The British Journal of Dermatology. 2020;183(5):821-828. doi:10.1111/bjd.19027."
  ]
};
