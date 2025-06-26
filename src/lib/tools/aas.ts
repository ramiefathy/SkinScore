
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Activity } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const aasSwellingCountOptions: InputOption[] = [
  { value: 0, label: "0 swellings" },
  { value: 1, label: "1 swelling" },
  { value: 2, label: "2–3 swellings" },
  { value: 3, label: "≥4 swellings" }
];
const aasDurationOptions: InputOption[] = [
  { value: 0, label: "<1 hour" },
  { value: 1, label: "1–6 hours" },
  { value: 2, label: "6–12 hours" },
  { value: 3, label: ">12 hours" }
];
const aasSeverityOptions: InputOption[] = [
  { value: 0, label: "0 - None" },
  { value: 1, label: "1 - Mild" },
  { value: 2, label: "2 - Moderate" },
  { value: 3, label: "3 - Severe" }
];
const aasTreatmentOptions: InputOption[] = [
    { value: 0, label: "No extra treatment" },
    { value: 1, label: "Antihistamine dose increase" },
    { value: 2, label: "ER visit or corticosteroids" },
    { value: 3, label: "Hospitalization required" }
];
const aasImpactOptions: InputOption[] = [
    { value: 0, label: "No impact" },
    { value: 1, label: "Mild inconvenience" },
    { value: 2, label: "Moderate, some tasks avoided" },
    { value: 3, label: "Severe, unable to perform many tasks" }
];


export const aasTool: Tool = {
  id: "aas",
  name: "Angioedema Activity Score (AAS)",
  acronym: "AAS",
  condition: "Angioedema",
  keywords: ["aas", "angioedema", "activity score", "patient reported", "urticaria", "swelling"],
  description: "The AAS is a patient-reported outcome measure designed to quantify disease activity in patients with recurrent angioedema. It consists of five items, each scored daily by the patient, reflecting the presence and severity of angioedema symptoms.",
  sourceType: 'Research',
  icon: Activity,
  rationale: "The rationale for its development was the absence of standardized, validated activity measures for angioedema, which is characterized by unpredictable, episodic swelling that can significantly impact quality of life. The AAS consists of five items, each scored daily by the patient, reflecting the presence and severity of angioedema symptoms. The total score is the sum of daily scores over a specified period (e.g., 28 days), providing a continuous measure of disease activity.",
  clinicalPerformance: "The AAS has been validated in multiple adult populations and languages, including Thai and Japanese versions, with studies consistently demonstrating excellent internal consistency (Cronbach’s alpha >0.9), strong test-retest reliability (intraclass correlation coefficient >0.8), and robust convergent and known-groups validity. Sensitivity and specificity are not reported, as the AAS is not a diagnostic tool but a continuous activity measure. The tool is recommended by international guidelines, including those from the European Academy of Allergy and Clinical Immunology, for use in both clinical trials and practice. There is a lack of published validation or comparative studies in pediatric populations, and further research is needed to establish its psychometric properties in children.",
  formSections: [
    {id:"swellingCount", label:"1. Number of angioedema swellings today?", type:"select", options:aasSwellingCountOptions, defaultValue:0, validation:getValidationSchema('select',aasSwellingCountOptions,0,3)},
    {id:"duration", label:"2. Longest swelling duration today?", type:"select", options:aasDurationOptions, defaultValue:0, validation:getValidationSchema('select',aasDurationOptions,0,3)},
    {id:"severity", label:"3. Severity of swelling(s) (pain/functional impact) today?", type:"select", options:aasSeverityOptions, defaultValue:0, validation:getValidationSchema('select',aasSeverityOptions,0,3)},
    {id:"treatment", label:"4. Extra medications needed for angioedema today?", type:"select", options:aasTreatmentOptions, defaultValue:0, validation:getValidationSchema('select',aasTreatmentOptions,0,3)},
    {id:"impact", label:"5. Impact on daily activities today?", type:"select", options:aasImpactOptions, defaultValue:0, validation:getValidationSchema('select',aasImpactOptions,0,3)}
  ],
  calculationLogic: (inputs) => {
      const dailyScore = (Number(inputs.swellingCount)||0) + (Number(inputs.duration)||0) + (Number(inputs.severity)||0) + (Number(inputs.treatment)||0) + (Number(inputs.impact)||0);
      const interpretation = `Daily AAS Score: ${dailyScore} (Range for one day: 0-15).
Higher score indicates more angioedema activity.
Scores are typically summed over a period (e.g., AAS7 for 7 days, range 0-105; AAS28 for 28 days, range 0-420).
Example AAS7 interpretation: <6 low activity, ≥30 severe activity. A 50% drop in AAS28 is a meaningful clinical response.`;
      return {
        score: dailyScore,
        interpretation,
        details: {
          Swelling_Count_Score: inputs.swellingCount,
          Duration_Score: inputs.duration,
          Severity_Score: inputs.severity,
          Treatment_Needed_Score: inputs.treatment,
          Impact_on_Activities_Score: inputs.impact,
          Daily_AAS_Total: dailyScore
        }
      };
  },
  references: [
    "Weller K, Groffik A, Magerl M, et al. Development, Validation, and Initial Results of the Angioedema Activity Score. Allergy. 2013;68(9):1185-92. doi:10.1111/all.12209.",
    "Kulthanan K, Chularojanamontri L, Rujitharanawong C, et al. Angioedema Activity Score (AAS): A Valid and Reliable Tool to Use in Asian Patients. BioMed Research International. 2019;2019:9157895. doi:10.1155/2019/9157895.",
    "Morioke S, Takahagi S, Kawano R, et al. A Validation Study of the Japanese Version of the Angioedema Activity Score (AAS) and the Angioedema Quality of Life Questionnaire (AE-QoL). Allergology International : Official Journal of the Japanese Society of Allergology. 2021;70(4):471-479. doi:10.1016/j.alit.2021.04.006.",
    "Lapiņa L, Kaņepa A, Zolovs M, Buttgereit T, Kurjāne N. Adaptation and Linguistic Validation of Angioedema PROMs in Latvian for Assessing Recurrent Angioedema. Journal of Clinical Medicine. 2025;14(4):1375. doi:10.3390/jcm14041375.",
    "Katelaris CH, Lima H, Marsland A, et al. How to Measure Disease Activity, Impact, and Control in Patients With Recurrent Wheals, Angioedema, or Both. The Journal of Allergy and Clinical Immunology. In Practice. 2021;9(6):2151-2157. doi:10.1016/j.jaip.2021.02.026.",
    "Reshef A, Buttgereit T, Betschel SD, et al. Definition, Acronyms, Nomenclature, and Classification of Angioedema (DANCE): AAAAI, ACAAI, ACARE, and APAAACI DANCE Consensus. The Journal of Allergy and Clinical Immunology. 2024;154(2):398-411.e1. doi:10.1016/j.jaci.2024.03.024.",
    "Krishnamurthy A, Naguwa SM, Gershwin ME. Pediatric Angioedema. Clinical Reviews in Allergy & Immunology. 2008;34(2):250-9. doi:10.1007/s12016-007-8037-y.",
    "Pattanaik D, Lieberman JA. Pediatric Angioedema. Current Allergy and Asthma Reports. 2017;17(9):60. doi:10.1007/s11882-017-0729-7."
    ]
};
