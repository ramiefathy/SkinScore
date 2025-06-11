
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
  description: "Introduced by Doshi et al. (1997), GAGS provides a method to grade acne severity by assessing the most severe lesion type in six key anatomical locations, weighted by their surface area. It avoids laborious lesion counting.",
  sourceType: 'Clinical Guideline',
  icon: Calculator,
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

      const interpretation = `Total GAGS Score: ${totalScore} (Range: 0-44). Severity: ${severityInterpretationText} acne.`;
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
    "Doshi, A., Zaheer, A., & Stiller, M. J. (1997). A comparison of current acne grading systems and proposal of a novel system. International Journal of Dermatology, 36(6), 416–418."
  ]
};
