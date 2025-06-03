
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Gauge } from 'lucide-react';
import { getValidationSchema, severityOptions0to4, areaOptions0to6 } from '../toolValidation';

export const pasiTool: Tool = {
  id: "pasi",
  name: "Psoriasis Area and Severity Index (PASI)",
  acronym: "PASI",
  description: "Gold standard for assessing severity of extensive plaque psoriasis and monitoring treatment response.",
  condition: "Psoriasis",
  keywords: ["pasi", "psoriasis", "plaque psoriasis", "severity", "index"],
  sourceType: 'Clinical Guideline',
  icon: Gauge,
  formSections: (['h', 'u', 't', 'l'] as const).map(regionAbbr => {
      const regionMap: Record<string, string> = { h: 'Head/Neck', u: 'Upper Limbs', t: 'Trunk', l: 'Lower Limbs' };
      const bsaPercent: Record<string, number> = { h: 10, u: 20, t: 30, l: 40 };
      const regionFullName = regionMap[regionAbbr];
      const regionMultiplier = (bsaPercent[regionAbbr]/100).toFixed(1);

      return {
        id: `pasi_group_${regionAbbr}`,
        title: `${regionFullName} (Multiplier x${regionMultiplier})`,
        gridCols: 4,
        description: `Assess Erythema, Induration, Scaling, and Area for the ${regionFullName} region. This region accounts for ${bsaPercent[regionAbbr]}% of Body Surface Area.`,
        inputs: [
          { id: `E_${regionAbbr}`, label: `Erythema (E)`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `I_${regionAbbr}`, label: `Induration (I)`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `S_${regionAbbr}`, label: `Scaling (S)`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `A_${regionAbbr}`, label: `Area (A)`, type: 'select', options: areaOptions0to6, defaultValue:0, description: "% of region affected.", validation: getValidationSchema('select',areaOptions0to6,0,6) },
        ]
      };
    }),
  calculationLogic: (inputs) => {
      const multipliers: Record<string, number> = { h: 0.1, u: 0.2, t: 0.3, l: 0.4 };
      let totalPASIScore = 0;
      const regionalScoresOutput: Record<string, any> = {};
      const regionMap: Record<string, string> = { h: 'Head/Neck', u: 'Upper Limbs', t: 'Trunk', l: 'Lower Limbs' };

      (['h', 'u', 't', 'l'] as const).forEach(regionAbbr => {
          const E = Number(inputs[`E_${regionAbbr}`]) || 0;
          const I = Number(inputs[`I_${regionAbbr}`]) || 0;
          const S = Number( inputs[`S_${regionAbbr}`]) || 0;
          const A = Number(inputs[`A_${regionAbbr}`]) || 0;
          const sumSeverity = E + I + S;
          const regionalScore = multipliers[regionAbbr] * sumSeverity * A;
          totalPASIScore += regionalScore;
          regionalScoresOutput[regionMap[regionAbbr]] = { Erythema: E, Induration: I, Scaling: S, Area_Score: A, Sum_Severity: sumSeverity, Regional_PASI_Score: parseFloat(regionalScore.toFixed(2)) };
      });
      const score = parseFloat(totalPASIScore.toFixed(2));
      let interpretation = `Total PASI Score: ${score} (Range: 0-72). `;
      if (score < 10) interpretation += "Mild Psoriasis.";
      else if (score <= 20) interpretation += "Moderate Psoriasis.";
      else interpretation += "Severe Psoriasis.";
      interpretation += " (Common bands: <10 Mild; 10-20 Moderate; >20 Severe. Response: PASI 50, 75, 90, 100 indicate % reduction from baseline.)";
      return { score, interpretation, details: regionalScoresOutput };
  },
  references: ["Fredriksson T, Pettersson U. Dermatologica. 1978;157(4):238-44."]
};
