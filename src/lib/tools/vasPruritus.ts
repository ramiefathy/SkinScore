
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const vasPruritusTool: Tool = {
  id: "vas_pruritus",
  name: "Visual Analogue Scale (VAS) for Pruritus",
  acronym: "VAS Pruritus",
  condition: "Pruritus",
  keywords: ["vas", "visual analogue scale", "pruritus", "itch", "intensity", "patient reported"],
  description: "The VAS Pruritus is a unidimensional, patient-reported outcome measure designed to quantify the intensity of itch. Its primary purpose is to provide a simple, rapid, and reproducible method for patients to communicate the severity of their pruritus, which is inherently subjective and difficult to quantify objectively.",
  sourceType: 'Research',
  icon: SlidersHorizontal,
  rationale: "The VAS is typically presented as a 100-mm horizontal or vertical line, anchored by descriptors at each end (e.g., \"no itch\" at 0 mm and \"worst imaginable itch\" at 100 mm). Patients are instructed to mark a point on the line that best represents their itch intensity over a specified recall period, commonly the past 24 hours. The score is calculated by measuring the distance in millimeters from the \"no itch\" anchor to the patient's mark, yielding a value from 0 to 100. The VAS provides a single, continuous measure of itch intensity and does not have constituent subscores. The VAS has been widely used in symptom assessment for decades, but its application to pruritus was systematically validated by Reich et al., who demonstrated its reliability and validity in a large, multinational cohort of patients with pruritic dermatoses. Additional validation and comparative studies, such as those by Phan et al., have reinforced its psychometric properties in the context of pruritus.",
  clinicalPerformance: "Multiple studies have established the VAS as a reliable and valid measure of pruritus intensity. Reich et al. found very good reproducibility (intraclass correlation coefficient [ICC] > 0.8) and strong concurrent validity with other intensity scales such as the Numeric Rating Scale (NRS) and Verbal Rating Scale (VRS). Phan et al. reported high reliability and concurrent validity (r > 0.8, p < 0.01) for the VAS, NRS, and VRS, with high inter-scale correlations and minimal missing data. Jang et al. confirmed strong correlation and similar retest reliability between VAS, NRS, and VRS in a large multicenter study. Systematic reviews have consistently rated the VAS (horizontal format) as one of the most appropriate patient-reported outcome measures for pruritus, with adequate reliability and validity for use in clinical trials. The VAS is also included in comprehensive pruritus assessment batteries, such as PRURITOOLS, which demonstrated excellent test-retest reliability (ICC 0.84–1) and strong convergent validity with other pruritus measures. The VAS has been validated in real-world, multicenter, and practice-based studies across Europe and Asia, confirming its reproducibility and internal consistency in diverse clinical settings and patient populations. The VAS for \"worst itch in the last 24 hours\" was found to be the most reproducible and consistent across languages and disease types. In a large German study, both patients and physicians rated the VAS as highly feasible and useful for routine clinical care, supporting its integration into daily workflows. The European Academy of Dermatology and Venereology (EADV) Task Force Pruritus has prioritized the VAS as a primary tool for routine clinical assessment of itch intensity. As a continuous, subjective measure of symptom intensity, the VAS is not designed for diagnostic sensitivity or specificity. Instead, its clinical performance is evaluated in terms of reliability (test-retest, inter-scale), validity (concurrent, convergent), and responsiveness to change. The VAS has demonstrated high responsiveness in clinical trials and real-world studies, with changes in VAS scores correlating with clinical improvement or worsening of pruritus. While the VAS is feasible and interpretable for older children and adolescents, its use in younger children may be limited by cognitive and developmental factors, necessitating the use of proxy reporting or age-adapted instruments. Recent studies have developed and validated age-appropriate pruritus assessment tools (e.g., ItchyQuant, TweenItchyQoL, PIQ-C) for children, which may be preferable for younger age groups. The VAS has been included in some pediatric studies, but high-quality, pediatric-specific validation remains limited.",
  formSections: [
    { id: "vas_score_cm", label: "VAS Score (cm or 0-10)", type: 'number', min:0, max:10, step:0.1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
  ],
  calculationLogic: (inputs) => {
    const score = parseFloat(Number(inputs.vas_score_cm).toFixed(1)) || 0;
    let severity = "";
    if (score === 0) severity = "No itch";
    else if (score < 3) severity = "Mild itch";
    else if (score < 7) severity = "Moderate itch";
    else if (score < 9) severity = "Severe itch";
    else severity = "Very severe itch";

    const interpretation = `VAS for Pruritus: ${score.toFixed(1)} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, >0-2.9 Mild, 3-6.9 Moderate, 7-8.9 Severe, 9-10 Very severe).`;
    return { score, interpretation, details: { Reported_VAS_Score: score, Assessed_Severity: severity } };
  },
  references: [
      "Jang YH, Kim SM, Eun DH, et al. Validity and Reliability of Itch Assessment Scales for Chronic Pruritus in Adults: A Prospective Multicenter Study. Journal of the American Academy of Dermatology. 2020;82(1):80-86. doi:10.1016/j.jaad.2019.06.043.",
      "Schoch D, Sommer R, Augustin M, Ständer S, Blome C. Patient-Reported Outcome Measures In Pruritus: A Systematic Review of Measurement Properties. The Journal of Investigative Dermatology. 2017;137(10):2069-2077. doi:10.1016/j.jid.2017.05.020.",
      "Topp J, Apfelbacher C, Ständer S, Augustin M, Blome C. Measurement Properties of Patient-Reported Outcome Measures for Pruritus: An Updated Systematic Review. The Journal of Investigative Dermatology. 2022;142(2):343-354. doi:10.1016/j.jid.2021.06.032.",
      "Pereira MP, Ständer S. Assessment of Severity and Burden of Pruritus. Allergology International : Official Journal of the Japanese Society of Allergology. 2017;66(1):3-7. doi:10.1016/j.alit.2016.08.009.",
      "Storck M, Sandmann S, Bruland P, et al. Pruritus Intensity Scales Across Europe: A Prospective Validation Study. Journal of the European Academy of Dermatology and Venereology : JEADV. 2021;35(5):1176-1185. doi:10.1111/jdv.17111.",
      "Verweyen E, Ständer S, Kreitz K, et al. Validation of a Comprehensive Set of Pruritus Assessment Instruments: The Chronic Pruritus Tools Questionnaire PRURITOOLS. Acta Dermato-Venereologica. 2019;99(7):657-663. doi:10.2340/00015555-3158.",
      "Phan NQ, Blome C, Fritz F, et al. Assessment of Pruritus Intensity: Prospective Study on Validity and Reliability of the Visual Analogue Scale, Numerical Rating Scale and Verbal Rating Scale in 471 Patients With Chronic Pruritus. Acta Dermato-Venereologica. 2012;92(5):502-7. doi:10.2340/00015555-1246.",
      "Ständer S, Zeidler C, Riepe C, et al. European EADV Network on Assessment of Severity and Burden of Pruritus (PruNet): First Meeting on Outcome Tools. Journal of the European Academy of Dermatology and Venereology : JEADV. 2016;30(7):1144-7. doi:10.1111/jdv.13296.",
      "Reich A, Heisig M, Phan NQ, et al. Visual Analogue Scale: Evaluation of the Instrument for the Assessment of Pruritus. Acta Dermato-Venereologica. 2012;92(5):497-501. doi:10.2340/00015555-1265.",
      "Reich A, Bożek A, Janiszewska K, Szepietowski JC. 12-Item Pruritus Severity Scale: Development and Validation of New Itch Severity Questionnaire. BioMed Research International. 2017;2017:3896423. doi:10.1155/2017/3896423.",
      "Ständer S, Blome C, Anastasiadou Z, et al. Dynamic Pruritus Score: Evaluation of the Validity and Reliability of a New Instrument to Assess the Course of Pruritus. Acta Dermato-Venereologica. 2017;97(2):230-234. doi:10.2340/00015555-2494.",
      "Pereira MP, Zeidler C, Szymczak H, et al. Acceptability and Perceived Benefits of Validated Pruritus Assessment Instruments in the Dermatological Office and Clinic: The perspectives of Patients and Physicians. Journal of the European Academy of Dermatology and Venereology : JEADV. 2024;38(10):1973-1981. doi:10.1111/jdv.20148.",
      "Kong HE, Francois S, Smith S, et al. Tools to Study the Severity of Itch in 8- To 17-Year-Old Children: Validation of TweenItchyQoL and ItchyQuant. Pediatric Dermatology. 2021;38(5):1118-1126. doi:10.1111/pde.14662.",
      "Kong HE, Francois S, Smith S, et al. Pruritus Assessment Tools for 6 to 7-Year-Old Children: KidsItchyQoL and ItchyQuant. Pediatric Dermatology. 2021;38(3):591-601. doi:10.1111/pde.14563.",
      "Paller AS, Lai JS, Jackson K, et al. Generation and Validation of the Patient-Reported Outcome Measurement Information System Itch Questionnaire-Child (PIQ-C) to Measure the Impact of Itch on Life Quality. The Journal of Investigative Dermatology. 2022;142(5):1309-1317.e1. doi:10.1016/j.jid.2021.10.015."
  ]
};
