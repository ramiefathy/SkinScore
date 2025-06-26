
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
  description: "The SASSAD index assesses six clinical signs (erythema, exudation, excoriation, dryness, cracking, lichenification) at six defined body sites (arms, hands, legs, feet, head and neck, trunk). Each sign is scored from 0 (absent) to 3 (severe) at each site. The total score is the sum of all sign-site combinations, with a maximum possible score of 108.",
  sourceType: 'Clinical Guideline',
  icon: Scaling,
  rationale: "The SASSAD index was developed as a simple, objective tool for monitoring disease activity in atopic dermatitis, particularly in clinical trials. The rationale was to provide a rapid, reproducible, and practical method for assessing disease severity, focusing on observable clinical signs rather than subjective symptoms or surface area estimation. SASSAD assesses six clinical signs (erythema, exudation, excoriation, dryness, cracking, lichenification) at six defined body sites (arms, hands, legs, feet, head and neck, trunk). Each sign is scored from 0 (absent) to 3 (severe) at each site. The total score is the sum of all sign-site combinations, with a maximum possible score of 108.",
  clinicalPerformance: "The SASSAD index has demonstrated agreement with patient and observer global assessments of disease severity, patient-assessed itch and sleep loss, and topical steroid requirements, although it has correlated poorly with quality of life parameters. It avoids assessment of surface area involvement, which has been shown to have poor reliability. A study of six observers scoring six patients with moderate to severe atopic eczema found that the intraclass correlation coefficient for total SASSAD scores among all observers was 0.70, indicating good interobserver reliability. However, agreement for individual components was only poor to moderate. Intraobserver variation was lower, suggesting that the tool is more consistent when used by the same observer over time. Comparative studies have shown that SASSAD has good inter-rater and intrarater reliability, though not as high as the Eczema Area and Severity Index (EASI).",
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
  references: [
    "Charman C, Williams H. Outcome Measures of Disease Severity in Atopic Eczema. JAMA Archives of Dermatology. 2000;136(6):763-9. doi:10.1001/archderm.136.6.763.",
    "Berth-Jones J. Six Area, Six Sign Atopic Dermatitis (SASSAD) Severity Score: A Simple System for Monitoring Disease Activity in Atopic Dermatitis. The British Journal of Dermatology. 1996;135 Suppl 48:25-30. doi:10.1111/j.1365-2133.1996.tb00706.x.",
    "Charman CR, Venn AJ, Williams HC. Reliability Testing of the Six Area, Six Sign Atopic Dermatitis Severity Score. The British Journal of Dermatology. 2002;146(6):1057-60. doi:10.1046/j.1365-2133.2002.04644.x.",
    "Zhao CY, Tran AQ, Lazo-Dizon JP, et al. A Pilot Comparison Study of Four Clinician-Rated Atopic Dermatitis Severity Scales. The British Journal of Dermatology. 2015;173(2):488-97. doi:10.1111/bjd.13846."
  ]
};
