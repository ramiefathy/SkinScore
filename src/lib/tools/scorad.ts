
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { ScalingIcon } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scoradIntensityOptions: InputOption[] = [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}];

export const scoradTool: Tool = {
  id: "scorad",
  name: "SCORing Atopic Dermatitis (SCORAD)",
  acronym: "SCORAD",
  description: "Developed by the European Task Force on Atopic Dermatitis in 1993, SCORAD is a comprehensive tool for assessing AD severity. It uniquely combines objective clinician-assessed signs (extent and intensity) with patient-reported symptoms (itch and sleep loss).",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["scorad", "atopic dermatitis", "ad", "eczema", "severity", "extent", "intensity", "subjective symptoms"],
  sourceType: 'Expert Consensus',
  icon: ScalingIcon,
  rationale: "The SCORAD index was developed by the European Task Force on Atopic Dermatitis to provide a consensus method for assessing the severity of atopic dermatitis, enabling comparison of results across clinical trials. The rationale was to create a comprehensive tool that incorporates both objective clinical signs and subjective patient symptoms, reflecting the multifaceted nature of atopic dermatitis. SCORAD consists of three main components: • Extent (A): The percentage of body surface area affected, estimated using the \"rule of nines\" and scored from 0 to 100. • Intensity (B): Six clinical signs (erythema, oedema/papulation, excoriations, lichenification, oozing/crusts, dryness), each scored from 0 to 3, for a maximum of 18. • Subjective symptoms (C): Daily pruritus and sleeplessness, each scored on a 10-cm visual analogue scale (0–10), for a maximum of 20. The SCORAD formula is: SCORAD = A/5 + 7B/2 + C. The maximum possible score is 103. An \"objective SCORAD\" (oSCORAD) variant excludes the subjective symptoms, using only extent and intensity.",
  clinicalPerformance: "SCORAD has been extensively validated and is widely used in both research and clinical practice. In a study of children with atopic dermatitis, SCORAD and patient-oriented SCORAD (PO-SCORAD) showed strong correlation (r = 0.87), and both correlated well with other severity measures such as the Patient-Oriented Eczema Measure (POEM) and Investigator’s Global Assessment (IGA). The best agreement between SCORAD and IGA was observed for specific SCORAD categories, with a kappa statistic of 0.68, indicating substantial agreement. In adults, PO-SCORAD and its subscores, as well as POEM and numerical rating scale (NRS) for itch, all demonstrated good internal consistency (Cronbach’s alpha 0.82–0.86) and moderate-to-strong correlations with quality of life and mental health measures. All scores showed good criterion validity as judged by analysis of variance and receiver operating characteristic (ROC) analysis. In a study of Black patients with AD, PO-SCORAD adapted for Black skin correlated well with physician-assessed SCORAD (r = 0.66), supporting its validity in diverse populations. Responsiveness, or sensitivity to change, is another key metric. In pooled analyses of randomized controlled trials, the area under the ROC curve (AUC) for SCORAD was 0.70 (95% CI: 0.61–0.78), and for objective SCORAD, 0.73 (95% CI: 0.70–0.77), indicating fair responsiveness. The minimal clinically important difference (MCID) for SCORAD was 8.7 points, and for objective SCORAD, 8.2 points. Comparative studies have shown that SCORAD, along with its objective variant (oSCORAD), is valid and reliable, but its inter-rater reliability is lower than that of EASI and SASSAD, particularly due to variability in the body surface area (BSA) component. The oSCORAD BSA component has been identified as a major source of inter-rater variation, with some studies reporting poor interobserver reliability for this element, while others have found lower variance. The method of BSA estimation (e.g., rule of nines, handprint method) may influence reliability, and no single approach has been shown to be clearly superior.",
  formSections: [
    {
      id: "scorad_group_a", title: "Part A: Extent", gridCols: 1,
      inputs: [
          { id: "extentPercent", label: "A: Body Surface Area Involved (%)", type: 'number', min: 0, max: 100, defaultValue: 0, description: "Calculated using the 'Rule of Nines'. Score: 0–100.", validation: getValidationSchema('number',undefined,0,100) }
      ]
    },
    {
      id: "scorad_group_b", title: "Part B: Intensity", gridCols:3,
      description: "Assess the average intensity of six clinical signs across affected areas (0=None, 1=Mild, 2=Moderate, 3=Severe). Sum of these six signs gives a total intensity score from 0 to 18.",
      inputs: [
          { id: "intensityRedness", label: "Erythema", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityEdema", label: "Edema/Papulation", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityOozing", label: "Oozing/Crusting", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityExcoriation", label: "Excoriation", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityLichenification", label: "Lichenification", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
          { id: "intensityDryness", label: "Dryness (of non-affected skin)", type: 'select', options: scoradIntensityOptions, defaultValue: 0, validation: getValidationSchema('select',scoradIntensityOptions,0,3) },
      ]
    },
    {
      id: "scorad_group_c", title: "Part C: Subjective Symptoms", gridCols:2,
      description: "Patient rates average itch and sleep loss over the past three days on a Visual Analog Scale (VAS) from 0 (none) to 10 (most severe). The two scores are added together (Score: 0–20).",
      inputs: [
          { id: "pruritusVAS", label: "Pruritus (Itch) VAS (0-10)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
          { id: "sleepLossVAS", label: "Sleeplessness VAS (0-10)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
      ]
    }
  ],
  calculationLogic: (inputs) => {
      const A = Number(inputs.extentPercent) || 0;
      const B_sum = (Number(inputs.intensityRedness)||0) + (Number(inputs.intensityEdema)||0) + (Number(inputs.intensityOozing)||0) + (Number(inputs.intensityExcoriation)||0) + (Number(inputs.intensityLichenification)||0) + (Number(inputs.intensityDryness)||0);
      const C_sum = (Number(inputs.pruritusVAS)||0) + (Number(inputs.sleepLossVAS)||0);
      const totalScoradScore = (A/5) + (7*B_sum/2) + C_sum;
      const objectiveScorad = (A/5) + (7*B_sum/2); // Objective SCORAD (oSCORAD)

      const score = parseFloat(totalScoradScore.toFixed(1));
      let severityCategory = "";
      if (score < 25) severityCategory = "Mild AD";
      else if (score <= 50) severityCategory = "Moderate AD";
      else severityCategory = "Severe AD";

      const interpretation = `SCORAD Score: ${score} (Range: 0-103). Severity: ${severityCategory}.
Objective SCORAD (oSCORAD): ${objectiveScorad.toFixed(1)} (Range: 0-83).
Formula: SCORAD = A/5 + (7*B)/2 + C.`;

      return {
        score,
        interpretation,
        details: {
          Part_A_Extent_BSA: A,
          Part_B_Intensity_Sum: B_sum,
          Part_C_Subjective_Symptoms_Sum: C_sum,
          Calculated_oSCORAD: parseFloat(objectiveScorad.toFixed(1)),
          Total_SCORAD_Score: score,
          Severity_Category: severityCategory
        }
      };
  },
  references: [
    "Eichenfield LF, Tom WL, Chamlin SL, et al. Guidelines of Care for the Management of Atopic Dermatitis: Section 1. Diagnosis and Assessment of Atopic Dermatitis. Journal of the American Academy of Dermatology. 2014;70(2):338-51. doi:10.1016/j.jaad.2013.10.010.",
    "Oranje AP, Glazenburg EJ, Wolkerstorfer A, de Waard-van der Spek FB. Practical Issues on Interpretation of Scoring Atopic Dermatitis: The SCORAD Index, Objective SCORAD and the Three-Item Severity Score. The British Journal of Dermatology. 2007;157(4):645-8. doi:10.1111/j.1365-2133.2007.08112.x.",
    "Gelmetti C, Colonna C. The Value of SCORAD and Beyond. Towards a Standardized Evaluation of Severity?. Allergy. 2004;59 Suppl 78:61-5. doi:10.1111/j.1398-9995.2004.00651.x.",
    "Chu DK, Schneider L, Asiniwasis RN, et al. Atopic Dermatitis (Eczema) Guidelines: 2023 American Academy of Allergy, Asthma and Immunology/American College of Allergy, Asthma and Immunology Joint Task Force on Practice Parameters GRADE- And Institute of Medicine-Based Recommendations. Annals of Allergy, Asthma & Immunology : Official Publication of the American College of Allergy, Asthma, & Immunology. 2024;132(3):274-312. doi:10.1016/j.anai.2023.11.009.",
    "Ständer S. Atopic Dermatitis. The New England Journal of Medicine. 2021;384(12):1136-1143. doi:10.1056/NEJMra2023911.",
    "Barbarot S, Aubert H, Stalder JF, Roye S, Delarue A. The Patient-Oriented Scoring of Atopic Dermatitis and SCORAD in Young Children: New Data on Interpretability and Clinical Usefulness. Journal of the European Academy of Dermatology and Venereology : JEADV. 2024;38(1):175-181. doi:10.1111/jdv.19494.",
    "Silverberg JI, Margolis DJ, Boguniewicz M, et al. Validation of Five Patient-Reported Outcomes for Atopic Dermatitis Severity in Adults. The British Journal of Dermatology. 2020;182(1):104-111. doi:10.1111/bjd.18002.",
    "Faye O, Meledie N'Djong AP, Diadie S, et al. Validation of the Patient-Oriented SCORing for Atopic Dermatitis Tool for Black Skin. Journal of the European Academy of Dermatology and Venereology : JEADV. 2020;34(4):795-799. doi:10.1111/jdv.15999.",
    "Schram ME, Spuls PI, Leeflang MM, et al. EASI, (Objective) SCORAD and POEM for Atopic Eczema: Responsiveness and Minimal Clinically Important Difference. Allergy. 2012;67(1):99-106. doi:10.1111/j.1398-9995.2011.02719.x.",
    "Jacobson ME, Leshem YA, Apfelbacher C, et al. Measuring Signs of Atopic Dermatitis in Clinical Practice: A HOME-CP Consensus Statement. JAMA Dermatology. 2024;160(8):878-886. doi:10.1001/jamadermatol.2024.1162.",
    "Silverberg JI, Lei D, Yousaf M, et al. Comparison of Patient-Oriented Eczema Measure and Patient-Oriented Scoring Atopic Dermatitis vs Eczema Area and Severity Index and Other Measures of Atopic Dermatitis: A Validation Study. Annals of Allergy, Asthma & Immunology : Official Publication of the American College of Allergy, Asthma, & Immunology. 2020;125(1):78-83. doi:10.1016/j.anai.2020.03.006."
  ]
};
