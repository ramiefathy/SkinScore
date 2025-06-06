
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Scaling } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const signOptionsSASSAD: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];

export const sassadTool: Tool = {
  id: "sassad",
  name: "Six Area, Six Sign AD Severity Score (SASSAD)",
  acronym: "SASSAD",
  condition: "Atopic Dermatitis / Eczema",
  keywords: ["sassad", "atopic dermatitis", "ad", "eczema", "severity", "six area six sign"],
  description: "Records and monitors Atopic Dermatitis (AD) activity by grading 6 signs (0-3) across 6 body sites. Lack of anchors for grades 1-3.",
  sourceType: 'Clinical Guideline',
  icon: Scaling,
  formSections:
      (["Arms", "Hands", "Legs", "Feet", "Head_Neck", "Trunk"].map(areaName => {
          const areaId = areaName.toLowerCase().replace('/','_');
          return {
              id: `sassad_group_${areaId}`,
              title: `Region: ${areaName.replace('_','/')}`,
              gridCols: 3,
              inputs: ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"].map(signName => {
                  const signId = signName.toLowerCase();
                  return {
                      id: `${signId}_${areaId}`,
                      label: `${signName}`,
                      type: 'select',
                      options: signOptionsSASSAD,
                      defaultValue: 0,
                      validation: getValidationSchema('select', signOptionsSASSAD, 0, 3)
                  } as InputConfig;
              })
          };
      }))
  ,
  calculationLogic: (inputs) => {
      let totalScore = 0;
      const siteScores: Record<string, number> = {};
      const areas = ["Arms", "Hands", "Legs", "Feet", "Head_Neck", "Trunk"];
      const signs = ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"];
      const detailedSiteScores: Record<string, Record<string, number>> = {};

      areas.forEach(areaName => {
          const areaId = areaName.toLowerCase().replace('/','_');
          let currentSiteScore = 0;
          detailedSiteScores[areaName.replace('_','/')] = {};
          signs.forEach(signName => {
              const signId = signName.toLowerCase();
              const val = Number(inputs[`${signId}_${areaId}`]) || 0;
              currentSiteScore += val;
              detailedSiteScores[areaName.replace('_','/')][signName] = val;
          });
          siteScores[areaName.replace('_','/')] = currentSiteScore;
          totalScore += currentSiteScore;
      });
      const interpretation = `Total SASSAD Score: ${totalScore} (Range: 0-108). Higher score indicates more severe AD. No standard severity bands universally defined.`;

      return { score: totalScore, interpretation, details: detailedSiteScores };
  },
  references: ["Berth-Jones J, et al. Br J Dermatol. 1996."]
};
