import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Calculator } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const gagsLesionGradeOptions: InputOption[] = [
  {value:0,label:"0 - No lesions"},
  {value:1,label:"1 - Comedones"}, // Simplified for selection
  {value:2,label:"2 - Papules"},
  {value:3,label:"3 - Pustules"},
  {value:4,label:"4 - Nodules"}
];

const gagsLocations = [
  {id:"forehead",name:"Forehead",factor:2},
  {id:"r_cheek",name:"Right Cheek",factor:2},
  {id:"l_cheek",name:"Left Cheek",factor:2},
  {id:"nose",name:"Nose",factor:1},
  {id:"chin",name:"Chin",factor:1},
  {id:"chest_upper_back",name:"Chest & Upper Back",factor:3}
];

const gagsFormSections: FormSectionConfig[] = gagsLocations.map(loc=>({
  id:`gags_${loc.id}`,
  label:`${loc.name} - Predominant Lesion Grade (Factor x${loc.factor})`,
  type:'select',
  options: gagsLesionGradeOptions,
  defaultValue:0,
  description: "Select most severe lesion type: 0=None, 1=Comedones, 2=Papules, 3=Pustules, 4=Nodules.",
  validation: getValidationSchema('select', gagsLesionGradeOptions, 0, 4)
} as InputConfig));


export const gagsTool: Tool = {
  id: "gags",
  name: "Global Acne Grading System (GAGS)",
  acronym: "GAGS",
  condition: "Acne Vulgaris",
  keywords: ["gags", "acne", "acne vulgaris", "global acne grading system", "severity"],
  description: "The Global Acne Grading System (GAGS) is a quantitative, composite scoring system designed to provide a standardized, reproducible measure of acne severity by incorporating both the type and distribution of lesions across different anatomical regions.",
  sourceType: 'Clinical Guideline',
  icon: Calculator,
  rationale: "The rationale is to integrate lesion type, number, and regional involvement into a single composite score, improving objectivity and comparability across studies and clinical settings. The GAGS divides the face, chest, and back into six regions, each assigned a factor based on surface area and cosmetic significance. For each region, the most severe lesion type is identified and assigned a grade (0: no lesions, 1: comedones, 2: papules, 3: pustules, 4: nodules). The regional score is calculated as the grade multiplied by the region’s factor, and the total GAGS score is the sum of all regional scores.",
  clinicalPerformance: "The GAGS has been evaluated in multiple studies and systematic reviews, which report good inter- and intra-rater reliability and practical utility in both research and clinical practice. Comparative studies have found that the GAGS is less time-consuming and more practical than lesion counting, with similar or better reliability. However, subjectivity remains a concern, particularly in the assessment of lesion severity and regional involvement. Sensitivity and specificity are not routinely reported, as the GAGS is not a diagnostic tool. In pediatric populations, the GAGS has been used in adolescent studies, and a multidimensional acne global grading system integrating primary and secondary lesions has been developed and validated in a pediatric cohort (ages 0–21 years), demonstrating good agreement with clinician ratings and treatment decisions. Further validation in adult populations and real-world practice is needed.",
  formSections: gagsFormSections,
  calculationLogic: (inputs) => {
      let totalScore = 0;
      const locationScores: Record<string, {grade: number, factor: number, score: number}> = {};
      gagsLocations.forEach(loc=>{
          const grade = Number(inputs[`gags_${loc.id}`])||0;
          const locationScore = grade * loc.factor;
          totalScore += locationScore;
          locationScores[loc.name] = {grade, factor: loc.factor, score: locationScore};
      });

      let severityInterpretationText = "";
      if (totalScore === 0) severityInterpretationText = "Clear";
      else if (totalScore <= 18) severityInterpretationText = "Mild";
      else if (totalScore <= 30) severityInterpretationText = "Moderate";
      else if (totalScore <= 38) severityInterpretationText = "Severe";
      else severityInterpretationText = "Very Severe";

      const interpretation = `Total GAGS Score: ${totalScore} (Range: 0-44). Severity: ${severityInterpretationText} acne.\nInterpretation Bands: 0 Clear; 1–18 Mild; 19–30 Moderate; 31–38 Severe; ≥39 Very Severe.`;
      return {
        score: totalScore,
        interpretation,
        details: {
          Regional_Scores: locationScores,
          Total_GAGS_Score: totalScore,
          Severity_Category: severityInterpretationText
        }
      };
  },
  references: [
    "Reynolds RV, Yeung H, Cheng CE, et al. Guidelines of Care for the Management of Acne Vulgaris. Journal of the American Academy of Dermatology. 2024;90(5):1006.e1-1006.e30. doi:10.1016/j.jaad.2023.12.017.",
    "Bernardis E, Shou H, Barbieri JS, et al. Development and Initial Validation of a Multidimensional Acne Global Grading System Integrating Primary Lesions and Secondary Changes. JAMA Dermatology. 2020;156(3):296-302. doi:10.1001/jamadermatol.2019.4668.",
    "Ramli R, Malik AS, Hani AF, Jamil A. Acne Analysis, Grading and Computational Assessment Methods: An Overview. Skin Research and Technology. 2012;18(1):1-14. doi:10.1111/j.1600-0846.2011.00542.x.",
    "Barratt H, Hamilton F, Car J, et al. Outcome Measures in Acne Vulgaris: Systematic Review. The British Journal of Dermatology. 2009;160(1):132-6. doi:10.1111/j.1365-2133.2008.08819.x.",
    "Becker M, Wild T, Zouboulis CC. Objective Assessment of Acne. Clinics in Dermatology. 2017 Mar - Apr;35(2):147-155. doi:10.1016/j.clindermatol.2016.10.006."
  ]
};
