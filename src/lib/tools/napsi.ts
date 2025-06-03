
import type { Tool, InputConfig, FormSectionConfig, InputOption } from '../types';
import { Fingerprint } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const nailCountOptions: InputOption[] = Array.from({length: 20}, (_, i) => ({value: i + 1, label: `${i+1} Nail(s)`}));

const napsiFormSections: FormSectionConfig[] = [
  { id: "nail_count", label: "Number of Nails Assessed (1-20)", type: 'select', options: nailCountOptions, defaultValue: 10, validation: getValidationSchema('select', nailCountOptions, 1, 20) },
  ...Array.from({length: 20}, (_, i) => i + 1).flatMap(nailNum => ([
      { id: `nail_${nailNum}_matrix`, label: `Nail ${nailNum}: Matrix Score (0-4)`, type: 'number', min:0, max:4, defaultValue:0, description: "Quadrants w/ any: Pitting, Leukonychia, Red spots in lunula, Crumbling.", validation: getValidationSchema('number',undefined,0,4)},
      { id: `nail_${nailNum}_bed`, label: `Nail ${nailNum}: Bed Score (0-4)`, type: 'number', min:0, max:4, defaultValue:0, description: "Quadrants w/ any: Onycholysis, Splinter hemorrhages, Subungual hyperkeratosis, Oil drop discoloration.", validation: getValidationSchema('number',undefined,0,4)}
  ])) as InputConfig[]
];

export const napsiTool: Tool = {
  id: "napsi",
  name: "Nail Psoriasis Severity Index (NAPSI)",
  acronym: "NAPSI",
  description: "Evaluates severity of psoriatic nail involvement. Each nail is divided into 4 quadrants.",
  condition: "Psoriasis",
  keywords: ["napsi", "psoriasis", "nail disorders", "nail", "severity"],
  sourceType: 'Clinical Guideline',
  icon: Fingerprint,
  formSections: napsiFormSections,
  calculationLogic: (inputs) => {
      let totalNapsiScore = 0;
      const nailCount = Math.min(Math.max(Number(inputs.nail_count) || 0, 1), 20);
      const perNailScores: Record<string, any> = {};
      for(let i=1; i<=nailCount; i++) {
          const matrixScore = Number(inputs[`nail_${i}_matrix`]) || 0;
          const bedScore = Number(inputs[`nail_${i}_bed`]) || 0;
          const nailTotal = matrixScore + bedScore;
          totalNapsiScore += nailTotal;
          perNailScores[`Nail ${i}`] = { matrix_score: matrixScore, bed_score: bedScore, total_nail_score: nailTotal };
      }
      const score = totalNapsiScore;
      const interpretation = `Total NAPSI Score (for ${nailCount} nails): ${score} (Max score: ${nailCount * 8}). Higher score indicates more severe nail psoriasis. No universal severity bands defined; used for tracking change.`;
      return { score, interpretation, details: { assessed_nails: nailCount, ...perNailScores } };
  },
  references: ["Rich P, Scher RK. J Am Acad Dermatol. 2003 Aug;49(2):206-12."]
};
