
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const vidaActivityOptions: InputOption[] = [
  {value:4, label:"+4 (Active for ≤6 weeks: new lesions and/or spread of existing lesions)"},
  {value:3, label:"+3 (Active for 6 weeks to 3 months)"},
  {value:2, label:"+2 (Active for 3 to 6 months)"},
  {value:1, label:"+1 (Active for 6 to 12 months)"},
  {value:0, label:"0 (Stable for ≥1 year: no new lesions, no spread, no repigmentation)"},
  {value:-1, label:"-1 (Regressive for ≥1 year: spontaneous repigmentation, no new lesions, no spread)"}
];

export const vidaTool: Tool = {
  id: "vida",
  name: "Vitiligo Disease Activity (VIDA) Score",
  acronym: "VIDA",
  condition: "Vitiligo",
  keywords: ["vida", "vitiligo", "activity", "patient reported"],
  description: "The VIDA Score is a clinician-reported outcome measure developed to assess the activity of vitiligo, specifically the degree of disease progression or stability over time. Its purpose is to provide a standardized, semi-quantitative measure of disease activity, which is critical for therapeutic decision-making and for evaluating response to interventions.",
  sourceType: 'Research',
  icon: Activity,
  rationale: "The rationale is to capture the dynamic nature of vitiligo, as disease activity (progression, stability, or regression) is a key determinant of prognosis and treatment strategy. The VIDA Score is based on the patient’s recall of disease activity over a defined period. The most common version uses a 6-point scale, ranging from +4 (active progression in the past 6 weeks) to -1 (stable or regressing for more than 1 year). The score is determined by clinician interview and patient history, and there are no constituent subscores.",
  clinicalPerformance: "There are no direct validation or comparative studies of the VIDA Score in either adult or pediatric populations in the current literature set. Recent systematic reviews and scoping studies of clinician-reported outcome measures for vitiligo have identified a range of instruments for assessing disease extent, repigmentation, and activity, but the VIDA Score is not among those with robust psychometric evaluation. Instead, newer instruments such as the Vitiligo Disease Activity Score (VDAS), Vitiligo Disease Improvement Score (VDIS), and Vitiligo Signs of Activity Score (VSAS) have undergone more comprehensive validation, demonstrating good to excellent inter- and intrarater reliability, content and construct validity, and feasibility. There are no published real-world, post-marketing, or registry-based validation studies specifically evaluating the reliability or clinical utility of the VIDA Score in routine clinical practice for either adults or children. The absence of pediatric-specific validation data is a significant limitation, and clinicians must rely on extrapolation from adult studies or use alternative measures when assessing disease activity in pediatric vitiligo. No data are available regarding the sensitivity, specificity, or responsiveness of the VIDA Score in either clinical trials or real-world practice. The lack of direct validation studies precludes any assessment of its psychometric properties in these domains.",
  formSections: [
    { id:"activity_status", label:"Current Vitiligo Activity Status", type:"select",
      options: vidaActivityOptions,
      defaultValue:0, validation:getValidationSchema('select',vidaActivityOptions,-1,4)
    }
  ],
  calculationLogic: (inputs) => {
      const score = Number(inputs.activity_status);
      const scoreLabel = vidaActivityOptions.find(opt => opt.value === score)?.label || "Invalid score";

      let interpretation = `VIDA Score: ${score < 0 ? '' : '+'}${score}. (${scoreLabel}). `;
      if (score > 0) interpretation += "Indicates active disease.";
      else if (score === 0) interpretation += "Indicates stable disease.";
      else interpretation += "Indicates regressive disease with spontaneous repigmentation.";
      return { score, interpretation, details: { vida_description: scoreLabel } };
  },
  references: [
    "van Geel N, Duponselle J, Delbaere L, et al. Clinician-Reported Outcome Measures for the Assessment of Vitiligo: A Scoping Review. Journal of the European Academy of Dermatology and Venereology : JEADV. 2023;37(11):2231-2242. doi:10.1111/jdv.19448.",
    "Duponselle J, Herbelet S, Delbaere L, et al. A Quality Analysis of the Measurement Properties of the Clinician-Reported Outcome Measures for Vitiligo and of the Studies Assessing Them: A Systematic Review. Journal of Clinical Medicine. 2025;14(8):2548. doi:10.3390/jcm14082548.",
    "van Geel N, Depaepe L, Vandaele V, et al. Assessing the Dynamic Changes in Vitiligo: Reliability and Validity of the Vitiligo Disease Activity Score (VDAS) and Vitiligo Disease Improvement Score (VDIS). Journal of the European Academy of Dermatology and Venereology : JEADV. 2022;36(8):1334-1341. doi:10.1111/jdv.18134.",
    "van Geel N, Delbaere L, Mertens L, et al. Exploring the Severity Strata of Disease Activity and Repigmentation in Vitiligo Based on Validated Physician Global Assessment (PGA) Scores. Journal of Clinical Medicine. 2024;13(9):2680. doi:10.3390/jcm13092680.",
    "Rowen D, Keetharuth AD, Poku E, et al. A Review of the Psychometric Performance of Selected Child and Adolescent Preference-Based Measures Used to Produce Utilities for Child and Adolescent Health. Value in Health : The Journal of the International Society for Pharmacoeconomics and Outcomes Research. 2021;24(3):443-460. doi:10.1016/j.jval.2020.09.012.",
    "Jones R, O'Loughlin R, Xiong X, et al. Comparative Psychometric Performance of Common Generic Paediatric Health-Related Quality of Life Instrument Descriptive Systems: Results From the Australian Paediatric Multi-Instrument Comparison Study. PharmacoEconomics. 2024;42(Suppl 1):39-55. doi:10.1007/s40273-023-01330-2.",
    "Kenzik KM, Tuli SY, Revicki DA, Shenkman EA, Huang IC. Comparison of 4 Pediatric Health-Related Quality-of-Life Instruments: A Study on a Medicaid Population. Medical Decision Making : An International Journal of the Society for Medical Decision Making. 2014;34(5):590-602. doi:10.1177/0272989X14529846.",
    "O'Loughlin R, Jones R, Chen G, et al. Comparing the Psychometric Performance of Generic Paediatric Health-Related Quality of Life Instruments in Children and Adolescents With ADHD, Anxiety and/or Depression. PharmacoEconomics. 2024;42(Suppl 1):57-77. doi:10.1007/s40273-024-01354-2.",
    "Raat H, Mohangoo AD, Grootenhuis MA. Pediatric Health-Related Quality of Life Questionnaires in Clinical Trials. Current Opinion in Allergy and Clinical Immunology. 2006;6(3):180-5. doi:10.1097/01.all.0000225157.67897.c2.",
    "Perry N, Boulton KA, Hodge A, et al. A Psychometric Investigation of Health-Related Quality of Life Measures for Paediatric Neurodevelopment Assessment: Reliability and Concurrent Validity of the PEDS-QL, CHU-9D, and the EQ-5D-Y. Autism Research : Official Journal of the International Society for Autism Research. 2024;17(5):972-988. doi:10.1002/aur.3127.",
    "Mihalopoulos C, Chen G, Scott JG, et al. Assessing Outcomes for Cost-Utility Analysis in Children and Adolescents With Mental Health Problems: Are Multiattribute Utility Instruments Fit for Purpose?. Value in Health : The Journal of the International Society for Pharmacoeconomics and Outcomes Research. 2023;26(5):733-741. doi:10.1016/j.jval.2022.12.007.",
    "Magakwe TSS, Hansraj R, Xulu-Kasaba ZN. Vision-Specific Tools for the Assessment of Health-Related Quality of Life (HR-QoL) in Children and Adolescents With Visual Impairment: A Scoping Review. International Journal of Environmental Research and Public Health. 2024;21(8):1009. doi:10.3390/ijerph21081009.",
    "Barthel D, Otto C, Nolte S, et al. The Validation of a Computer-Adaptive Test (CAT) for Assessing Health-Related Quality of Life in Children and Adolescents in a Clinical Sample: Study Design, Methods and First Results of the Kids-Cat Study. Quality of Life Research : An International Journal of Quality of Life Aspects of Treatment, Care and Rehabilitation. 2017;26(5):1105-1117. doi:10.1007/s11136-016-1437-9.",
    "Hettiarachchi RM, Kularatna S, Byrnes J, Scuffham PA. Pediatric Quality of Life Instruments in Oral Health Research: A Systematic Review. Value in Health : The Journal of the International Society for Pharmacoeconomics and Outcomes Research. 2019;22(1):129-135. doi:10.1016/j.jval.2018.06.019."
    ]
};
