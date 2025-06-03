
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Calculator } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const gagsLesionGradeOptions: InputOption[] = [
  {value:0,label:"0 - No lesions"},
  {value:1,label:"1 - <10 Comedones"},
  {value:2,label:"2 - 10-20 Comedones OR <10 Papules"},
  {value:3,label:"3 - >20 Comedones OR 10-20 Papules OR <10 Pustules"},
  {value:4,label:"4 - >20 Papules OR 10-20 Pustules OR <5 Nodules"}
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
  label:`${loc.name} (Factor x${loc.factor}) - Predominant Lesion Grade (0-4)`,
  type:'select',
  options: gagsLesionGradeOptions,
  defaultValue:0,
  validation: getValidationSchema('select', gagsLesionGradeOptions, 0, 4)
} as InputConfig));


export const gagsTool: Tool = {
  id: "gags",
  name: "Global Acne Grading System (GAGS)",
  acronym: "GAGS",
  condition: "Acne Vulgaris",
  keywords: ["gags", "acne", "acne vulgaris", "global acne grading system", "severity"],
  description: "Global score for acne severity based on lesion type (comedones, papules, pustules, nodules) and location factors.",
  sourceType: 'Clinical Guideline',
  icon: Calculator,
  formSections: gagsFormSections,
  calculationLogic: (inputs) => {
      let totalScore = 0;
      const locationScores: Record<string, {grade: number, score: number}> = {};
      gagsLocations.forEach(loc=>{
          const grade = Number(inputs[`gags_${loc.id}`])||0;
          const locationScore = grade * loc.factor;
          totalScore += locationScore;
          locationScores[loc.name] = {grade, score: locationScore};
      });

      let severityInterpretation = "";
      if (totalScore === 0) severityInterpretation = "Clear.";
      else if (totalScore <= 18) severityInterpretation = "Mild Acne.";
      else if (totalScore <= 30) severityInterpretation = "Moderate Acne.";
      else if (totalScore <= 38) severityInterpretation = "Severe Acne.";
      else severityInterpretation = "Very Severe Acne.";

      const interpretation = `Total GAGS Score: ${totalScore} (Range: 0-44+). ${severityInterpretation} (Severity bands: 0 Clear, 1-18 Mild, 19-30 Moderate, 31-38 Severe, 39+ Very Severe).`;
      return { score: totalScore, interpretation, details: locationScores };
  },
  references: ["Doshi A, Zaheer A, Stiller MJ. A comparison of current acne grading systems and proposal of a novel system. Int J Dermatol. 1997 Jul;36(7):494-8.", "Adityan B, Kumari R, Thappa DM. Scoring systems in acne vulgaris. Indian J Dermatol Venereol Leprol. 2009 May-Jun;75(3):323-6."]
};
