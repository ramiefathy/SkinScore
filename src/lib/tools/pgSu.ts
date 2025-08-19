
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
      { id: "pg_su_major_rapid_ulcer", label: "Rapid progression of a painful, necrolytic cutaneous ulcer with irregular, violaceous, undermined border", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "pg_su_major_biopsy_exclusion", label: "Other causes of cutaneous ulceration have been excluded", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) }
    ]
  },
  {
    id: 'pg_su_minor_criteria_group',
    title: 'Minor Criteria (Need ≥ 2)',
    gridCols: 1,
    inputs: [
      { id: "pg_su_minor_pathergy", label: "History suggestive of pathergy or clinical finding of cribriform scarring", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "pg_su_minor_history_ibd_arth", label: "History of systemic diseases associated with PG (IBD, RA, paraproteinemia)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "pg_su_minor_histo", label: "Histopathology (Neutrophilic infiltrate, +/- vasculitis)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "pg_su_minor_response_immu", label: "Rapid response to systemic corticosteroid therapy", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) }
    ]
  }
];

export const pgSuTool: Tool = {
  id: "pg_su",
  name: "Su Criteria for Pyoderma Gangrenosum",
  acronym: "Su Criteria (PG)",
  condition: "Pyoderma Gangrenosum",
  description: "The Su Criteria were developed to standardize the diagnosis of pyoderma gangrenosum (PG), a rare neutrophilic dermatosis often diagnosed by exclusion. It provides a reproducible, evidence-based framework for PG diagnosis.",
  keywords: ["su", "pyoderma gangrenosum", "diagnostic criteria", "neutrophilic infiltrate", "undermined border", "pathergy"],
  sourceType: 'Research',
  icon: ClipboardList,
  rationale: "The Su Criteria were developed to standardize the diagnosis of pyoderma gangrenosum (PG), a rare neutrophilic dermatosis characterized by chronic, painful ulcerations. Historically, PG has been a diagnosis of exclusion, leading to significant diagnostic uncertainty and misclassification in both clinical practice and research. The criteria require both of two major criteria (rapidly progressive ulcer and exclusion of other causes) plus at least two of four minor criteria (pathergy/cribriform scars, associated systemic disease, characteristic ulcer history, and rapid response to steroids).",
  clinicalPerformance: "The Su Criteria have been used in large retrospective cohort studies for case validation. In a comparative study of three diagnostic frameworks (Su, PARACELSUS, Delphi), the Su Criteria identified 74% of expert-validated PG cases, with moderate agreement with other frameworks (Fleiss' kappa 0.44). A separate Delphi consensus study proposed a similar framework and reported sensitivity and specificity of 86% and 90%, respectively, for a set of criteria closely related to the Su Criteria. However, the Su Criteria have not been formally validated in large, prospective, multi-center studies, and their performance may vary depending on the clinical setting and patient population. The lack of a gold standard for PG diagnosis remains a limitation, and the criteria are best used as part of a comprehensive clinical assessment.",
  formSections: pgSuFormSections,
  calculationLogic: (inputs) => {
    const majorRapidUlcer = Number(inputs.pg_su_major_rapid_ulcer) || 0;
    const majorBiopsyExclusion = Number(inputs.pg_su_major_biopsy_exclusion) || 0;
    const majorOK = majorRapidUlcer === 1 && majorBiopsyExclusion === 1;

    const minorCriteriaKeys = [
      "pg_su_minor_pathergy",
      "pg_su_minor_history_ibd_arth",
      "pg_su_minor_histo",
      "pg_su_minor_response_immu"
    ];

    let minorCriteriaCount = 0;
    const minorCriteriaIndividualScores: Record<string, number> = {};
    minorCriteriaKeys.forEach(key => {
      const val = Number(inputs[key]) || 0;
      minorCriteriaIndividualScores[key] = val;
      minorCriteriaCount += val;
    });

    const meetsSuCriteria = majorOK && minorCriteriaCount >= 2;
    const score = meetsSuCriteria ? 1 : 0;

    let interpretation = "";
    if (meetsSuCriteria) {
      interpretation = `Meets Su Criteria (Both major criteria present AND ${minorCriteriaCount} of 4 minor criteria present).\nSupports clinical diagnosis of PG.`;
    } else {
      interpretation = `Does Not Meet Su Criteria. Both major criteria met: ${majorOK ? 'Yes' : 'No'}. Minor criteria met: ${minorCriteriaCount} of 4 (requires ≥2).\nSuggests alternative etiologies (e.g., infection, vasculitis, malignancy).`;
    }

    return {
      score,
      interpretation,
      details: {
        major_rapid_ulcer: majorRapidUlcer,
        major_biopsy_exclusion: majorBiopsyExclusion,
        minor_criteria_count: minorCriteriaCount,
        minor_criteria_individual_scores: minorCriteriaIndividualScores,
        meets_su_criteria: meetsSuCriteria
      }
    };
  },
  references: [
    "Su WP, Davis MD, Weenig RH, Powell FC, Perry HO. Pyoderma gangrenosum: clinicopathologic correlation and proposed diagnostic criteria. Int J Dermatol. 2004;43(11):790-800.",
    "Ashchyan HJ, Butler DC, Nelson CA, et al. The Association of Age With Clinical Presentation and Comorbidities of Pyoderma Gangrenosum. JAMA Dermatology. 2018;154(4):409-413. doi:10.1001/jamadermatol.2017.5978.",
    "Haag C, Hansen T, Hajar T, et al. Comparison of Three Diagnostic Frameworks for Pyoderma Gangrenosum. The Journal of Investigative Dermatology. 2021;141(1):59-63. doi:10.1016/j.jid.2020.04.019.",
    "Maverakis E, Ma C, Shinkai K, et al. Diagnostic Criteria of Ulcerative Pyoderma Gangrenosum: A Delphi Consensus of International Experts. JAMA Dermatology. 2018;154(4):461-466. doi:10.1001/jamadermatol.2017.5980.",
    "Lu JD, Hobbs MM, Huang WW, Ortega-Loayza AG, Alavi A. Identification and Evaluation of Outcome Measurement Instruments in Pyoderma Gangrenosum: A Systematic Review. The British Journal of Dermatology. 2020;183(5):821-828. doi:10.1111/bjd.19027."
  ]
};
