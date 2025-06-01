
import type { LucideIcon } from 'lucide-react';
import type { Tool } from './types';
import { 
  Calculator, Stethoscope, ClipboardList, Users, FileText, Pill, 
  Users2, Thermometer, Scaling, Wind, AlignLeft, SquarePen, UserCheck, Activity, 
  CheckCircle, ListChecks, MessageSquare, FolderHeart, ShieldAlert, Brain, 
  BarChart, Sun, Eye, Scissors, HelpCircle, Hand, Type, FileHeart, ShieldQuestion, Zap,
  ScalingIcon, Gauge, Fingerprint, SlidersHorizontal, Shield, Atom, Dot, Waves, UserCog,
  HeartPulse, ShieldHalf, Palette, SearchCheck, Baby, User, Footprints, Puzzle, CircleDot, Check, CloudDrizzle
} from 'lucide-react';
import { z } from 'zod';
import type { InputConfig, InputOption } from './types';


// Helper for Zod validation schemas based on input type
const getValidationSchema = (inputType: string, options?: Array<InputOption>, min?: number, max?: number): z.ZodSchema<any> => {
  switch (inputType) {
    case 'number':
      let numSchema = z.coerce.number(); // coerce to handle string inputs from forms
      if (min !== undefined) numSchema = numSchema.min(min);
      if (max !== undefined) numSchema = numSchema.max(max);
      return numSchema.nullable().optional();
    case 'select':
      if (options && options.length > 0 && typeof options[0].value === 'number') {
        return z.coerce.number().nullable().optional();
      }
      return z.string().nullable().optional();
    case 'checkbox':
      return z.boolean().optional();
    case 'text':
    case 'textarea': // Assuming text might map to textarea
      return z.string().nullable().optional();
    case 'radio':
        if (options && options.length > 0 && typeof options[0].value === 'number') {
            return z.coerce.number().nullable().optional();
        }
        return z.string().nullable().optional();
    default:
      return z.any().optional();
  }
};

const pasiHeadErythemaOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` }));
const pasiHeadIndurationOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` }));
const pasiHeadDesquamationOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'][i]}` }));
const pasiHeadAreaOptions: InputOption[] = Array.from({ length: 7 }, (_, i) => ({ value: i, label: `${i} - ${['0%', '1-9%', '10-29%', '30-49%', '50-69%', '70-89%', '90-100%'][i]}` }));


export const toolData: Tool[] = [
  // Existing tools from original file (slightly updated for consistency if needed)
  {
    id: 'pasi-simplified',
    name: 'Simplified Psoriasis Area and Severity Index',
    acronym: 'PASI',
    description: 'A tool to assess the severity and extent of psoriasis by evaluating erythema, induration, desquamation, and area of involvement across four body regions. This is a simplified version for demonstration.',
    condition: 'Psoriasis',
    keywords: ['pasi', 'psoriasis', 'severity', 'skin', 'index', 'erythema', 'induration', 'desquamation'],
    sourceType: 'Research',
    icon: Stethoscope,
    inputs: [
      { id: 'head_erythema', label: 'Head: Erythema (Redness)', type: 'select', options: pasiHeadErythemaOptions, defaultValue: 0, validation: getValidationSchema('select', pasiHeadErythemaOptions, 0, 4) },
      { id: 'head_induration', label: 'Head: Induration (Thickness)', type: 'select', options: pasiHeadIndurationOptions, defaultValue: 0, validation: getValidationSchema('select', pasiHeadIndurationOptions, 0, 4) },
      { id: 'head_desquamation', label: 'Head: Desquamation (Scaling)', type: 'select', options: pasiHeadDesquamationOptions, defaultValue: 0, validation: getValidationSchema('select', pasiHeadDesquamationOptions, 0, 4) },
      { id: 'head_area', label: 'Head: Area Affected (%)', type: 'select', options: pasiHeadAreaOptions, defaultValue: 0, validation: getValidationSchema('select', pasiHeadAreaOptions, 0, 6) },
    ],
    calculationLogic: (inputs) => {
      const h_e = Number(inputs.head_erythema);
      const h_i = Number(inputs.head_induration);
      const h_d = Number(inputs.head_desquamation);
      const h_a = Number(inputs.head_area);
      const sumHead = (h_e + h_i + h_d) * h_a * 0.1;
      const score = parseFloat(sumHead.toFixed(2));
      let interpretation = '';
      if (score === 0) interpretation = 'No Psoriasis symptoms or Cleared.';
      else if (score < 3) interpretation = 'Mild Psoriasis.';
      else if (score < 7) interpretation = 'Moderate Psoriasis.';
      else interpretation = 'Severe Psoriasis.';
      return { score, interpretation, details: { 'Head Score Component': parseFloat(sumHead.toFixed(2)) } };
    },
    references: ["Fredriksson T, Pettersson U. Severe psoriasis--oral therapy with a new retinoid. Dermatologica. 1978;157(4):238-44."]
  },
  {
    id: 'dlqi',
    name: 'Dermatology Life Quality Index',
    acronym: 'DLQI',
    description: 'A 10-question questionnaire to measure the impact of skin disease on a person\'s quality of life.',
    condition: 'Quality of Life',
    keywords: ['dlqi', 'quality of life', 'skin disease', 'impact', 'patient reported'],
    sourceType: 'Expert Consensus', 
    icon: ClipboardList,
    inputs: [
      ...Array.from({ length: 10 }, (_, i) => {
        const questionTexts = [
            "Over the last week, how itchy, sore, painful or stinging has your skin been?",
            "Over the last week, how embarrassed or self conscious have you been because of your skin?",
            "Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?",
            "Over the last week, how much has your skin influenced the clothes you wear?",
            "Over the last week, how much has your skin affected any social or leisure activities?",
            "Over the last week, how much has your skin made it difficult for you to do any sport?",
            "Over the last week, has your skin prevented you from working or studying?", // Q7
            "Over the last week, how much has your skin created problems with your partner or any of your close friends or relatives?",
            "Over the last week, how much has your skin caused any sexual difficulties?",
            "Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?"
        ];
        let q_options: InputOption[] = [
            { value: 3, label: 'Very much' },
            { value: 2, label: 'A lot' },
            { value: 1, label: 'A little' },
            { value: 0, label: 'Not at all' },
        ];
        if (i === 6) { // Question 7
            q_options.push({ value: 0, label: 'Not relevant (Scores 0)' }); 
        }
        return {
          id: `q${i + 1}`,
          label: `Q${i + 1}: ${questionTexts[i]}`,
          type: 'select' as 'select',
          options: q_options,
          defaultValue: 0,
          validation: getValidationSchema('select', q_options, 0, 3),
        };
      })
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const details: Record<string, number> = {};
      for (let i = 1; i <= 10; i++) {
        const val = Number(inputs[`q${i}`]) || 0;
        details[`Q${i}`] = val;
        score += val;
      }
      let interpretation = '';
      if (score <= 1) interpretation = 'No effect at all on patient\'s life.';
      else if (score <= 5) interpretation = 'Small effect on patient\'s life.';
      else if (score <= 10) interpretation = 'Moderate effect on patient\'s life.';
      else if (score <= 20) interpretation = 'Very large effect on patient\'s life.';
      else interpretation = 'Extremely large effect on patient\'s life.';
      return { score, interpretation, details };
    },
    references: ["Finlay AY, Khan GK. Dermatology Life Quality Index (DLQI)--a simple practical measure for routine clinical use. Clin Exp Dermatol. 1994 May;19(3):210-6."]
  },
   {
    id: 'scqoli-10',
    name: 'Simplified Cutaneous QoL Index (SCQOLI-10)',
    acronym: 'SCQOLI-10',
    description: 'A 10-item questionnaire for assessing quality of life in patients with chronic skin diseases.',
    condition: 'Quality of Life',
    keywords: ['scqoli-10', 'quality of life', 'chronic skin disease', 'patient reported'],
    sourceType: 'Expert Consensus',
    icon: Users,
    inputs: [
      { id: 'symptoms', label: 'Symptoms (itching, pain, discomfort)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'emotions', label: 'Emotions (sadness, anxiety, anger)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'daily_activities', label: 'Daily activities (work, household chores)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'sleep', label: 'Sleep', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'social_life', label: 'Social life and leisure', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'self_perception', label: 'Self-perception (feeling ashamed or embarrassed)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'relationships', label: 'Relationships with others', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'treatment_burden', label: 'Treatment burden (time, cost, side effects)', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'concentration', label: 'Concentration and memory', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
      { id: 'energy_vitality', label: 'Energy and vitality', type: 'select', options: [{value:0, label:'Never'}, {value:1, label:'Rarely'}, {value:2, label:'Sometimes'}, {value:3, label:'Often'}, {value:4, label:'Always'}], defaultValue: 0, validation: getValidationSchema('select', [{value:0, label:'Never'}], 0, 4) },
    ],
    calculationLogic: (inputs) => {
      const score = Object.values(inputs).reduce((sum: number, value) => sum + Number(value), 0);
      let interpretation = 'Interpretation based on total score (0-40): ';
      if (score <= 10) interpretation += 'Low impact on QoL.';
      else if (score <= 20) interpretation += 'Moderate impact on QoL.';
      else if (score <= 30) interpretation += 'High impact on QoL.';
      else interpretation += 'Very high impact on QoL.';
      return { score, interpretation };
    },
    references: ["Misery L, et al. Development and validation of a new tool for the global assessment of quality of life in patients with chronic skin disorders: the SCQOLI-10. J Eur Acad Dermatol Venereol. 2021."]
  },
  {
    id: "pasi",
    name: "Psoriasis Area and Severity Index (PASI)",
    acronym: "PASI",
    description: "Gold standard for assessing severity of extensive plaque psoriasis and monitoring treatment response.",
    condition: "Psoriasis", 
    keywords: ["pasi", "psoriasis", "plaque psoriasis", "severity", "index"],
    sourceType: 'Clinical Guideline',
    icon: Gauge,
    inputs: [
      ...(['h', 'u', 't', 'l'] as const).flatMap(regionAbbr => {
        const regionMap: Record<string, string> = { h: 'Head/Neck', u: 'Upper Limbs', t: 'Trunk', l: 'Lower Limbs' };
        const bsaPercent: Record<string, number> = { h: 10, u: 20, t: 30, l: 40 };
        const regionFullName = regionMap[regionAbbr];
        const regionDesc = `(${bsaPercent[regionAbbr]}% BSA, multiplier x${(bsaPercent[regionAbbr]/100).toFixed(1)})`; 
        
        const severityOptions: InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Slight/Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Marked/Severe"}, {value:4, label:"4-Very Severe"} ];
        const areaOptions: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90-100%)"} ];

        return [
          { id: `E_${regionAbbr}`, label: `${regionFullName} - Erythema (E) ${regionDesc}`, type: 'select', options: severityOptions, defaultValue:0, validation: getValidationSchema('select',severityOptions,0,4) },
          { id: `I_${regionAbbr}`, label: `${regionFullName} - Induration (I) ${regionDesc}`, type: 'select', options: severityOptions, defaultValue:0, validation: getValidationSchema('select',severityOptions,0,4) },
          { id: `S_${regionAbbr}`, label: `${regionFullName} - Scaling (S) ${regionDesc}`, type: 'select', options: severityOptions, defaultValue:0, validation: getValidationSchema('select',severityOptions,0,4) },
          { id: `A_${regionAbbr}`, label: `${regionFullName} - Area (A) ${regionDesc}`, type: 'select', options: areaOptions, defaultValue:0, description: "% region affected.", validation: getValidationSchema('select',areaOptions,0,6) },
        ];
      })
    ],
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
  },
  {
    id: "napsi",
    name: "Nail Psoriasis Severity Index (NAPSI)",
    acronym: "NAPSI",
    description: "Evaluates severity of psoriatic nail involvement. Each nail is divided into 4 quadrants.",
    condition: "Psoriasis",
    keywords: ["napsi", "psoriasis", "nail disorders", "nail", "severity"],
    sourceType: 'Clinical Guideline',
    icon: Fingerprint,
    inputs: [
      { id: "nail_count", label: "Number of Nails Assessed (1-20)", type: 'select', options: Array.from({length: 20}, (_, i) => ({value: i + 1, label: `${i+1} Nail(s)`})), defaultValue: 10, validation: getValidationSchema('select', Array.from({length: 20}, (_, i) => ({value: i + 1, label: `${i+1} Nail(s)`})), 1, 20) },
      ...Array.from({length: 20}, (_, i) => i + 1).flatMap(nailNum => ([
          { id: `nail_${nailNum}_matrix`, label: `Nail ${nailNum}: Matrix Score (0-4)`, type: 'number', min:0, max:4, defaultValue:0, description: "Quadrants w/ any: Pitting, Leukonychia, Red spots in lunula, Crumbling.", validation: getValidationSchema('number',undefined,0,4)},
          { id: `nail_${nailNum}_bed`, label: `Nail ${nailNum}: Bed Score (0-4)`, type: 'number', min:0, max:4, defaultValue:0, description: "Quadrants w/ any: Onycholysis, Splinter hemorrhages, Subungual hyperkeratosis, Oil drop discoloration.", validation: getValidationSchema('number',undefined,0,4)}
      ]))
    ],
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
  },
  {
    id: "pga_psoriasis",
    name: "Physician Global Assessment (PGA) for Psoriasis",
    acronym: "PGA Psoriasis",
    description: "Single-item clinician assessment of overall psoriasis severity. Scales vary.",
    condition: "Psoriasis",
    keywords: ["pga", "psoriasis", "physician global assessment", "severity"],
    sourceType: 'Research',
    icon: UserCheck,
    inputs: [
      {
        id: "pga_level", label: "Select PGA Level (Example 7-Level)", type: 'select',
        options: [ 
            { value: 0, label: "0 - Clear" }, { value: 1, label: "1 - Almost Clear / Minimal" }, { value: 2, label: "2 - Mild" },
            { value: 3, label: "3 - Mild to Moderate" }, { value: 4, label: "4 - Moderate" }, { value: 5, label: "5 - Moderate to Severe" }, { value: 6, label: "6 - Severe / Very Marked" }
        ],
        defaultValue: 0, validation: getValidationSchema('select',[ { value: 0, label: "0 - Clear" } ],0,6)
      }
    ],
    calculationLogic: (inputs) => {
        const pgaLevel = Number(inputs.pga_level);
        const options = [ 
            "Clear", "Almost Clear / Minimal", "Mild",
            "Mild to Moderate", "Moderate", "Moderate to Severe", "Severe / Very Marked"
        ];
        const pgaDescription = options[pgaLevel] || "N/A";
        const score = pgaLevel;
        const interpretation = `PGA for Psoriasis: Level ${score} (${pgaDescription}). Score directly reflects assessed severity. PGA 0 or 1 often a treatment goal.`;
        return { score, interpretation, details: { pga_description: pgaDescription } };
    },
    references: ["Various versions; widely used in clinical trials."]
  },
  {
    id: "pssi",
    name: "Psoriasis Scalp Severity Index (PSSI)",
    acronym: "PSSI",
    description: "Specifically assesses the severity of scalp psoriasis.",
    condition: "Psoriasis",
    keywords: ["pssi", "psoriasis", "scalp psoriasis", "scalp", "severity"],
    sourceType: 'Clinical Guideline',
    icon: User, 
    inputs: [
      { id: "pssi_erythema", label: "Scalp Erythema (E)", type: 'select', options: [ {value:0, label:"0-None"}, {value:1, label:"1-Slight"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}, {value:4, label:"4-Very Severe"} ], defaultValue:0, validation: getValidationSchema('select', [ {value:0, label:"0-None"} ],0,4) },
      { id: "pssi_thickness", label: "Scalp Thickness (T)", type: 'select', options: [ {value:0, label:"0-None"}, {value:1, label:"1-Slight"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}, {value:4, label:"4-Very Severe"} ], defaultValue:0, validation: getValidationSchema('select', [ {value:0, label:"0-None"} ],0,4) },
      { id: "pssi_scaling", label: "Scalp Scaling (S)", type: 'select', options: [ {value:0, label:"0-None"}, {value:1, label:"1-Slight"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}, {value:4, label:"4-Very Severe"} ], defaultValue:0, validation: getValidationSchema('select', [ {value:0, label:"0-None"} ],0,4) },
      { id: "pssi_area", label: "Scalp Area (A)", type: 'select', options: [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90+%"} ], defaultValue:0, description: "% scalp area.", validation: getValidationSchema('select', [ {value:0, label:"0 (0%)"} ],0,6) }
    ],
    calculationLogic: (inputs) => {
        const E = Number(inputs.pssi_erythema) || 0;
        const T = Number(inputs.pssi_thickness) || 0;
        const S = Number(inputs.pssi_scaling) || 0;
        const A = Number(inputs.pssi_area) || 0;
        const score = (E + T + S) * A;
        const interpretation = `PSSI Score: ${score} (Range: 0-72). Higher score indicates more severe scalp psoriasis. (E:${E} + T:${T} + S:${S}) x A:${A}.`;
        return { score, interpretation, details: { Erythema: E, Thickness: T, Scaling: S, Area_Score: A } };
    },
    references: ["Ortonne JP, et al. J Eur Acad Dermatol Venereol. 2004;18(Suppl 2):28."]
  },
  // ATOPIC DERMATITIS
  {
    id: "scorad",
    name: "SCORing Atopic Dermatitis (SCORAD)",
    acronym: "SCORAD",
    description: "Comprehensive assessment of extent and severity of atopic dermatitis (AD). Uses Rule of Nines for extent.",
    condition: "Atopic Dermatitis",
    keywords: ["scorad", "atopic dermatitis", "ad", "eczema", "severity", "extent"],
    sourceType: 'Expert Consensus',
    icon: ScalingIcon,
    inputs: [
      { id: "A_extent", label: "A: Extent (BSA %)", type: 'number', min: 0, max: 100, defaultValue: 0, description: "Use Rule of Nines.", validation: getValidationSchema('number',undefined,0,100) },
      { id: "B_erythema", label: "B: Intensity - Erythema", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "B_oedema", label: "B: Intensity - Oedema/Papulation", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "B_oozing", label: "B: Intensity - Oozing/Crusting", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "B_excoriations", label: "B: Intensity - Excoriations", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "B_lichenification", label: "B: Intensity - Lichenification", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "B_dryness", label: "B: Intensity - Dryness (non-inflamed areas)", type: 'select', options: [{value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"}], defaultValue: 0, validation: getValidationSchema('select',[{value:0, label:"0-None"}],0,3) },
      { id: "C_pruritus", label: "C: Subjective - Pruritus (VAS 0-10, avg last 3 days/nights)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
      { id: "C_sleeplessness", label: "C: Subjective - Sleeplessness (VAS 0-10, avg last 3 days/nights)", type: 'number', min: 0, max: 10, defaultValue: 0, validation: getValidationSchema('number',undefined,0,10) },
    ],
    calculationLogic: (inputs) => {
        const A = Number(inputs.A_extent) || 0;
        const B_sum = (Number(inputs.B_erythema)||0) + (Number(inputs.B_oedema)||0) + (Number(inputs.B_oozing)||0) + (Number(inputs.B_excoriations)||0) + (Number(inputs.B_lichenification)||0) + (Number(inputs.B_dryness)||0);
        const C_sum = (Number(inputs.C_pruritus)||0) + (Number(inputs.C_sleeplessness)||0);
        const scorad = (A/5) + (7*B_sum/2) + C_sum;
        const oScorad = (A/5) + (7*B_sum/2); 

        const score = parseFloat(scorad.toFixed(2));
        let interpretation = `SCORAD: ${score} (Range: 0-103). oSCORAD: ${oScorad.toFixed(2)} (Range: 0-83). `;
        if (score <= 24) interpretation += "Severity (SCORAD): Mild. "; else if (score <= 49) interpretation += "Severity (SCORAD): Moderate. "; else if (score <= 74) interpretation += "Severity (SCORAD): Severe. "; else interpretation += "Severity (SCORAD): Very Severe. ";
        if (oScorad < 15) interpretation += "Severity (oSCORAD): Mild."; else if (oScorad <= 40) interpretation += "Severity (oSCORAD): Moderate."; else interpretation += "Severity (oSCORAD): Severe.";
        
        return { score, interpretation, details: { A_Extent_BSA: A, B_Intensity_Sum: B_sum, C_Subjective_Sum: C_sum, oSCORAD: parseFloat(oScorad.toFixed(2)) } };
    },
    references: ["European Task Force on Atopic Dermatitis. Dermatology. 1993."]
  },
  {
    id: "easi",
    name: "Eczema Area and Severity Index (EASI)",
    acronym: "EASI",
    description: "Measures extent (area) and severity of Atopic Dermatitis (AD).",
    condition: "Atopic Dermatitis",
    keywords: ["easi", "atopic dermatitis", "ad", "eczema", "severity", "area"],
    sourceType: 'Clinical Guideline',
    icon: SlidersHorizontal,
    inputs: [
      { id: "age_group", label: "Age Group", type: 'select', options: [ {value: "adult", label: ">7 years"}, {value: "child", label: "0-7 years"} ], defaultValue: "adult", validation: getValidationSchema('select', [ {value: "adult", label: ">7 years"}])},
      ...(['head_neck', 'trunk', 'upper_limbs', 'lower_limbs'] as const).flatMap(regionId => {
        const regionNames: Record<string, string> = { head_neck: 'Head/Neck', trunk: 'Trunk', upper_limbs: 'Upper Limbs', lower_limbs: 'Lower Limbs' };
        const multipliers: Record<string, {adult: number, child: number}> = { head_neck: {adult: 0.1, child: 0.2}, trunk: {adult: 0.3, child: 0.3}, upper_limbs: {adult: 0.2, child: 0.2}, lower_limbs: {adult: 0.4, child: 0.3} };
        const regionFullName = regionNames[regionId];
        const regionDesc = `(Adult x${multipliers[regionId].adult}, Child x${multipliers[regionId].child})`;
        const areaOptions:InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90+%"} ];
        const severityOptions:InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"} ];
        return [
          { id: `${regionId}_area`, label: `${regionFullName} - Area (A) ${regionDesc}`, type: 'select', options: areaOptions, defaultValue: 0, validation: getValidationSchema('select',areaOptions,0,6) },
          { id: `${regionId}_erythema`, label: `${regionFullName} - Erythema ${regionDesc}`, type: 'select', options: severityOptions, defaultValue: 0, validation: getValidationSchema('select',severityOptions,0,3) },
          { id: `${regionId}_induration`, label: `${regionFullName} - Induration/Papulation ${regionDesc}`, type: 'select', options: severityOptions, defaultValue: 0, validation: getValidationSchema('select',severityOptions,0,3) },
          { id: `${regionId}_excoriation`, label: `${regionFullName} - Excoriation ${regionDesc}`, type: 'select', options: severityOptions, defaultValue: 0, validation: getValidationSchema('select',severityOptions,0,3) },
          { id: `${regionId}_lichenification`, label: `${regionFullName} - Lichenification ${regionDesc}`, type: 'select', options: severityOptions, defaultValue: 0, validation: getValidationSchema('select',severityOptions,0,3) },
        ];
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
  },
  {
    id: "abcde_melanoma",
    name: "ABCDE Rule for Melanoma",
    acronym: "ABCDE",
    description: "A mnemonic for common signs of melanoma. If any are present, further evaluation is recommended.",
    condition: "Melanoma Screening",
    keywords: ["abcde", "melanoma", "skin cancer", "screening", "mole"],
    sourceType: 'Research', 
    icon: SearchCheck,
    inputs: [
      { id: "A_asymmetry", label: "A - Asymmetry (one half of the mole doesn't match the other)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "B_border", label: "B - Border irregularity (edges are ragged, notched, or blurred)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "C_color", label: "C - Color variegation (color is not uniform, with shades of tan, brown, black, or sometimes white, red, or blue)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "D_diameter", label: "D - Diameter greater than 6mm (about the size of a pencil eraser)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "E_evolving", label: "E - Evolving (mole changes in size, shape, color, elevation, or another trait, or any new symptom such as bleeding, itching or crusting)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
    ],
    calculationLogic: (inputs) => {
      const features: string[] = [];
      if (inputs.A_asymmetry) features.push("Asymmetry");
      if (inputs.B_border) features.push("Border irregularity");
      if (inputs.C_color) features.push("Color variegation");
      if (inputs.D_diameter) features.push("Diameter >6mm");
      if (inputs.E_evolving) features.push("Evolving");

      const score = features.length; 
      let interpretation = "";
      if (score > 0) {
        interpretation = `Warning: ${features.join(', ')} present. ${score} feature(s) noted. Lesion requires further evaluation by a healthcare professional.`;
      } else {
        interpretation = "No ABCDE signs noted. Continue regular skin checks.";
      }
      return { score, interpretation, details: { positive_features: features.join(', ') || 'None' } };
    },
    references: ["Rigel DS, et al. J Am Acad Dermatol. 1985. American Academy of Dermatology recommendations."]
  },
  {
    id: "hurley_staging_hs",
    name: "Hurley Staging System for Hidradenitis Suppurativa (HS)",
    acronym: "Hurley Staging",
    description: "A simple clinical staging system to classify the severity of Hidradenitis Suppurativa.",
    condition: "Hidradenitis Suppurativa",
    keywords: ["hurley", "hs", "hidradenitis suppurativa", "staging", "severity"],
    sourceType: 'Research', 
    icon: AlignLeft,
    inputs: [
      {
        id: "hurley_stage",
        label: "Select Hurley Stage",
        type: 'select',
        options: [
          { value: 1, label: "Stage 1: Abscess formation (single or multiple) without sinus tracts and cicatrization (scarring)." },
          { value: 2, label: "Stage 2: Recurrent abscesses with tract formation and cicatrization. Single or multiple widely separated lesions." },
          { value: 3, label: "Stage 3: Diffuse or almost diffuse involvement, or multiple interconnected tracts and abscesses across an entire area." }
        ],
        defaultValue: 1,
        validation: getValidationSchema('select',[{ value: 1, label: "Stage 1" }],1,3)
      }
    ],
    calculationLogic: (inputs) => {
      const stage = Number(inputs.hurley_stage);
      let interpretation = `Hurley Stage ${stage}. `;
      const stageDescriptions: Record<number, string> = {
        1: "Stage 1 indicates abscess formation (single or multiple) without sinus tracts and scarring. Typically considered Mild HS.",
        2: "Stage 2 indicates recurrent abscesses with tract formation and scarring, with single or multiple widely separated lesions. Typically considered Moderate HS.",
        3: "Stage 3 indicates diffuse or almost diffuse involvement, or multiple interconnected tracts and abscesses across an entire area. Typically considered Severe HS."
      };
      interpretation += stageDescriptions[stage] || "Invalid stage selected.";
      return { score: stage, interpretation, details: { stage_description: stageDescriptions[stage] || "N/A" } };
    },
    references: ["Hurley HJ. Dermatol Surg. 1989;15(6):557-61."]
  },
  {
    id: "fitzpatrick_skin_type",
    name: "Fitzpatrick Skin Type Classification",
    acronym: "Fitzpatrick Scale",
    description: "Classifies skin type based on its reaction to UV light exposure (sunburning and tanning ability).",
    condition: "Skin Typing",
    keywords: ["fitzpatrick", "skin type", "sun sensitivity", "uv", "tanning"],
    sourceType: 'Research',
    icon: Sun,
    inputs: [
      {
        id: "fitzpatrick_type",
        label: "Select Fitzpatrick Skin Type",
        type: 'select',
        options: [
          { value: 1, label: "Type I: Always burns, never tans (pale white skin; blond or red hair; blue eyes; freckles)." },
          { value: 2, label: "Type II: Usually burns, tans minimally (white skin; fair; blond or red hair; blue, green, or hazel eyes)." },
          { value: 3, label: "Type III: Sometimes mild burn, tans uniformly (cream white skin; fair with any eye or hair color; very common)." },
          { value: 4, label: "Type IV: Burns minimally, always tans well (moderate brown skin; typical Mediterranean Caucasian skin)." },
          { value: 5, label: "Type V: Very rarely burns, tans very easily (dark brown skin; Middle Eastern skin types)." },
          { value: 6, label: "Type VI: Never burns, tans very easily (deeply pigmented dark brown to black skin)." }
        ],
        defaultValue: 3,
        validation: getValidationSchema('select', [{ value: 1, label: "Type I" }],1,6)
      }
    ],
    calculationLogic: (inputs) => {
      const type = Number(inputs.fitzpatrick_type);
      const typeDescriptions: Record<number, string> = {
        1: "Type I: Always burns, never tans. Extremely sun sensitive.",
        2: "Type II: Usually burns, tans minimally. Very sun sensitive.",
        3: "Type III: Sometimes mild burn, tans uniformly. Sun sensitive.",
        4: "Type IV: Burns minimally, always tans well. Minimally sun sensitive.",
        5: "Type V: Very rarely burns, tans very easily. Sun insensitive.",
        6: "Type VI: Never burns, tans very easily. Sun insensitive."
      };
      const score = type; 
      const interpretation = `Fitzpatrick Skin Type ${type}. ${typeDescriptions[type] || "Invalid type selected."}`;
      return { score, interpretation, details: { classification_description: typeDescriptions[type] || "N/A" } };
    },
    references: ["Fitzpatrick TB. Arch Dermatol. 1988;124(6):869-71."]
  },
  {
    id: "sassad", 
    name: "Six Area, Six Sign AD Severity Score (SASSAD)", 
    acronym: "SASSAD", 
    condition: "Atopic Dermatitis",
    keywords: ["sassad", "atopic dermatitis", "ad", "eczema", "severity", "six area six sign"],
    description: "Records and monitors Atopic Dermatitis (AD) activity by grading 6 signs (0-3) across 6 body sites. Lack of anchors for grades 1-3.", 
    sourceType: 'Clinical Guideline',
    icon: Scaling, 
    inputs: [ 
        ...["Arms", "Hands", "Legs", "Feet", "Head_Neck", "Trunk"].flatMap(areaName => {
            const areaId = areaName.toLowerCase().replace('/','_');
            const signOptions: InputOption[] = [{value:0, label:"0-None"},{value:1, label:"1-Mild"},{value:2, label:"2-Moderate"},{value:3, label:"3-Severe"}];
            return ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"].map(signName => {
                const signId = signName.toLowerCase();
                return {
                    id: `${signId}_${areaId}`,
                    label: `${areaName.replace('_','/')} - ${signName}`,
                    type: 'select',
                    options: signOptions,
                    defaultValue: 0,
                    validation: getValidationSchema('select', signOptions, 0, 3)
                } as InputConfig;
            });
        })
    ],
    calculationLogic: (inputs) => { 
        let totalScore = 0; 
        const siteScores: Record<string, number> = {};
        const areas = ["Arms", "Hands", "Legs", "Feet", "Head_Neck", "Trunk"];
        const signs = ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"];

        areas.forEach(areaName => {
            const areaId = areaName.toLowerCase().replace('/','_');
            let currentSiteScore = 0;
            signs.forEach(signName => {
                const signId = signName.toLowerCase();
                currentSiteScore += Number(inputs[`${signId}_${areaId}`]) || 0;
            });
            siteScores[areaName.replace('_','/')] = currentSiteScore;
            totalScore += currentSiteScore;
        });
        const interpretation = `Total SASSAD Score: ${totalScore} (Range: 0-108). Higher score indicates more severe AD. No standard severity bands universally defined.`;
        return { score: totalScore, interpretation, details: siteScores };
    },
    references: ["Berth-Jones J, et al. Br J Dermatol. 1996."]
  },
  {
    id: "viga_ad", 
    name: "Validated IGA for AD (vIGA-AD™)", 
    acronym: "vIGA-AD", 
    condition: "Atopic Dermatitis",
    keywords: ["viga-ad", "iga", "atopic dermatitis", "ad", "eczema", "physician global assessment", "validated"],
    description: "Static clinician assessment of AD severity.", 
    sourceType: 'Research', 
    icon: UserCheck, 
    inputs: [ 
      { 
        id: "viga_grade", 
        label: "Select vIGA-AD™ Grade", 
        type: 'select', 
        options: [ 
          { value: 0, label: "0 - Clear: No inflammatory signs of AD (no erythema, no induration/papulation, no oozing/crusting)." }, 
          { value: 1, label: "1 - Almost Clear: Barely perceptible erythema, barely perceptible induration/papulation, and no oozing/crusting." }, 
          { value: 2, label: "2 - Mild: Mild erythema, mild induration/papulation, and +/- oozing/crusting." }, 
          { value: 3, label: "3 - Moderate: Moderate erythema, moderate induration/papulation, and +/- oozing/crusting." }, 
          { value: 4, label: "4 - Severe: Marked erythema, marked induration/papulation/lichenification, and +/- oozing/crusting." } 
        ], 
        defaultValue: 0,
        validation: getValidationSchema('select', [ { value: 0, label: "0 - Clear" } ], 0, 4)
      }
    ],
    calculationLogic: (inputs) => { 
        const grade = Number(inputs.viga_grade);
        const gradeMap: Record<number, string> = {0:"Clear",1:"Almost Clear",2:"Mild",3:"Moderate",4:"Severe"};
        const gradeDescriptionMap: Record<number, string> = {
            0:"No inflammatory signs of AD.",
            1:"Barely perceptible erythema, barely perceptible induration/papulation, no oozing/crusting.",
            2:"Mild erythema, mild induration/papulation, +/- oozing/crusting.",
            3:"Moderate erythema, moderate induration/papulation, +/- oozing/crusting.",
            4:"Marked erythema, marked induration/papulation/lichenification, +/- oozing/crusting."
        };
        const interpretation = `vIGA-AD™ Grade: ${grade} (${gradeMap[grade]}). ${gradeDescriptionMap[grade]}`;
        return { score: grade, interpretation, details: { grade_text: gradeMap[grade], description: gradeDescriptionMap[grade] } }; 
    },
    references: ["Developed for clinical trials, e.g., by the Eczema Council and regulatory bodies like the FDA."]
  },
  {
    id: "hecsi", 
    name: "Hand Eczema Severity Index (HECSI)", 
    acronym: "HECSI", 
    condition: "Hand Eczema",
    keywords: ["hecsi", "hand eczema", "eczema", "severity", "hand"],
    description: "Assesses severity of hand eczema.", 
    sourceType: 'Clinical Guideline',
    icon: Hand, 
    inputs: [ 
        ...["Fingertips", "Fingers_excluding_tips", "Palms", "Backs_of_Hands", "Wrists"].flatMap(areaName => {
            const areaId = areaName.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
            const signs = [
                {id: "erythema", name: "Erythema"}, 
                {id: "induration_papulation", name: "Induration/Papulation"},
                {id: "vesicles", name: "Vesicles"},
                {id: "fissures", name: "Fissures"},
                {id: "scaling", name: "Scaling"},
                {id: "oedema", name: "Oedema"}
            ];
            const signOptions: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];
            const areaAffectedOptions: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-25%)"}, {value:2, label:"2 (26-50%)"}, {value:3, label:"3 (51-75%)"}, {value:4, label:"4 (76-100%)"} ];
            return [
                ...signs.map(sign => ({
                    id: `${areaId}_${sign.id}`,
                    label: `${areaName.replace(/_/g, ' ')} - ${sign.name} (0-3)`,
                    type: 'select',
                    options: signOptions,
                    defaultValue: 0,
                    validation: getValidationSchema('select', signOptions, 0, 3)
                } as InputConfig)),
                {
                    id: `${areaId}_area_affected`,
                    label: `${areaName.replace(/_/g, ' ')} - Area Affected (0-4)`,
                    type: 'select',
                    options: areaAffectedOptions,
                    defaultValue: 0,
                    validation: getValidationSchema('select', areaAffectedOptions, 0, 4)
                } as InputConfig
            ];
        })
    ],
    calculationLogic: (inputs) => { 
        let totalHecsiScore = 0; 
        const areaDetails: Record<string, any> = {};
        const areas = [
            {name: "Fingertips", id: "fingertips"}, 
            {name: "Fingers (excluding tips)", id: "fingers_excluding_tips"}, 
            {name: "Palms", id: "palms"}, 
            {name: "Backs of Hands", id: "backs_of_hands"}, 
            {name: "Wrists", id: "wrists"}
        ];
        const signs = [
            {id: "erythema", name: "Erythema"}, 
            {id: "induration_papulation", name: "Induration/Papulation"},
            {id: "vesicles", name: "Vesicles"},
            {id: "fissures", name: "Fissures"},
            {id: "scaling", name: "Scaling"},
            {id: "oedema", name: "Oedema"}
        ];

        areas.forEach(area => {
            let intensitySum = 0;
            const currentAreaSignScores: Record<string, number> = {};
            signs.forEach(sign => {
                const signScore = Number(inputs[`${area.id}_${sign.id}`]) || 0;
                intensitySum += signScore;
                currentAreaSignScores[sign.name] = signScore;
            });
            const areaAffectedScore = Number(inputs[`${area.id}_area_affected`]) || 0;
            const areaScore = intensitySum * areaAffectedScore;
            totalHecsiScore += areaScore;
            areaDetails[area.name] = {intensity_sum: intensitySum, area_affected_score: areaAffectedScore, regional_score: areaScore, signs: currentAreaSignScores};
        });

        const score = totalHecsiScore;
        let interpretation = `Total HECSI Score: ${score} (Range: 0-360). `;
        if (score === 0) interpretation += "Clear.";
        else if (score <= 16) interpretation += "Almost clear.";
        else if (score <= 37) interpretation += "Moderate hand eczema."; 
        else if (score <= 116) interpretation += "Severe hand eczema.";
        else interpretation += "Very severe hand eczema.";
        interpretation += " (Severity bands example: 0 Clear, 1-16 Almost Clear, 17-37 Moderate, 38-116 Severe, >116 Very Severe - actual bands may vary)";
        
        return { score, interpretation, details: areaDetails };
    },
    references: ["Held E, et al. Br J Dermatol. 2005."]
  },
  {
    id: "dasi", 
    name: "Dyshidrotic Eczema Area and Severity Index (DASI)", 
    acronym: "DASI", 
    condition: "Dyshidrotic Eczema",
    keywords: ["dasi", "dyshidrotic eczema", "pompholyx", "eczema", "severity"],
    description: "Assesses severity of dyshidrotic eczema (pompholyx).", 
    sourceType: 'Clinical Guideline', 
    icon: Waves, 
    inputs: [ 
      { id:"vesicles_cm2", label:"Vesicles/cm² (V)", type:'select', options:[{value:0,label:"0 (None)"},{value:1,label:"1 (1-10/cm²)"},{value:2,label:"2 (11-30/cm²)"},{value:3,label:"3 (>30/cm²)"}], defaultValue:0, validation: getValidationSchema('select', [{value:0,label:"0 (None)"}], 0,3) }, 
      { id:"erythema", label:"Erythema (E)", type:'select', options:[{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}], defaultValue:0, validation: getValidationSchema('select', [{value:0,label:"0-None"}], 0,3) }, 
      { id:"desquamation", label:"Desquamation (D)", type:'select', options:[{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}], defaultValue:0, validation: getValidationSchema('select', [{value:0,label:"0-None"}], 0,3) }, 
      { id:"itching", label:"Itching (I) - past 24h", type:'select', options:[{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}], defaultValue:0, validation: getValidationSchema('select', [{value:0,label:"0-None"}], 0,3) }, 
      { id:"extension_percent", label:"Extension % (Ext)", type:'number', min:0, max:100, defaultValue:0, description:"Percentage of hands/feet affected.", validation: getValidationSchema('number',undefined,0,100)} 
    ],
    calculationLogic: (inputs) => { 
        const V = Number(inputs.vesicles_cm2) || 0;
        const E = Number(inputs.erythema) || 0;
        const D = Number(inputs.desquamation) || 0;
        const I = Number(inputs.itching) || 0;
        const Ext_raw = Number(inputs.extension_percent) || 0;

        let Ext_score = 0;
        if (Ext_raw === 0) Ext_score = 0;
        else if (Ext_raw <= 10) Ext_score = 1;
        else if (Ext_raw <= 25) Ext_score = 2;
        else if (Ext_raw <= 50) Ext_score = 3;
        else if (Ext_raw <= 75) Ext_score = 4;
        else Ext_score = 5;

        const dasiScore = (V + E + D + I) * Ext_score;
        
        let interpretation = `DASI Score: ${dasiScore} (Range: 0-60). `;
        if (dasiScore === 0) interpretation += "Clear.";
        else if (dasiScore <= 15) interpretation += "Mild dyshidrotic eczema.";
        else if (dasiScore <= 30) interpretation += "Moderate dyshidrotic eczema.";
        else interpretation += "Severe dyshidrotic eczema.";
        interpretation += " (Severity bands: 0 Clear, 1-15 Mild, 16-30 Moderate, 31-60 Severe)";

        return { score: dasiScore, interpretation, details: { V, E, D, I, Ext_raw, Ext_score } };
    },
    references: ["Vocks E, et al. Dermatology. 2000;201(3):200-4."]
  },
  // ACNE
  {
    id: "iga_acne", 
    name: "IGA for Acne Vulgaris", 
    acronym: "IGA Acne", 
    condition: "Acne Vulgaris",
    keywords: ["iga", "acne", "acne vulgaris", "physician global assessment", "severity"],
    description: "Static clinician assessment of overall facial acne severity.", 
    sourceType: 'Research', 
    icon: UserCheck, 
    inputs: [ 
      { id: "current_iga_grade", label: "Current IGA Grade", type: 'select', options: [ {value:0,label:"0 - Clear"}, {value:1,label:"1 - Almost Clear"}, {value:2,label:"2 - Mild"}, {value:3,label:"3 - Moderate"}, {value:4,label:"4 - Severe"} ], defaultValue: 0, validation: getValidationSchema('select', [ {value:0,label:"0 - Clear"} ],0,4)},
      { id: "baseline_iga_grade", label: "Baseline IGA Grade (for treatment success)", type: 'select', options: [ {value:-1,label:"N/A"},{value:0,label:"0 - Clear"}, {value:1,label:"1 - Almost Clear"}, {value:2,label:"2 - Mild"}, {value:3,label:"3 - Moderate"}, {value:4,label:"4 - Severe"} ], defaultValue: -1, validation: getValidationSchema('select', [ {value:-1,label:"N/A"} ],-1,4)}
    ],
    calculationLogic: (inputs) => { 
        const currentGrade = Number(inputs.current_iga_grade);
        const baselineGrade = Number(inputs.baseline_iga_grade);
        let treatmentSuccess = "N/A";
        if (baselineGrade !== -1) {
            treatmentSuccess = (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) ? "Achieved" : "Not Achieved";
        }
        const gradeMap: Record<number, string> = {0:"Clear",1:"Almost Clear",2:"Mild",3:"Moderate",4:"Severe", [-1]:"N/A"};
        
        let interpretation = `Current IGA Acne Grade: ${currentGrade} (${gradeMap[currentGrade]}). `;
        if (baselineGrade !== -1) {
            interpretation += `Baseline IGA Grade: ${baselineGrade} (${gradeMap[baselineGrade]}). Treatment Success: ${treatmentSuccess}.`;
        } else {
            interpretation += "Baseline not provided for treatment success assessment.";
        }
        
        return { score: currentGrade, interpretation, details: { current_grade_text: gradeMap[currentGrade], baseline_grade: baselineGrade === -1 ? 'N/A' : baselineGrade, baseline_grade_text: gradeMap[baselineGrade], treatment_success: treatmentSuccess } }; 
    },
    references: ["FDA guidance documents for acne clinical trials. Example: Guidance for Industry Acne Vulgaris: Developing Drugs for Treatment."]
  },
  {
    id: "gags", 
    name: "Global Acne Grading System (GAGS)", 
    acronym: "GAGS", 
    condition: "Acne Vulgaris",
    keywords: ["gags", "acne", "acne vulgaris", "global acne grading system", "severity"],
    description: "Global score for acne severity based on lesion type (comedones, papules, pustules, nodules) and location factors.", 
    sourceType: 'Clinical Guideline',
    icon: Calculator, 
    inputs: [ 
        ...[{id:"forehead",name:"Forehead",factor:2},{id:"r_cheek",name:"Right Cheek",factor:2},{id:"l_cheek",name:"Left Cheek",factor:2},{id:"nose",name:"Nose",factor:1},{id:"chin",name:"Chin",factor:1},{id:"chest_upper_back",name:"Chest & Upper Back",factor:3}].map(loc=>({ 
            id:`gags_${loc.id}`, 
            label:`${loc.name} (Factor x${loc.factor})`, 
            type:'select', 
            options:[
                {value:0,label:"0 - No lesions"},
                {value:1,label:"1 - <10 Comedones"},
                {value:2,label:"2 - 10-20 Comedones OR <10 Papules"},
                {value:3,label:"3 - >20 Comedones OR 10-20 Papules OR <10 Pustules"},
                {value:4,label:"4 - >20 Papules OR 10-20 Pustules OR <5 Nodules"}
            ], 
            defaultValue:0, 
            description:"Predominant lesion grade (0-4).",
            validation: getValidationSchema('select', [{value:0,label:"0 - No lesions"}], 0, 4)
        }))
    ],
    calculationLogic: (inputs) => { 
        let totalScore = 0; 
        const locationScores: Record<string, {grade: number, score: number}> = {};
        const locations = [
            {id:"forehead",name:"Forehead",factor:2},
            {id:"r_cheek",name:"Right Cheek",factor:2},
            {id:"l_cheek",name:"Left Cheek",factor:2},
            {id:"nose",name:"Nose",factor:1},
            {id:"chin",name:"Chin",factor:1},
            {id:"chest_upper_back",name:"Chest & Upper Back",factor:3}
        ];
        locations.forEach(loc=>{
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
  },
  {
    id: "acneqol", 
    name: "Acne-Specific Quality of Life (Acne-QoL)", 
    acronym: "Acne-QoL", 
    condition: "Quality of Life",
    keywords: ["acneqol", "acne", "quality of life", "patient reported"],
    description: "Measures the impact of facial acne on quality of life across several domains. Total score interpretation depends on the specific version and scoring.", 
    sourceType: 'Research',
    icon: MessageSquare, 
    inputs: [ 
      { id:"total_score", label: "Total Acne-QoL Score", type:'number', defaultValue:0, description:"Enter the calculated total score from the questionnaire. Range and interpretation depend on the version used (e.g., original 19-item sum, or standardized 0-100).", validation: getValidationSchema('number')} 
    ],
    calculationLogic: (inputs) => { 
        const score = Number(inputs.total_score)||0; 
        const interpretation = `Acne-QoL Total Score: ${score}. For the original 19-item version (sum of item scores), a lower score indicates better QoL. For standardized versions (e.g., 0-100 scale), a higher score often indicates worse QoL. Check specific version guidelines for interpretation.`;
        return { score, interpretation, details: { score_type: "User-entered total score" } }; 
    },
    references: ["Martin AR, Lookingbill DP, Botek A, et al. Development of a new acne-specific quality of life questionnaire (Acne-QoL). J Am Acad Dermatol. 1998;39(3):415-421.", "Fehnel SE, McLeod LD, Brandman J, et al. Responsiveness of the Acne-Specific Quality of Life Questionnaire (Acne-QoL) to treatment for acne vulgaris in a placebo-controlled clinical trial. Qual Life Res. 2002;11(8):809-816."]
  }
];
    
