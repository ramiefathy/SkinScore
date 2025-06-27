
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { AlignLeft } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const hurleyStageOptions: InputOption[] = [
  { value: 1, label: "Stage I: Single or multiple abscesses without sinus tracts or scarring." },
  { value: 2, label: "Stage II: Recurrent abscesses with sinus tract formation and scarring, with single or multiple widely separated lesions." },
  { value: 3, label: "Stage III: Diffuse or near-diffuse involvement, with multiple interconnected sinus tracts and abscesses across an entire anatomical region." }
];

export const hurleyStagingHsTool: Tool = {
  id: "hurley_staging_hs",
  name: "Hurley Staging System for Hidradenitis Suppurativa (HS)",
  acronym: "Hurley Staging",
  description: "Developed by H.J. Hurley, this is a simple, widely used system to classify the long-term, anatomical severity of Hidradenitis Suppurativa based on the presence and extent of sinus tracts and scarring. It is a static, three-stage classification that guides prognosis and therapeutic decisions.",
  condition: "Hidradenitis Suppurativa",
  keywords: ["hurley", "hs", "hidradenitis suppurativa", "staging", "severity", "abscess", "sinus tract", "scarring"],
  sourceType: 'Research',
  icon: AlignLeft,
  displayType: 'staticList',
  rationale: "Hurley staging is the most established and widely used system for classifying HS severity in clinical practice. Its primary purpose is to stratify patients into broad categories based on the presence and extent of sinus tracts and scarring, with direct implications for therapeutic decision-making. The system is simple, static, and categorical, making it suitable for initial assessment and long-term management planning. Hurley staging consists of three stages: Stage I (abscesses only), Stage II (recurrent abscesses with tracts/scarring), and Stage III (diffuse/interconnected disease).",
  clinicalPerformance: "Hurley staging is recommended by the United States and Canadian Hidradenitis Suppurativa Foundations for routine clinical use due to its simplicity and direct relevance to treatment planning. It has demonstrated moderate interrater reliability (κ = 0.59) and substantial intrarater reliability (κ = 0.65), with the highest agreement observed for stage III disease (κ = 0.81–0.82). The system is best for rapid assessment and surgical decision-making but is limited by its static nature and lack of sensitivity to dynamic changes in disease activity. The refined Hurley classification, which subdivides stages I and II, has shown improved correlation with quality of life and objective severity scores.",
  formSections: [
    {
      id: "hurley_stage_display",
      label: "Hurley Stages",
      type: 'select',
      options: hurleyStageOptions,
      defaultValue: 1,
      validation: getValidationSchema('select', hurleyStageOptions, 1, 3)
    }
  ],
  calculationLogic: (inputs) => {
    // This logic is not used for 'staticList' display but is kept for completeness
    const stage = Number(inputs.hurley_stage) || 1;
    let stageDescriptionObj = hurleyStageOptions.find(opt => opt.value === stage);
    let stageDescription = stageDescriptionObj ? stageDescriptionObj.label : "Invalid stage selected.";

    let clinicalImplication = "";
    if (stage === 1) clinicalImplication = "Mild disease, typically managed medically.";
    else if (stage === 2) clinicalImplication = "Moderate disease; may require localized surgical intervention in addition to medical therapy.";
    else if (stage === 3) clinicalImplication = "Severe disease, often requiring extensive surgery and systemic medical treatment.";
    else clinicalImplication = "Stage not clearly defined.";

    const interpretation = `${stageDescription}\nClinical Implication: ${clinicalImplication}`;
    return { score: stage, interpretation, details: { stage_description: stageDescription, clinical_implication: clinicalImplication } };
  },
  references: [
    "Hurley, H. J. (1989). Axillary hyperhidrosis, apocrine bromhidrosis, hidradenitis suppurativa, and familial benign pemphigus: surgical approach. In Dermatologic Surgery (pp. 729-739). Marcel Dekker.",
    "Alikhan A, Sayed C, Alavi A, et al. North American clinical management guidelines for hidradenitis suppurativa: A publication from the United States and Canadian Hidradenitis Suppurativa Foundations: Part I: Diagnosis, evaluation, and the use of complementary and procedural management. J Am Acad Dermatol. 2019;81(1):76-90.",
    "Saunte DML, Jemec GBE. Hidradenitis Suppurativa: Advances in Diagnosis and Treatment. JAMA. 2017;318(20):2019-2032.",
    "Ovadja ZN, Schuit MM, van der Horst CMAM, Lapid O. Inter- And Intrarater Reliability of Hurley Staging for Hidradenitis Suppurativa. The British Journal of Dermatology. 2019;181(2):344-349.",
    "Rondags A, van Straalen KR, van Hasselt JR, et al. Correlation of the Refined Hurley Classification for Hidradenitis Suppurativa With Patient-Reported Quality of Life and Objective Disease Severity Assessment. The British Journal of Dermatology. 2019;180(5):1214-1220.",
    "Liy-Wong C, Kim M, Kirkorian AY, et al. Hidradenitis Suppurativa in the Pediatric Population: An International, Multicenter, Retrospective, Cross-sectional Study of 481 Pediatric Patients. JAMA Dermatology. 2021;157(4):385-391."
  ]
};
