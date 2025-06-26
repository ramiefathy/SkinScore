
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { CircleDot } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const nrsPruritusTool: Tool = {
  id: "nrs_pruritus",
  name: "Numeric Rating Scale (NRS) for Pruritus",
  acronym: "NRS Pruritus",
  condition: "Pruritus",
  keywords: ["nrs", "numeric rating scale", "pruritus", "itch", "intensity", "patient reported"],
  description: "A unidimensional, patient-reported outcome measure to quantify itch intensity. Patients rate their itch over a specified period (e.g., 24 hours) on an 11-point scale (0 = no itch, 10 = worst imaginable itch). It has strong test-retest reliability (ICC ~0.7–0.8), high validity, and is responsive to clinical change. A 3 to 4-point change is often considered clinically meaningful. Its main limitation is subjectivity and that it only captures intensity, not the multidimensional burden of itch.",
  sourceType: 'Research',
  icon: CircleDot,
  formSections: [
    { id: "nrs_score", label: "NRS Score (0-10)", type: 'number', min:0, max:10, step:1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
  ],
  calculationLogic: (inputs) => {
    const score = Number(inputs.nrs_score) || 0;
    let severity = "";
    if (score === 0) severity = "No itch";
    else if (score <= 3) severity = "Mild itch";
    else if (score <= 6) severity = "Moderate itch";
    else if (score <= 8) severity = "Severe itch";
    else severity = "Very severe itch";

    const interpretation = `NRS for Pruritus: ${score} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, 1-3 Mild, 4-6 Moderate, 7-8 Severe, 9-10 Very severe).`;
    return { score, interpretation, details: { Reported_NRS_Score: score, Assessed_Severity: severity } };
  },
  references: [
      "Phan NQ, Blome C, Fritz F, et al. Assessment of Pruritus Intensity: Prospective Study on Validity and Reliability of the Visual Analogue Scale, Numerical Rating Scale and Verbal Rating Scale in 471 Patients With Chronic Pruritus. Acta Dermato-Venereologica. 2012;92(5):502-7. doi:10.2340/00015555-1246.",
      "Elmets CA, Korman NJ, Prater EF, et al. Joint AAD-NPF Guidelines of Care for the Management and Treatment of Psoriasis With Topical Therapy and Alternative Medicine Modalities for Psoriasis Severity Measures. Journal of the American Academy of Dermatology. 2021;84(2):432-470. doi:10.1016/j.jaad.2020.07.087.",
      "Jang YH, Kim SM, Eun DH, et al. Validity and Reliability of Itch Assessment Scales for Chronic Pruritus in Adults: A Prospective Multicenter Study. Journal of the American Academy of Dermatology. 2020;82(1):80-86. doi:10.1016/j.jaad.2019.06.043.",
      "Kimball AB, Naegeli AN, Edson-Heredia E, et al. Psychometric Properties of the Itch Numeric Rating Scale in Patients With Moderate-to-Severe Plaque Psoriasis. The British Journal of Dermatology. 2016;175(1):157-62. doi:10.1111/bjd.14464.",
      "Rams A, Baldasaro J, Bunod L, et al. Assessing Itch Severity: Content Validity and Psychometric Properties of a Patient-Reported Pruritus Numeric Rating Scale in Atopic Dermatitis. Advances in Therapy. 2024;41(4):1512-1525. doi:10.1007/s12325-024-02802-3.",
      "Topp J, Apfelbacher C, Ständer S, Augustin M, Blome C. Measurement Properties of Patient-Reported Outcome Measures for Pruritus: An Updated Systematic Review. The Journal of Investigative Dermatology. 2022;142(2):343-354. doi:10.1016/j.jid.2021.06.032.",
      "Schoch D, Sommer R, Augustin M, Ständer S, Blome C. Patient-Reported Outcome Measures In Pruritus: A Systematic Review of Measurement Properties. The Journal of Investigative Dermatology. 2017;137(10):2069-2077. doi:10.1016/j.jid.2017.05.020.",
      "Storck M, Sandmann S, Bruland P, et al. Pruritus Intensity Scales Across Europe: A Prospective Validation Study. Journal of the European Academy of Dermatology and Venereology : JEADV. 2021;35(5):1176-1185. doi:10.1111/jdv.17111.",
      "Pereira MP, Zeidler C, Szymczak H, et al. Acceptability and Perceived Benefits of Validated Pruritus Assessment Instruments in the Dermatological Office and Clinic: The perspectives of Patients and Physicians. Journal of the European Academy of Dermatology and Venereology : JEADV. 2024;38(10):1973-1981. doi:10.1111/jdv.20148.",
      "Leshem YA, Chalmers JR, Apfelbacher C, et al. Measuring Atopic Eczema Control and Itch Intensity in Clinical Practice: A Consensus Statement From the Harmonising Outcome Measures for Eczema in Clinical Practice (HOME-CP) Initiative. JAMA Dermatology. 2022;158(12):1429-1435. doi:10.1001/jamadermatol.2022.4211.",
      "Mannix S, Edson-Heredia E, Paller AS, et al. The Experience of Itch in Children With Psoriasis: A Qualitative Exploration of the Itch Numeric Rating Scale. Pediatric Dermatology. 2021;38(2):405-412. doi:10.1111/pde.14403.",
      "Kong HE, Francois S, Smith S, et al. Tools to Study the Severity of Itch in 8- To 17-Year-Old Children: Validation of TweenItchyQoL and ItchyQuant. Pediatric Dermatology. 2021;38(5):1118-1126. doi:10.1111/pde.14662.",
      "Silverberg JI, Leshem YA, Calimlim BM, McDonald J, Litcher-Kelly L. Psychometric Evaluation of the Worst Pruritus Numerical Rating Scale (NRS), Atopic Dermatitis Symptom Scale (ADerm-SS), and Atopic Dermatitis Impact Scale (ADerm-IS). Current Medical Research and Opinion. 2023;39(10):1289-1296. doi:10.1080/03007995.2023.2251883.",
      "Verweyen E, Ständer S, Kreitz K, et al. Validation of a Comprehensive Set of Pruritus Assessment Instruments: The Chronic Pruritus Tools Questionnaire PRURITOOLS. Acta Dermato-Venereologica. 2019;99(7):657-663. doi:10.2340/00015555-3158.",
      "Pereira MP, Ständer S. Assessment of Severity and Burden of Pruritus. Allergology International : Official Journal of the Japanese Society of Allergology. 2017;66(1):3-7. doi:10.1016/j.alit.2016.08.009."
  ]
};
