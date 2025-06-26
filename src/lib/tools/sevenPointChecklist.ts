
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ListChecks } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const sevenPointChecklistVersionOptions: InputOption[] = [{value:"original", label:"Original (All criteria = 1 point)"}, {value:"weighted", label:"Weighted (Major criteria = 2 points, Minor = 1 point)"}];

const majorCriteria = [
  { id: "major_change_size", label: "Change in Size"},
  { id: "major_irregular_shape", label: "Irregular Shape"},
  { id: "major_irregular_color", label: "Irregular Color"},
];

const minorCriteria = [
  { id: "minor_diameter_ge7mm", label: "Diameter >= 7mm"},
  { id: "minor_inflammation", label: "Inflammation"},
  { id: "minor_oozing_crusting", label: "Oozing or Crusting"},
  { id: "minor_change_sensation", label: "Change in Sensation (e.g., itch, pain)"},
];

export const sevenPointChecklistTool: Tool = {
  id: "seven_point_checklist",
  name: "7-Point Checklist for Melanoma",
  acronym: "7-Point Checklist",
  condition: "Melanoma Screening",
  keywords: ["melanoma", "skin cancer", "screening", "checklist", "nevus", "mole"],
  description: "The 7-Point Checklist is a clinical diagnostic aid developed in the United Kingdom to assist non-specialists, particularly general practitioners, in identifying pigmented skin lesions that may be melanoma and require urgent referral.",
  sourceType: 'Clinical Guideline',
  icon: ListChecks,
  rationale: "The checklist comprises three major criteria (change in size, change in shape, change in color) and four minor criteria (inflammation, crusting or bleeding, sensory change, and diameter ≥7 mm). Each major criterion scores 2 points and each minor criterion scores 1 point in the weighted version. A score of 3 or more (original) or 4 or more (weighted) is used as the threshold for referral.",
  clinicalPerformance: "Validation studies in primary care have demonstrated that the 7-Point Checklist performs well in identifying clinically significant lesions and melanoma, with sensitivity for melanoma detection as high as 91.7% and specificity around 53.4% at the revised cut-off. The tool is endorsed by the UK National Institute for Health and Care Excellence (NICE) for use in primary care. The weighted version with a cut-off of 4 improves specificity while maintaining high sensitivity. However, in pediatric populations, conventional criteria lack sensitivity, and pediatric-specific modifications have been proposed but may be less sensitive in some cohorts. Dermoscopy may aid diagnosis in children. Reliability metrics such as interrater agreement are not systematically reported.",
  formSections: [
    { id: "version", label: "Checklist Version", type: 'select', options: sevenPointChecklistVersionOptions, defaultValue:"weighted", validation: getValidationSchema('select')},
    {
      id: "major_criteria_group", title: "Major Criteria", gridCols: 1,
      inputs: majorCriteria.map(crit => ({ ...crit, type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') } as InputConfig))
    },
    {
      id: "minor_criteria_group", title: "Minor Criteria", gridCols: 1,
      inputs: minorCriteria.map(crit => ({ ...crit, type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') } as InputConfig))
    }
  ],
  calculationLogic: (inputs) => {
    let score = 0;
    const presentFeatures: string[] = [];
    const version = inputs.version as "original" | "weighted";

    majorCriteria.forEach(crit => {
      if (inputs[crit.id]) {
        presentFeatures.push(crit.label + " (Major)");
        score += (version === "weighted" ? 2 : 1);
      }
    });
    minorCriteria.forEach(crit => {
      if (inputs[crit.id]) {
        presentFeatures.push(crit.label + " (Minor)");
        score += 1;
      }
    });

    let interpretation = `7-Point Checklist Score (${version}): ${score}. `;
    const needsReferral = (version === 'weighted' && score >= 4) || (version === 'original' && score >= 3);
    if (needsReferral) {
      interpretation += "Urgent referral is recommended.";
    } else {
      interpretation += `Does not meet threshold for urgent referral (Score < ${version === 'weighted' ? 4 : 3}) based on this checklist alone. Clinical correlation advised.`;
    }
    return { score, interpretation, details: { Version: version, Present_Features: presentFeatures.join(', ') || "None" } };
  },
  references: [
    "How Do Malignant Melanomas Present and Does This Correlate With the Seven-Point Check-List?. du Vivier AW, Williams HC, Brett JV, Higgins EM. Clinical and Experimental Dermatology. 1991;16(5):344-7. doi:10.1111/j.1365-2230.1991.tb00397.x.",
    "Using the 7-Point Checklist as a Diagnostic Aid for Pigmented Skin Lesions in General Practice: A Diagnostic Validation Study. Walter FM, Prevost AT, Vasconcelos J, et al. The British Journal of General Practice : The Journal of the Royal College of General Practitioners. 2013;63(610):e345-53. doi:10.3399/bjgp13X667213.",
    "Does This Patient Have a Mole or a Melanoma?. Whited JD, Grichnik JM. JAMA. 1998;279(9):696-701. doi:10.1001/jama.279.9.696.",
    "Pediatric Melanoma: Results of a Large Cohort Study and Proposal for Modified ABCD Detection Criteria for Children. Cordoro KM, Gupta D, Frieden IJ, McCalmont T, Kashani-Sabet M. Journal of the American Academy of Dermatology. 2013;68(6):913-25. doi:10.1016/j.jaad.2012.12.953.",
    "Is Pediatric Melanoma Really That Different From Adult Melanoma? A Multicenter Epidemiological, Clinical and Dermoscopic Study. De Giorgi V, Magnaterra E, Zuccaro B, et al. Cancers. 2023;15(6):1835. doi:10.3390/cancers15061835.",
    "Psychometric and Pragmatic Properties of Social Risk Screening Tools: A Systematic Review. Henrikson NB, Blasi PR, Dorsey CN, et al. American Journal of Preventive Medicine. 2019;57(6 Suppl 1):S13-S24. doi:10.1016/j.amepre.2019.07.012.",
    "Cross-Cultural Modification Strategies for Instruments Measuring Health Beliefs About Cancer Screening: Systematic Review. Lei F, Lee E. JMIR Cancer. 2021;7(4):e28393. doi:10.2196/28393.",
    "Exploring the Barriers to and Facilitators of Implementing CanRisk in Primary Care: A Qualitative Thematic Framework Analysis. Archer S, Donoso FS, Carver T, et al. The British Journal of General Practice : The Journal of the Royal College of General Practitioners. 2023;73(733):e586-e596. doi:10.3399/BJGP.2022.0643.",
    "Most-Cited Patient-Reported Outcome Measures Within Otolaryngology—Revisiting the Minimal Clinically Important Difference: A Review. Peterson AM, Miller B, Ioerger P, et al. JAMA Otolaryngology-- Head & Neck Surgery. 2023;149(3):261-276. doi:10.1001/jamaoto.2022.4703.",
    "A Standard Method for Determining the Minimal Clinically Important Difference for Rehabilitation Measures. Malec JF, Ketchum JM. Archives of Physical Medicine and Rehabilitation. 2020;101(6):1090-1094. doi:10.1016/j.apmr.2019.12.008.",
    "The Minimal Clinically Important Difference Raised the Significance of Outcome Effects Above the Statistical Level, With Methodological Implications for Future Studies. Angst F, Aeschlimann A, Angst J. Journal of Clinical Epidemiology. 2017;82:128-136. doi:10.1016/j.jclinepi.2016.11.016.",
    "Minimal Important Difference to Infer Changes in Health-Related Quality Of life-a Systematic Review. Jayadevappa R, Cook R, Chhatre S. Journal of Clinical Epidemiology. 2017;89:188-198. doi:10.1016/j.jclinepi.2017.06.009."
  ]
};
