import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { SquarePen } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

export const ihs4Tool: Tool = {
  id: "ihs4",
  name: "International Hidradenitis Suppurativa Severity Score System (IHS4)",
  acronym: "IHS4",
  condition: "Hidradenitis Suppurativa",
  keywords: ["ihs4", "hs", "hidradenitis suppurativa", "severity", "dynamic score", "inflammatory nodules", "abscesses", "draining tunnels"],
  description: "The IHS4 is a dynamic, quantitative, and reproducible measure of HS severity suitable for both clinical practice and research. It is calculated by weighting and summing the number of inflammatory nodules, abscesses, and draining tunnels.",
  sourceType: 'Clinical Guideline',
  icon: SquarePen,
  rationale: "The IHS4 was developed to provide a dynamic, quantitative, and reproducible measure of HS severity suitable for both clinical practice and research. Its rationale was to address the limitations of static, non-quantitative systems such as Hurley staging by focusing on the most clinically relevant lesion types—nodules, abscesses, and draining tunnels—thereby enabling sensitive tracking of disease activity and response to therapy over time. The IHS4 was established through a Delphi consensus process among members of the European Hidradenitis Suppurativa Foundation, followed by multicenter validation. The IHS4 is calculated as: (number of nodules) × 1 + (number of abscesses) × 2 + (number of draining tunnels) × 4. Severity is categorized as mild (IHS4 ≤ 3), moderate (IHS4 4–10), or severe (IHS4 ≥ 11). There are no formal subscores; the total is a weighted sum reflecting the relative clinical impact of each lesion type.",
  clinicalPerformance: "The IHS4 has demonstrated good convergent validity with other severity measures, including Hurley staging, expert opinion, HS-PGA, and the modified Sartorius score, with Spearman’s rho values exceeding 0.6 for most comparisons. Its correlation with patient-reported quality of life, as measured by the Dermatology Life Quality Index (DLQI), is moderate (ρ = 0.36), reflecting the multifaceted impact of HS. The IHS4 has high intrarater reliability (intraclass correlation coefficient [ICC] > 0.75) and moderate interrater reliability, particularly among less experienced raters. However, interrater agreement can be limited by challenges in lesion identification and counting, especially in severe or confluent disease. The IHS4 is sensitive to change and has been validated as a dynamic measure of disease activity in both clinical trials and real-world practice. Recent studies have highlighted the potential for artificial intelligence–based automation (AIHS4) to further improve reproducibility and efficiency in lesion detection and scoring, with performance comparable to expert clinicians.",
  formSections: [
    { id: "nodules", label: "Number of Inflammatory Nodules (N) (x1 point each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "abscesses", label: "Number of Abscesses (A) (x2 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    { id: "drainingTunnels", label: "Number of Draining Tunnels/Fistulas (DT) (x4 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
  ],
  calculationLogic: (inputs) => {
    const nodules = Number(inputs.nodules) || 0;
    const abscesses = Number(inputs.abscesses) || 0;
    const drainingTunnels = Number(inputs.drainingTunnels) || 0;
    const totalScore = (nodules * 1) + (abscesses * 2) + (drainingTunnels * 4);

    let severity = "";
    if (totalScore <= 3) severity = "Mild HS";
    else if (totalScore <= 10) severity = "Moderate HS";
    else severity = "Severe HS";
    
    const interpretation = `IHS4 Score: ${totalScore}. Severity: ${severity} HS.
Formula: (Nodules × 1) + (Abscesses × 2) + (Draining Tunnels × 4).
Severity bands: ≤3 Mild; 4–10 Moderate; ≥11 Severe.`;
    return {
      score: totalScore,
      interpretation,
      details: {
        Nodules_Count: nodules,
        Abscesses_Count: abscesses,
        Draining_Tunnels_Count: drainingTunnels,
        Nodules_Contribution: nodules * 1,
        Abscesses_Contribution: abscesses * 2,
        Draining_Tunnels_Contribution: drainingTunnels * 4,
        Total_IHS4_Score: totalScore,
        Severity_Category: severity
      }
    };
  },
  references: [
    "Zouboulis CC, Tzellos T, Kyrgidis A, et al. Development and validation of the International Hidradenitis Suppurativa Severity Score System (IHS4), a novel dynamic scoring system to assess HS severity. Br J Dermatol. 2017;177(5):1401-1409.",
    "Włodarek K, Stefaniak A, Matusiak Ł, Szepietowski JC. Could Residents Adequately Assess the Severity of Hidradenitis Suppurativa? Interrater and Intrarater Reliability Assessment of Major Scoring Systems. Dermatology (Basel, Switzerland). 2020;236(1):8-14.",
    "Thorlacius L, Garg A, Riis PT, et al. Inter-Rater Agreement and Reliability of Outcome Measurement Instruments and Staging Systems Used in Hidradenitis Suppurativa. The British Journal of Dermatology. 2019;181(3):483-491.",
    "Daoud M, Suppa M, Benhadou F, et al. Overview and Comparison of the Clinical Scores in Hidradenitis Suppurativa: A Real-Life Clinical Data. Frontiers in Medicine. 2023;10:1145152.",
    "Hernández Montilla I, Medela A, Mac Carthy T, et al. Automatic International Hidradenitis Suppurativa Severity Score System (AIHS4): A Novel Tool to Assess the Severity of Hidradenitis Suppurativa Using Artificial Intelligence. Skin Research and Technology. 2023;29(6):e13357.",
    "Tzellos T, van Straalen KR, Kyrgidis A, et al. Development and Validation of IHS4-55, an IHS4 Dichotomous Outcome to Assess Treatment Effect for Hidradenitis Suppurativa. Journal of the European Academy of Dermatology and Venereology. 2023;37(2):395-401.",
    "Michelucci A, Granieri G, Cei B, et al. Enhancing Hidradenitis Suppurativa Assessment: The Role of Ultra-High Frequency Ultrasound in Detecting Microtunnels and Refining Disease Staging. Journal of Ultrasound in Medicine. 2025;44(4):739-745."
  ]
};
