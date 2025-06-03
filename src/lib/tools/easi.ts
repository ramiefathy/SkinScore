
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const areaOptionsEASI:InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90+%"} ];
const severityOptionsEASI:InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"} ];

export const easiTool: Tool = {
  id: "easi",
  name: "Eczema Area and Severity Index (EASI)",
  acronym: "EASI",
  description: "Measures extent (area) and severity of Atopic Dermatitis (AD).",
  condition: "Atopic Dermatitis",
  keywords: ["easi", "atopic dermatitis", "ad", "eczema", "severity", "area"],
  sourceType: 'Clinical Guideline',
  icon: SlidersHorizontal,
  formSections: [
    { id: "age_group", label: "Age Group", type: 'select', options: [ {value: "adult", label: ">7 years"}, {value: "child", label: "0-7 years"} ], defaultValue: "adult", validation: getValidationSchema('select', [ {value: "adult", label: ">7 years"}])},
    ...(['head_neck', 'trunk', 'upper_limbs', 'lower_limbs'] as const).map(regionId => {
      const regionNames: Record<string, string> = { head_neck: 'Head/Neck', trunk: 'Trunk', upper_limbs: 'Upper Limbs', lower_limbs: 'Lower Limbs' };
      const multipliers: Record<string, {adult: number, child: number}> = { head_neck: {adult: 0.1, child: 0.2}, trunk: {adult: 0.3, child: 0.3}, upper_limbs: {adult: 0.2, child: 0.2}, lower_limbs: {adult: 0.4, child: 0.3} };
      const regionFullName = regionNames[regionId];

      return {
          id: `easi_group_${regionId}`,
          title: `${regionFullName} (Multiplier Adult x${multipliers[regionId].adult}, Child x${multipliers[regionId].child})`,
          gridCols: 2,
          inputs: [
              { id: `${regionId}_area`, label: `Area Affected`, type: 'select', options: areaOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',areaOptionsEASI,0,6) },
              { id: `${regionId}_erythema`, label: `Erythema`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${regionId}_induration`, label: `Induration/Papulation`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${regionId}_excoriation`, label: `Excoriation`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
              { id: `${regionId}_lichenification`, label: `Lichenification`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
          ]
      };
    })
  ],
  calculationLogic: (inputs) => {
      const ageGroup = inputs.age_group as "adult" | "child";
      const multipliersTable: Record<string, {adult: number, child: number}> = { head_neck: {adult: 0.1, child: 0.2}, trunk: {adult: 0.3, child: 0.3}, upper_limbs: {adult: 0.2, child: 0.2}, lower_limbs: {adult: 0.4, child: 0.3} };
      let totalEASIScore = 0;
      const regionalScores: Record<string, any> = {};
      const regionIds = ['head_neck', 'trunk', 'upper_limbs', 'lower_limbs'] as const;

      regionIds.forEach(regionId => {
          const areaScore = Number(inputs[`${regionId}_area`]) || 0;
          const erythema = Number(inputs[`${regionId}_erythema`]) || 0;
          const induration = Number(inputs[`${regionId}_induration`]) || 0;
          const excoriation = Number(inputs[`${regionId}_excoriation`]) || 0;
          const lichenification = Number(inputs[`${regionId}_lichenification`]) || 0;

          const severitySum = erythema + induration + excoriation + lichenification;
          const regionMultiplier = multipliersTable[regionId][ageGroup];
          const regionalScore = severitySum * areaScore * regionMultiplier;
          totalEASIScore += regionalScore;

          const regionName = regionId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          regionalScores[regionName] = { severity_sum: severitySum, area_score: areaScore, regional_easi_score: parseFloat(regionalScore.toFixed(2)) };
      });

      const score = parseFloat(totalEASIScore.toFixed(2));
      let interpretation = `EASI Score: ${score} (Range: 0-72). `;
      if (score === 0) interpretation += "Clear. ";
      else if (score <= 7) interpretation += "Mild Atopic Dermatitis. ";
      else if (score <= 21) interpretation += "Moderate Atopic Dermatitis. ";
      else if (score <= 48) interpretation += "Severe Atopic Dermatitis. ";
      else interpretation += "Very Severe Atopic Dermatitis. ";
      interpretation += "(Severity bands: 0 Clear, 0.1-7.0 Mild, 7.1-21.0 Moderate, 21.1-48.0 Severe, 48.1-72.0 Very Severe)";

      return { score, interpretation, details: { age_group: ageGroup, ...regionalScores } };
  },
  references: ["Hanifin JM, et al. Exp Dermatol. 2001."]
};
