
import type { LucideIcon } from 'lucide-react';
import type { Tool } from './types';
import { 
  Calculator, Stethoscope, ClipboardList, Users, FileText, Pill, 
  Users2, Thermometer, Scaling, Wind, AlignLeft, SquarePen, UserCheck, Activity, 
  CheckCircle, ListChecks, MessageSquare, FolderHeart, ShieldAlert, Brain, 
  BarChart, Sun, Eye, Scissors, HelpCircle, Hand, Type, FileHeart, ShieldQuestion, Zap,
  ScalingIcon, Gauge, Fingerprint, SlidersHorizontal, Shield, Atom, Dot, Waves, UserCog,
  HeartPulse, ShieldHalf, Palette, SearchCheck, Baby, User, Footprints, Puzzle, CircleDot, Check, CloudDrizzle, Presentation,
  Calendar // Added Calendar icon
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

const severityOptions0to4: InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Slight/Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Marked/Severe"}, {value:4, label:"4-Very Severe"} ];
const areaOptions0to6: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90-100%)"} ];


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
        
        return [
          { id: `E_${regionAbbr}`, label: `${regionFullName} - Erythema (E) ${regionDesc}`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `I_${regionAbbr}`, label: `${regionFullName} - Induration (I) ${regionDesc}`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `S_${regionAbbr}`, label: `${regionFullName} - Scaling (S) ${regionDesc}`, type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select',severityOptions0to4,0,4) },
          { id: `A_${regionAbbr}`, label: `${regionFullName} - Area (A) ${regionDesc}`, type: 'select', options: areaOptions0to6, defaultValue:0, description: "% region affected.", validation: getValidationSchema('select',areaOptions0to6,0,6) },
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
      { id: "pssi_erythema", label: "Scalp Erythema (E)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
      { id: "pssi_thickness", label: "Scalp Thickness (T)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
      { id: "pssi_scaling", label: "Scalp Scaling (S)", type: 'select', options: severityOptions0to4, defaultValue:0, validation: getValidationSchema('select', severityOptions0to4,0,4) },
      { id: "pssi_area", label: "Scalp Area (A)", type: 'select', options: areaOptions0to6, defaultValue:0, description: "% scalp area.", validation: getValidationSchema('select', areaOptions0to6,0,6) }
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
        const areaOptionsEASI:InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90+%"} ];
        const severityOptionsEASI:InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Severe"} ];
        return [
          { id: `${regionId}_area`, label: `${regionFullName} - Area (A) ${regionDesc}`, type: 'select', options: areaOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',areaOptionsEASI,0,6) },
          { id: `${regionId}_erythema`, label: `${regionFullName} - Erythema ${regionDesc}`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
          { id: `${regionId}_induration`, label: `${regionFullName} - Induration/Papulation ${regionDesc}`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
          { id: `${regionId}_excoriation`, label: `${regionFullName} - Excoriation ${regionDesc}`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
          { id: `${regionId}_lichenification`, label: `${regionFullName} - Lichenification ${regionDesc}`, type: 'select', options: severityOptionsEASI, defaultValue: 0, validation: getValidationSchema('select',severityOptionsEASI,0,3) },
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

      const score = features.length; // Number of positive features
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
            const signOptionsSASSAD: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];
            return ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"].map(signName => {
                const signId = signName.toLowerCase();
                return {
                    id: `${signId}_${areaId}`,
                    label: `${areaName.replace('_','/')} - ${signName}`,
                    type: 'select',
                    options: signOptionsSASSAD,
                    defaultValue: 0,
                    validation: getValidationSchema('select', signOptionsSASSAD, 0, 3)
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
            const currentAreaSignValues: Record<string, number> = {};
            signs.forEach(signName => {
                const signId = signName.toLowerCase();
                const val = Number(inputs[`${signId}_${areaId}`]) || 0;
                currentSiteScore += val;
                currentAreaSignValues[signName] = val;
            });
            siteScores[areaName.replace('_','/')] = currentSiteScore; // This stores sum for the site
            totalScore += currentSiteScore;
        });
        const interpretation = `Total SASSAD Score: ${totalScore} (Range: 0-108). Higher score indicates more severe AD. No standard severity bands universally defined.`;
        // For details, we can break down by site and then by sign within that site if needed, or just site totals
        const detailedSiteScores: Record<string, Record<string, number>> = {};
        areas.forEach(areaName => {
            const areaId = areaName.toLowerCase().replace('/','_');
            detailedSiteScores[areaName.replace('_','/')] = {};
            signs.forEach(signName => {
                const signId = signName.toLowerCase();
                detailedSiteScores[areaName.replace('_','/')][signName] = Number(inputs[`${signId}_${areaId}`]) || 0;
            });
        });

        return { score: totalScore, interpretation, details: detailedSiteScores };
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
            const signsHECSI = [
                {id: "erythema", name: "Erythema"}, 
                {id: "induration_papulation", name: "Induration/Papulation"},
                {id: "vesicles", name: "Vesicles"},
                {id: "fissures", name: "Fissures"},
                {id: "scaling", name: "Scaling"},
                {id: "oedema", name: "Oedema"}
            ];
            const signOptionsHECSI: InputOption[] = [{value:0,label:"0-None"},{value:1,label:"1-Mild"},{value:2,label:"2-Moderate"},{value:3,label:"3-Severe"}];
            const areaAffectedOptionsHECSI: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-25%)"}, {value:2, label:"2 (26-50%)"}, {value:3, label:"3 (51-75%)"}, {value:4, label:"4 (76-100%)"} ];
            return [
                ...signsHECSI.map(sign => ({
                    id: `${areaId}_${sign.id}`,
                    label: `${areaName.replace(/_/g, ' ')} - ${sign.name} (0-3)`,
                    type: 'select',
                    options: signOptionsHECSI,
                    defaultValue: 0,
                    validation: getValidationSchema('select', signOptionsHECSI, 0, 3)
                } as InputConfig)),
                {
                    id: `${areaId}_area_affected`,
                    label: `${areaName.replace(/_/g, ' ')} - Area Affected (0-4)`,
                    type: 'select',
                    options: areaAffectedOptionsHECSI,
                    defaultValue: 0,
                    validation: getValidationSchema('select', areaAffectedOptionsHECSI, 0, 4)
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
  },
  // URTICARIA / ANGIOEDEMA
  {
    id: "uas7", 
    name: "Urticaria Activity Score over 7 days (UAS7)", 
    acronym: "UAS7", 
    condition: "Urticaria",
    keywords: ["uas7", "urticaria", "csu", "hives", "itch", "wheals", "patient reported"],
    description: "Patient-reported assessment of chronic spontaneous urticaria (CSU) activity over 7 consecutive days. It combines scores for number of wheals and intensity of itch.", 
    sourceType: 'Research', 
    icon: Calendar, 
    inputs: [ 
      ...Array.from({length:7},(_,i)=> i + 1).flatMap(dayNum => ([
          { id:`d${dayNum}_wheals`, label:`Day ${dayNum} - Wheals (Number)`, type:'select', options:[{value:0,label:"0 (<20 wheals/24h)"},{value:1,label:"1 (<20 wheals/24h)"},{value:2,label:"2 (20-50 wheals/24h)"},{value:3,label:"3 (>50 wheals/24h or large confluent areas)"}], defaultValue:0, description:"Score for number of wheals in the last 24 hours.", validation: getValidationSchema('select', [{value:0,label:"0"}],0,3) },
          { id:`d${dayNum}_itch`, label:`Day ${dayNum} - Itch Severity`, type:'select', options:[{value:0,label:"0 (None)"},{value:1,label:"1 (Mild - present but not annoying/troublesome)"},{value:2,label:"2 (Moderate - troublesome but does not interfere with normal daily activity/sleep)"},{value:3,label:"3 (Intense - severe, annoying, interferes with normal daily activity/sleep)"}], defaultValue:0, description:"Score for intensity of itch in the last 24 hours.", validation: getValidationSchema('select', [{value:0,label:"0"}],0,3) },
      ]))
    ],
    calculationLogic: (inputs) => { 
        let totalScore = 0; 
        const dailyScores: Record<string, {wheals: number, itch: number, total: number}> = {};
        for(let d=1;d<=7;d++){
            const wheals = Number(inputs[`d${d}_wheals`])||0;
            const itch = Number(inputs[`d${d}_itch`])||0;
            const dailyTotal = wheals + itch;
            totalScore += dailyTotal;
            dailyScores[`Day ${d}`] = {wheals, itch, total: dailyTotal};
        }
        let interpretation = `Total UAS7 Score: ${totalScore} (Range: 0-42). `;
        if (totalScore === 0) interpretation += "Urticaria-free.";
        else if (totalScore <= 6) interpretation += "Well-controlled urticaria (or mild activity).";
        else if (totalScore <= 15) interpretation += "Mildly active urticaria.";
        else if (totalScore <= 27) interpretation += "Moderately active urticaria.";
        else interpretation += "Severely active urticaria.";
        interpretation += " (Severity bands: 0 Urticaria-free, 1-6 Well-controlled/Mild, 7-15 Mild, 16-27 Moderate, 28-42 Severe)";
        return { score: totalScore, interpretation, details: dailyScores }; 
    },
    references: ["Zuberbier T, et al. Allergy. 2009.", "Mathias SD, et al. Ann Allergy Asthma Immunol. 2012."]
  },
  {
    id: "uct", 
    name: "Urticaria Control Test (UCT)", 
    acronym: "UCT", 
    condition: "Urticaria",
    keywords: ["uct", "urticaria", "control", "patient reported"],
    description: "Patient-reported questionnaire to assess urticaria control over the last 4 weeks.", 
    sourceType: 'Research', 
    icon: CheckCircle,
    inputs: [ 
      {id:"q1_symptoms", label:"Q1: How much have you suffered from the physical symptoms of urticaria (itch, wheals, swelling) in the last 4 weeks?", type:"select", options:[{value:4,label:"Very much"},{value:3,label:"Much"},{value:2,label:"Moderately"},{value:1,label:"A little"},{value:0,label:"Not at all"}], defaultValue:0, validation: getValidationSchema('select', [],0,4)},
      {id:"q2_qol", label:"Q2: How much has your quality of life been affected by urticaria in the last 4 weeks?", type:"select", options:[{value:4,label:"Very much"},{value:3,label:"Much"},{value:2,label:"Moderately"},{value:1,label:"A little"},{value:0,label:"Not at all"}], defaultValue:0, validation: getValidationSchema('select', [],0,4)},
      {id:"q3_treatment", label:"Q3: How often was treatment for your urticaria not enough to control your symptoms in the last 4 weeks?", type:"select", options:[{value:4,label:"Very often"},{value:3,label:"Often"},{value:2,label:"Sometimes"},{value:1,label:"Rarely"},{value:0,label:"Never"}], defaultValue:0, validation: getValidationSchema('select', [],0,4)},
      {id:"q4_control", label:"Q4: Overall, how well controlled would you say your urticaria was in the last 4 weeks?", type:"select", options:[{value:4,label:"Completely"},{value:3,label:"Well"},{value:2,label:"Moderately"},{value:1,label:"Poorly"},{value:0,label:"Not at all"}], defaultValue:0, validation: getValidationSchema('select', [],0,4)}
    ],
    calculationLogic: (inputs) => { 
        const q1_val = Number(inputs.q1_symptoms)||0;
        const q2_val = Number(inputs.q2_qol)||0;
        const q3_val = Number(inputs.q3_treatment)||0;
        const q4_val = Number(inputs.q4_control)||0;

        const uct_q1 = 4 - q1_val;
        const uct_q2 = 4 - q2_val;
        const uct_q3 = 4 - q3_val;
        const uct_q4 = q4_val; 

        const totalScore = uct_q1 + uct_q2 + uct_q3 + uct_q4;

        let interpretation = `UCT Score: ${totalScore} (Range: 0-16). `;
        if (totalScore >= 12) interpretation += "Urticaria is well controlled.";
        else interpretation += "Urticaria is poorly controlled.";
        interpretation += " (Standard interpretation: <12 poorly controlled, ≥12 well controlled).";
        return { score: totalScore, interpretation, details: {
            Q1_Symptoms_Score: uct_q1, Q2_QoL_Score: uct_q2, Q3_Treatment_Sufficiency_Score: uct_q3, Q4_Overall_Control_Score: uct_q4,
            Raw_Input_Q1: q1_val, Raw_Input_Q2: q2_val, Raw_Input_Q3: q3_val, Raw_Input_Q4: q4_val
        }};
    },
    references: ["Weller K, et al. J Allergy Clin Immunol. 2014."]
  },
  {
    id: "aas", 
    name: "Angioedema Activity Score (AAS)", 
    acronym: "AAS", 
    condition: "Angioedema",
    keywords: ["aas", "angioedema", "activity score", "patient reported"],
    description: "Patient-reported diary to assess activity of recurrent angioedema. Can be summed over periods (e.g., AAS7, AAS28). This form is for a single representative day.", 
    sourceType: 'Research', 
    icon: Activity,
    inputs: [ 
      {id:"aas_parts", label:"1. Number of body parts affected by angioedema today?", type:"select", options:[{value:0,label:"0"},{value:1,label:"1"},{value:2,label:"2"},{value:3,label:"3 or more"}], defaultValue:0, validation:getValidationSchema('select',[],0,3)},
      {id:"aas_duration", label:"2. How long did your angioedema last today (total duration of all episodes)?", type:"select", options:[{value:0,label:"<1 hour"},{value:1,label:"1-6 hours"},{value:2,label:"6-24 hours"},{value:3,label:">24 hours"}], defaultValue:0, validation:getValidationSchema('select',[],0,3)},
      {id:"aas_severity", label:"3. How severe was your angioedema today (worst episode)?", type:"select", options:[{value:0,label:"0 (None)"},{value:1,label:"1 (Mild)"},{value:2,label:"2 (Moderate)"},{value:3,label:"3 (Severe)"}], defaultValue:0, validation:getValidationSchema('select',[],0,3)},
      {id:"aas_function", label:"4. How much did angioedema interfere with your daily functioning today?", type:"select", options:[{value:0,label:"0 (Not at all)"},{value:1,label:"1 (A little)"},{value:2,label:"2 (Moderately)"},{value:3,label:"3 (A lot)"}], defaultValue:0, validation:getValidationSchema('select',[],0,3)},
      {id:"aas_appearance", label:"5. How much did angioedema affect your appearance today?", type:"select", options:[{value:0,label:"0 (Not at all)"},{value:1,label:"1 (A little)"},{value:2,label:"2 (Moderately)"},{value:3,label:"3 (A lot)"}], defaultValue:0, validation:getValidationSchema('select',[],0,3)}
    ],
    calculationLogic: (inputs) => { 
        const score = (Number(inputs.aas_parts)||0) + (Number(inputs.aas_duration)||0) + (Number(inputs.aas_severity)||0) + (Number(inputs.aas_function)||0) + (Number(inputs.aas_appearance)||0); 
        const interpretation = `AAS (for one day): ${score} (Range for one day: 0-15). Higher score indicates more angioedema activity. AAS7 (sum of 7 daily scores) ranges 0-105. AAS28 ranges 0-420.`;
        return { score: score, interpretation, details: { Item1_Parts: inputs.aas_parts, Item2_Duration: inputs.aas_duration, Item3_Severity: inputs.aas_severity, Item4_Function: inputs.aas_function, Item5_Appearance: inputs.aas_appearance } }; 
    },
    references: ["Weller K, et al. Allergy. 2012."]
  },
  // MELASMA / VITILIGO
  {
    id: "masi_mmasi", 
    name: "Melasma Area & Severity Index (MASI/mMASI)", 
    acronym: "MASI/mMASI", 
    condition: "Melasma",
    keywords: ["masi", "mmasi", "melasma", "pigmentation", "severity"],
    description: "Assesses the severity of melasma by evaluating area of involvement, darkness, and homogeneity (for MASI).", 
    sourceType: 'Clinical Guideline', 
    icon: Palette,
    inputs: [ 
      { id:"masi_type", label:"MASI Type", type:"select", options:[{value:"masi",label:"MASI (includes Homogeneity)"},{value:"mmasi",label:"mMASI (excludes Homogeneity)"}], defaultValue:"masi", validation:getValidationSchema('select')},
      ...(["Forehead", "Right Malar", "Left Malar", "Chin"] as const).flatMap(regionName => {
          const regionId = regionName.toLowerCase().replace(/\s+/g, '_');
          const regionMultiplier = {"forehead":0.3, "right_malar":0.3, "left_malar":0.3, "chin":0.1}[regionId as keyof typeof {"forehead":number, "right_malar":number, "left_malar":number, "chin":number}];
          const areaOptionsMASI: InputOption[] = Array.from({length:7}, (_,i)=>({value:i, label:`${i} (${["0%", "<10%", "10-29%", "30-49%", "50-69%", "70-89%", "90-100%"][i]})`}));
          const darknessHomogeneityOptions: InputOption[] = Array.from({length:5}, (_,i)=>({value:i, label:`${i} (${["None", "Slight", "Mild", "Moderate", "Marked"][i]})`}));
          return [
            { id:`${regionId}_area`, label:`${regionName} - Area (A) (Multiplier x${regionMultiplier})`, type:'select', options: areaOptionsMASI, defaultValue:0, validation:getValidationSchema('select',areaOptionsMASI,0,6)},
            { id:`${regionId}_darkness`, label:`${regionName} - Darkness (D)`, type:'select', options: darknessHomogeneityOptions, defaultValue:0, validation:getValidationSchema('select',darknessHomogeneityOptions,0,4)},
            { id:`${regionId}_homogeneity`, label:`${regionName} - Homogeneity (H) (MASI only)`, type:'select', options: darknessHomogeneityOptions, defaultValue:0, description: "Skip for mMASI", validation:getValidationSchema('select',darknessHomogeneityOptions,0,4)}
          ]
      })
    ],
    calculationLogic: (inputs) => { 
        const type = inputs.masi_type as "masi" | "mmasi"; 
        let totalScore = 0; 
        const regionDetails: Record<string, any> = {};
        const regions = [
            {name:"Forehead", id:"forehead", multiplier:0.3},
            {name:"Right Malar", id:"right_malar", multiplier:0.3},
            {name:"Left Malar", id:"left_malar", multiplier:0.3},
            {name:"Chin", id:"chin", multiplier:0.1}
        ];
        regions.forEach(r => { 
            const A = Number(inputs[`${r.id}_area`])||0; 
            const D = Number(inputs[`${r.id}_darkness`])||0; 
            const H = (type === "masi") ? (Number(inputs[`${r.id}_homogeneity`])||0) : 0; 
            const regionalScore = (type === "masi") ? ((D+H)*A*r.multiplier) : (D*A*r.multiplier);
            totalScore += regionalScore;
            regionDetails[r.name] = {Area:A, Darkness:D, Homogeneity: type === "masi" ? H : 'N/A', Regional_Score: parseFloat(regionalScore.toFixed(2))};
        }); 
        const score = parseFloat(totalScore.toFixed(2));
        let interpretation = `Total ${type.toUpperCase()} Score: ${score}. `;
        if (type === "masi") { // MASI range 0-48
            if (score === 0) interpretation += "No melasma.";
            else if (score < 16) interpretation += "Mild melasma.";
            else if (score <= 32) interpretation += "Moderate melasma.";
            else interpretation += "Severe melasma.";
            interpretation += " (MASI Range: 0-48. Severity bands example: <16 Mild, 16-32 Moderate, >32 Severe).";
        } else { // mMASI range 0-24
            if (score === 0) interpretation += "No melasma.";
            else if (score < 8) interpretation += "Mild melasma."; // Example bands for mMASI
            else if (score <= 16) interpretation += "Moderate melasma.";
            else interpretation += "Severe melasma.";
            interpretation += " (mMASI Range: 0-24. Severity bands are less standardized for mMASI but can be inferred).";
        }
        return { score, interpretation, details: { type: type.toUpperCase(), ...regionDetails } };
    },
    references: ["MASI: Kimbrough-Green CK, et al. Arch Dermatol. 1994.", "mMASI: Pandya AG, et al. J Am Acad Dermatol. 2011."]
  },
  {
    id: "melasqol", 
    name: "Melasma Quality of Life Scale (MELASQOL)", 
    acronym: "MELASQOL", 
    condition: "Quality of Life", // Also "Melasma"
    keywords: ["melasqol", "melasma", "quality of life", "patient reported"],
    description: "Assesses the impact of melasma on a patient's quality of life. Original version has 10 questions, each scored 1-7.", 
    sourceType: 'Research', 
    icon: Users2,
    inputs: [ 
      { id:"total_score", label:"Total MELASQOL Score", type:'number', min:10, max:70, defaultValue:10, description:"Enter the sum of scores from the 10 questions (each question 1-7).", validation:getValidationSchema('number', [], 10, 70)} 
    ],
    calculationLogic: (inputs) => { 
        const score = Number(inputs.total_score)||10; 
        const interpretation = `MELASQOL Score: ${score} (Range: 10-70). Higher score indicates worse quality of life.`;
        return { score, interpretation, details: { score_source: "User-entered total score" } }; 
    },
    references: ["Balkrishnan R, McMichael AJ, Camacho FT, et al. Development and validation of a health-related quality of life instrument for women with melasma. Br J Dermatol. 2003;149(3):572-577."]
  },
  {
    id: "vasi", 
    name: "Vitiligo Area Scoring Index (VASI)", 
    acronym: "VASI", 
    condition: "Vitiligo",
    keywords: ["vasi", "vitiligo", "depigmentation", "area scoring"],
    description: "Quantifies the extent of vitiligo by assessing the percentage of depigmentation in different body regions, weighted by hand units.", 
    sourceType: 'Clinical Guideline', 
    icon: Footprints, // Or Palette, Hand
    inputs: [ 
        ...(["Hands", "Upper Extremities (excluding Hands)", "Trunk", "Lower Extremities (excluding Feet)", "Feet", "Head/Neck"] as const).map(regionName => {
            const regionId = regionName.toLowerCase().replace(/[\s()/]+/g, '_');
            const depigmentationOptions: InputOption[] = [
                {value:1, label:"100% Depigmentation"}, {value:0.9, label:"90% Depigmentation"}, {value:0.75, label:"75% Depigmentation"}, 
                {value:0.5, label:"50% Depigmentation"}, {value:0.25, label:"25% Depigmentation"}, {value:0.1, label:"10% Depigmentation"}, {value:0, label:"0% Depigmentation (No depigmentation)"}
            ];
            return [
                {id:`${regionId}_hand_units`, label:`${regionName} - Hand Units (HU)`, type:'number', min:0, defaultValue:0, description:"Area in patient's hand units (1 HU ~ 1% BSA).", validation:getValidationSchema('number', [], 0)},
                {id:`${regionId}_depigmentation_percent`, label:`${regionName} - Depigmentation %`, type:'select', options:depigmentationOptions, defaultValue:0, validation:getValidationSchema('select',depigmentationOptions)}
            ];
        }).flat()
    ],
    calculationLogic: (inputs) => { 
        let totalVASI = 0;
        let facialVASI = 0;
        const regionDetails: Record<string, any> = {};
        const regions = [
            {name:"Hands", id:"hands"}, {name:"Upper Extremities (excluding Hands)", id:"upper_extremities_excluding_hands"}, 
            {name:"Trunk", id:"trunk"}, {name:"Lower Extremities (excluding Feet)", id:"lower_extremities_excluding_feet"}, 
            {name:"Feet", id:"feet"}, {name:"Head/Neck", id:"head_neck"}
        ];

        regions.forEach(r => {
            const hu = Number(inputs[`${r.id}_hand_units`])||0; 
            const depig = Number(inputs[`${r.id}_depigmentation_percent`]); // No ||0 here, as 0 is a valid depig value from select
            const regionalScore = hu * depig;
            totalVASI += regionalScore;
            if (r.id === "head_neck") {
                facialVASI = regionalScore;
            }
            regionDetails[r.name] = {Hand_Units: hu, Depigmentation_Multiplier: depig, Regional_VASI_Score: parseFloat(regionalScore.toFixed(2))};
        });
        
        // VASI is capped at 100 (representing 100% BSA involvement with 100% depigmentation)
        const finalTotalVASI = Math.min(totalVASI, 100);
        const finalFacialVASI = Math.min(facialVASI, 100); // Though unlikely for face alone to be > 100HU

        const interpretation = `Total VASI (T-VASI): ${finalTotalVASI.toFixed(2)} (Range: 0-100). Facial VASI (F-VASI): ${finalFacialVASI.toFixed(2)}. Higher score indicates more extensive depigmentation. VASI is used to track changes over time (e.g., VASI50 for 50% improvement). No universal baseline severity bands defined.`;
        return { score: finalTotalVASI, interpretation, details: { Total_VASI_Uncapped: parseFloat(totalVASI.toFixed(2)), Facial_VASI_Uncapped: parseFloat(facialVASI.toFixed(2)), ...regionDetails } };
    },
    references: ["Hamzavi I, Jain H, McLean D, et al. Parametric modeling of the vitiligo area scoring index (VASI). Arch Dermatol. 2004;140(6):677-683."]
  },
  {
    id: "vida", 
    name: "Vitiligo Disease Activity (VIDA) Score", 
    acronym: "VIDA", 
    condition: "Vitiligo",
    keywords: ["vida", "vitiligo", "activity", "patient reported"],
    description: "Assesses current vitiligo activity based on patient's perception of new lesions, existing lesion spread, or repigmentation over specific timeframes.", 
    sourceType: 'Research', 
    icon: Activity, // Or UserCog
    inputs: [ 
      { id:"activity_status", label:"Current Vitiligo Activity Status", type:"select", 
        options:[
            {value:4, label:"+4 (Active for ≤6 weeks: new lesions and/or spread of existing lesions)"},
            {value:3, label:"+3 (Active for 6 weeks to 3 months)"},
            {value:2, label:"+2 (Active for 3 to 6 months)"},
            {value:1, label:"+1 (Active for 6 to 12 months)"},
            {value:0, label:"0 (Stable for ≥1 year: no new lesions, no spread, no repigmentation)"},
            {value:-1, label:"-1 (Regressive for ≥1 year: spontaneous repigmentation, no new lesions, no spread)"}
        ], 
        defaultValue:0, validation:getValidationSchema('select',[],-1,4)
      } 
    ],
    calculationLogic: (inputs) => { 
        const score = Number(inputs.activity_status);
        const scoreLabelMap: Record<number, string> = {
            4: "+4 (Active for ≤6 weeks: new lesions and/or spread of existing lesions)",
            3: "+3 (Active for 6 weeks to 3 months)",
            2: "+2 (Active for 3 to 6 months)",
            1: "+1 (Active for 6 to 12 months)",
            0: "0 (Stable for ≥1 year: no new lesions, no spread, no repigmentation)",
           [-1]:"-1 (Regressive for ≥1 year: spontaneous repigmentation, no new lesions, no spread)"
        };
        const scoreLabel = scoreLabelMap[score] || "Invalid score";
        let interpretation = `VIDA Score: ${score < 0 ? '' : '+'}${score}. (${scoreLabel}). `;
        if (score > 0) interpretation += "Indicates active disease.";
        else if (score === 0) interpretation += "Indicates stable disease.";
        else interpretation += "Indicates regressive disease with spontaneous repigmentation.";
        return { score, interpretation, details: { vida_description: scoreLabel } }; 
    },
    references: ["Njoo MD, Spuls PI, Bos JD, Westerhof W, Bossuyt PM. Nonsurgical repigmentation therapies in vitiligo. Meta-analysis of the literature. Arch Dermatol. 1998;134(12):1532-1540. (VIDA often attributed to this group or later works). Original description: Njoo MD, Das PK, Bos JD, Westerhof W. Association of the Koebner phenomenon with disease activity and therapeutic responsiveness in vitiligo. Arch Dermatol. 2000;136(3):414-5." ]
  },
  {
    id: "vitiqol", 
    name: "Vitiligo-specific Quality of Life (VitiQoL)", 
    acronym: "VitiQoL", 
    condition: "Quality of Life", // Also "Vitiligo"
    keywords: ["vitiqol", "vitiligo", "quality of life", "patient reported"],
    description: "Measures the impact of vitiligo on a patient's quality of life. Scores depend on the specific version used (e.g., 15-item, each 0-6, total 0-90).", 
    sourceType: 'Research', 
    icon: Users,
    inputs: [ 
      {id:"total_score", label:"Total VitiQoL Score", type:'number', defaultValue:0, description:"Enter the sum of scores from the questionnaire items. Range depends on the version (e.g., 0-90 for 15 items scored 0-6).", validation:getValidationSchema('number')} 
    ],
    calculationLogic: (inputs) => { 
        const score = Number(inputs.total_score)||0; 
        const interpretation = `VitiQoL Score: ${score}. Higher score indicates worse quality of life. Refer to the specific VitiQoL version for detailed interpretation and range.`;
        return { score, interpretation, details: { score_source: "User-entered total score" } }; 
    },
    references: ["Lilly E, Lu PD, Borovicka JH, et al. Development and validation of a vitiligo-specific quality-of-life instrument (VitiQoL). J Am Acad Dermatol. 2013;69(1):e11-e18."]
  },
  // PREVIOUSLY IMPLEMENTED FROM tools.js
  {
    id: "seven_point_checklist",
    name: "7-Point Checklist for Melanoma",
    acronym: "7-Point Checklist",
    condition: "Melanoma Screening",
    keywords: ["melanoma", "skin cancer", "screening", "checklist", "nevus", "mole"],
    description: "A clinical rule to help identify suspicious pigmented lesions that may require urgent referral. Uses major and minor criteria.",
    sourceType: 'Clinical Guideline',
    icon: ListChecks,
    inputs: [
      { id: "version", label: "Checklist Version", type: 'select', options: [{value:"original", label:"Original (All criteria = 1 point)"}, {value:"weighted", label:"Weighted (Major criteria = 2 points, Minor = 1 point)"}], defaultValue:"weighted", validation: getValidationSchema('select')},
      { id: "major_change_size", label: "Major: Change in Size", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "major_irregular_shape", label: "Major: Irregular Shape", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "major_irregular_color", label: "Major: Irregular Color", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "minor_diameter_ge7mm", label: "Minor: Diameter >= 7mm", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "minor_inflammation", label: "Minor: Inflammation", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "minor_oozing_crusting", label: "Minor: Oozing or Crusting", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
      { id: "minor_change_sensation", label: "Minor: Change in Sensation (e.g., itch, pain)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox')},
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const presentFeatures: string[] = [];
      const version = inputs.version as "original" | "weighted";

      const majorCriteria = [
        {key: "major_change_size", label: "Change in Size"},
        {key: "major_irregular_shape", label: "Irregular Shape"},
        {key: "major_irregular_color", label: "Irregular Color"},
      ];
      const minorCriteria = [
        {key: "minor_diameter_ge7mm", label: "Diameter >= 7mm"},
        {key: "minor_inflammation", label: "Inflammation"},
        {key: "minor_oozing_crusting", label: "Oozing/Crusting"},
        {key: "minor_change_sensation", label: "Change in Sensation"},
      ];

      majorCriteria.forEach(crit => {
        if (inputs[crit.key]) {
          presentFeatures.push(crit.label + " (Major)");
          score += (version === "weighted" ? 2 : 1);
        }
      });
      minorCriteria.forEach(crit => {
        if (inputs[crit.key]) {
          presentFeatures.push(crit.label + " (Minor)");
          score += 1; // Minor criteria are 1 point in both versions effectively
        }
      });
      
      let interpretation = `7-Point Checklist Score (${version}): ${score}. `;
      if (score >= 3) {
        interpretation += "Urgent referral is recommended (Score >= 3).";
      } else {
        interpretation += "Score < 3, does not meet criteria for urgent referral based on this checklist alone. Clinical correlation advised.";
      }
      if (version === "weighted" && score >= 3) {
         // No separate threshold usually cited for weighted, just that major count more. Common threshold is 3.
      }

      return { score, interpretation, details: { Version: version, Present_Features: presentFeatures.join(', ') || "None" } };
    },
    references: ["MacKie RM. An aid to pre-operative assessment of pigmented lesions of the skin. Br J Dermatol. 1983.", "Walter FM, et al. The 7-point checklist for melanoma: a prospective validation study in primary care. Br J Gen Pract. 2013.", "NICE guideline [NG12] Melanoma: assessment and management. (Recommends 7-point checklist)"]
  },
  {
    id: "mss_hs",
    name: "Modified Sartorius Score (mSS) for HS",
    acronym: "mSS HS",
    condition: "Hidradenitis Suppurativa",
    keywords: ["mss", "hs", "hidradenitis suppurativa", "sartorius", "severity", "dynamic"],
    description: "A dynamic score for assessing the severity of Hidradenitis Suppurativa (HS) by evaluating involved regions, lesion counts, and distances.",
    sourceType: 'Clinical Guideline',
    icon: SquarePen,
    inputs: [
      { id: "axilla_l", label: "Region: Axilla (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "axilla_r", label: "Region: Axilla (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "groin_l", label: "Region: Groin (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "groin_r", label: "Region: Groin (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "genital_l", label: "Region: Genital (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "genital_r", label: "Region: Genital (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "gluteal_l", label: "Region: Gluteal (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "gluteal_r", label: "Region: Gluteal (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "inframammary_l", label: "Region: Inframammary (Left)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "inframammary_r", label: "Region: Inframammary (Right)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "other_region", label: "Region: Other", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "nodules_count", label: "Inflammatory Nodules (count)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
      { id: "fistulas_tunnels_count", label: "Fistulas/Tunnels (count)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
      { id: "scars_count", label: "Scars (count, non-specific points)", type: 'number', min: 0, defaultValue: 0, description:"Typically 1 point per distinct scar area, not number of individual scars.", validation: getValidationSchema('number', [], 0) },
      { id: "other_lesions_count", label: "Other Lesions (e.g. comedones, papules - count if significant)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number', [], 0) },
      { id: "longest_distance", label: "Longest Distance Between Two Lesions (in one region)", type: 'select', options: [{value:2, label:"<5cm"}, {value:4, label:"5 to <10cm"}, {value:8, label:"≥10cm"}], defaultValue:2, validation: getValidationSchema('select', [], 2, 8) },
      { id: "lesions_separated", label: "Are all lesions clearly separated by normal skin in each region?", type: 'select', options: [{value:0, label:"Yes (Clearly separated - 0 points)"}, {value:6, label:"No (Not separated/Confluent - 6 points)"}], defaultValue:0, validation: getValidationSchema('select', [], 0, 6) },
    ],
    calculationLogic: (inputs) => {
      let regionsScore = 0;
      const regionKeys = ["axilla_l", "axilla_r", "groin_l", "groin_r", "genital_l", "genital_r", "gluteal_l", "gluteal_r", "inframammary_l", "inframammary_r", "other_region"];
      let involvedRegionsCount = 0;
      regionKeys.forEach(key => {
        if (inputs[key]) {
          involvedRegionsCount++;
        }
      });
      regionsScore = involvedRegionsCount * 3;

      const nodulesScore = (Number(inputs.nodules_count) || 0) * 2;
      const fistulasScore = (Number(inputs.fistulas_tunnels_count) || 0) * 4;
      const scarsScore = (Number(inputs.scars_count) || 0) * 1;
      const otherLesionsScore = (Number(inputs.other_lesions_count) || 0) * 1; // Note: "Other" less defined in original, often for comedones if severe
      const distanceScore = Number(inputs.longest_distance) || 0;
      const separatedScore = Number(inputs.lesions_separated) || 0; // 0 if separated, 6 if not

      const totalScore = regionsScore + nodulesScore + fistulasScore + scarsScore + otherLesionsScore + distanceScore + separatedScore;
      
      const interpretation = `Modified Sartorius Score (mSS): ${totalScore}. Higher score indicates more severe HS. This score is dynamic and used to track changes over time. No universal severity bands.`;
      return { score: totalScore, interpretation, details: { 
        Regions_Score: regionsScore, Involved_Regions_Count: involvedRegionsCount, Nodules_Score: nodulesScore, Fistulas_Score: fistulasScore, Scars_Score: scarsScore, Other_Lesions_Score: otherLesionsScore, Distance_Score: distanceScore, Lesions_Separated_Score: separatedScore 
      }};
    },
    references: ["Sartorius K, et al. A simple scoring system for hidradenitis suppurativa for dialogue and documentation (Sartorius score). Br J Dermatol. 2003.", "Modified version often cited from Sartorius K, et al. Objective scoring of hidradenitis suppurativa reflecting the role of tobacco smoking and obesity. Br J Dermatol. 2009."]
  },
  {
    id: "hspga",
    name: "HS-PGA (Hidradenitis Suppurativa Physician's Global Assessment)",
    acronym: "HS-PGA",
    condition: "Hidradenitis Suppurativa",
    keywords: ["hspga", "hs", "hidradenitis suppurativa", "pga", "physician global assessment", "severity"],
    description: "A static, 6-point scale for clinicians to globally assess the severity of Hidradenitis Suppurativa. Specific definitions for each grade vary slightly across trials.",
    sourceType: 'Research', // Or Clinical Guideline if a specific version is adopted
    icon: UserCheck,
    inputs: [
      { id: "abscesses_count", label: "Number of Abscesses (A)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
      { id: "inflammatory_nodules_count", label: "Number of Inflammatory Nodules (IN)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
      { id: "draining_fistulas_count", label: "Number of Draining Fistulas (DF)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)},
      { id: "non_inflammatory_nodules_count", label: "Number of Non-Inflammatory Nodules (NIN) (e.g., for Grade 0/1 distinction)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0)}
    ],
    calculationLogic: (inputs) => {
      const A = Number(inputs.abscesses_count) || 0;
      const IN = Number(inputs.inflammatory_nodules_count) || 0;
      const DF = Number(inputs.draining_fistulas_count) || 0;
      const NIN = Number(inputs.non_inflammatory_nodules_count) || 0;
      
      let pgaScore = -1; // Default for undefined state
      let description = "";

      // Example PGA logic (can vary slightly based on specific trial definitions)
      if (A === 0 && IN === 0 && DF === 0 && NIN === 0) {
        pgaScore = 0; description = "Clear: No HS lesions.";
      } else if (A === 0 && IN === 0 && DF === 0 && NIN > 0) {
        pgaScore = 1; description = "Minimal: No abscesses, inflammatory nodules, or draining fistulas; only non-inflammatory nodules present.";
      } else if ( (A === 0 && DF === 0 && IN >= 1 && IN <= 4) || ((A === 1 || DF === 1) && IN === 0) ) { // Simplified "Mild"
        pgaScore = 2; description = "Mild: Few inflammatory nodules (e.g., 1-4) OR at most one abscess OR one draining fistula, but no combination of these beyond single types if IN=0.";
      } else if ( (A === 0 && DF === 0 && IN >=5) || ((A === 1 || DF === 1) && IN >=1) || (A >=2 && A <=5) || (DF >=2 && DF <=5) || ((A+DF) >=2 && (A+DF)<=5) && IN <10 ) { // Simplified "Moderate"
        pgaScore = 3; description = "Moderate: Multiple inflammatory nodules (e.g., >=5) OR few abscesses/fistulas (e.g., 1 of each, or 2-5 total A/DF) with limited IN OR more extensive A/DF but limited IN.";
      } else if ( (A >=2 && A <=5 || DF >=2 && DF <=5) && IN >=10 ) { // Part of "Severe"
        pgaScore = 4; description = "Severe: Multiple abscesses or draining fistulas (e.g., 2-5 of one type) AND numerous (e.g., >=10) inflammatory nodules OR more extensive individual lesion types.";
      } else if (A >= 6 || DF >= 6 || (A+DF) >=6 ) { // Part of "Very Severe"
         pgaScore = 5; description = "Very Severe: Multiple (e.g., >=6) abscesses OR multiple (e.g., >=6) draining fistulas, or extensive/confluent lesions.";
      } else { // Fallback if conditions are complex and not perfectly met by above simplified logic
         // This part needs more robust logic or a select dropdown for HS-PGA if direct calculation is too complex.
         // For now, if not perfectly matched, it remains -1 or could be a simpler heuristic based on dominant lesion.
         // A common approach is for the clinician to select the PGA based on gestalt after counting.
         // If we assume the numbers lead to a distinct category:
         if (A > 0 || IN > 0 || DF > 0) { // if any lesions, it's at least minimal/mild
            if ((A + DF + IN) <= 5 && (A+DF) <=1) {pgaScore = 2; description="Mild (heuristic)";}
            else if ((A+DF) >=5 || IN >=10) {pgaScore=4; description="Severe (heuristic)";}
            else {pgaScore=3; description="Moderate (heuristic)";}
         } else if (NIN > 0) {
            pgaScore=1; description="Minimal (NIN only)";
         } else {
            pgaScore=0; description="Clear";
         }
      }


      const interpretation = `HS-PGA Score: ${pgaScore} - ${description}. This score is a global assessment.`;
      return { score: pgaScore, interpretation, details: { Abscesses: A, Inflammatory_Nodules: IN, Draining_Fistulas: DF, Non_Inflammatory_Nodules: NIN, Calculated_Description: description } };
    },
    references: ["HS-PGA scales are often defined in specific clinical trial protocols (e.g., for adalimumab, secukinumab in HS). Example: Kimball AB, et al. JAMA Dermatol. 2012 (early HS-PGA usage)."]
  },
  {
    id: "cdlqi",
    name: "Children's Dermatology Life Quality Index (CDLQI)",
    acronym: "CDLQI",
    condition: "Quality of Life", // And "Pediatric Dermatology"
    keywords: ["cdlqi", "quality of life", "children", "pediatric", "skin disease", "patient reported"],
    description: "A 10-question questionnaire to measure the impact of skin disease on the quality of life of children aged 4-16 years.",
    sourceType: 'Expert Consensus', // Often considered this or Research Tool
    icon: Baby, // Or Users
    inputs: [
      ...Array.from({ length: 10 }, (_, i) => {
        const questionPrompts = [ // Example prompts, actual CDLQI questions are specific
            "Q1: Skin itchy, sore, painful, or stinging?",
            "Q2: Skin embarrassing or made you self-conscious?",
            "Q3: Skin interfering with looking after home/garden or shopping?", // Parent may answer some
            "Q4: Skin influencing clothes worn?",
            "Q5: Skin affecting social/leisure activities?",
            "Q6: Skin making sport difficult?",
            "Q7: Skin preventing school/study or affecting it?",
            "Q8: Skin creating problems with friends/relatives?",
            "Q9: Skin causing sleep problems?", // Adapted from DLQI sexual q
            "Q10: Treatment being a problem (messy, time-consuming)?"
        ];
        // CDLQI scoring is typically: Very much (3), A lot (2), A little (1), Not at all (0)
        // Question 7 (school) might have a "Not relevant" option scoring 0.
        let cdlqi_options: InputOption[] = [
            { value: 3, label: 'Very much / Yes' },
            { value: 2, label: 'A lot' },
            { value: 1, label: 'A little' },
            { value: 0, label: 'Not at all / No' },
        ];
         if (i === 6) { // Example for Q7 (school)
             cdlqi_options.push({ value: 0, label: 'Not relevant (Scores 0)' });
         }

        return {
          id: `cdlqi_q${i + 1}`,
          label: questionPrompts[i],
          type: 'select' as 'select',
          options: cdlqi_options,
          defaultValue: 0,
          validation: getValidationSchema('select', cdlqi_options, 0, 3),
        };
      })
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const details: Record<string, number> = {};
      for (let i = 1; i <= 10; i++) {
        const val = Number(inputs[`cdlqi_q${i}`]) || 0;
        details[`Q${i}`] = val;
        score += val;
      }
      let interpretation = `CDLQI Score: ${score} (Range: 0-30). `;
      if (score === 0) interpretation += 'No effect at all on child\'s life.';
      else if (score <= 6) interpretation += 'Small effect on child\'s life.';
      else if (score <= 12) interpretation += 'Moderate effect on child\'s life.';
      else if (score <= 18) interpretation += 'Very large effect on child\'s life.';
      else interpretation += 'Extremely large effect on child\'s life.';
      interpretation += " (Severity bands examples: 0 No effect, 1-6 Small, 7-12 Moderate, 13-18 Very large, 19-30 Extremely large)";
      return { score, interpretation, details };
    },
    references: ["Lewis-Jones MS, Finlay AY. The Children's Dermatology Life Quality Index (CDLQI): initial validation and practical application. Br J Dermatol. 1995 Jul;132(6):942-9."]
  },
  {
    id: "skindex29",
    name: "Skindex-29",
    acronym: "Skindex-29",
    condition: "Quality of Life",
    keywords: ["skindex", "quality of life", "symptoms", "emotions", "functioning", "patient reported"],
    description: "A 29-item questionnaire assessing the effects of skin diseases on patients' quality of life, divided into three domains: Symptoms, Emotions, and Functioning. Scores are typically transformed to a 0-100 scale for each domain and overall.",
    sourceType: 'Research',
    icon: Presentation, 
    inputs: [
      { id: "symptoms_score", label: "Symptoms Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Symptoms domain.", validation: getValidationSchema('number',[],0,100)},
      { id: "emotions_score", label: "Emotions Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Emotions domain.", validation: getValidationSchema('number',[],0,100)},
      { id: "functioning_score", label: "Functioning Domain Score (0-100)", type: 'number', min:0, max:100, defaultValue:0, description:"Enter the calculated/transformed score for the Functioning domain.", validation: getValidationSchema('number',[],0,100)},
    ],
    calculationLogic: (inputs) => {
      const symptoms = Number(inputs.symptoms_score) || 0;
      const emotions = Number(inputs.emotions_score) || 0;
      const functioning = Number(inputs.functioning_score) || 0;
      const averageScore = parseFloat(((symptoms + emotions + functioning) / 3).toFixed(1));
      
      const interpretation = `Skindex-29 Scores: Symptoms=${symptoms.toFixed(1)}, Emotions=${emotions.toFixed(1)}, Functioning=${functioning.toFixed(1)}. Overall Average=${averageScore}. Higher scores indicate worse quality of life. Each domain and the average score range from 0 to 100.`;
      return { score: averageScore, interpretation, details: { Symptoms_Domain: symptoms, Emotions_Domain: emotions, Functioning_Domain: functioning, Overall_Average_Score: averageScore } };
    },
    references: ["Chren MM, Lasek RJ, Sahay AP, Sands LP. Measurement properties of Skindex-29: a quality-of-life measure for patients with skin disease. J Cutan Med Surg. 1997. (Original Skindex development often referenced).", "Chren MM. The Skindex instruments to measure the effects of skin disease on quality of life. Dermatol Clin. 2012 Apr;30(2):231-6, xiii."]
  },
  {
    id: "vas_pruritus",
    name: "Visual Analogue Scale (VAS) for Pruritus",
    acronym: "VAS Pruritus",
    condition: "Pruritus",
    keywords: ["vas", "visual analogue scale", "pruritus", "itch", "intensity", "patient reported"],
    description: "A simple scale for patients to rate the intensity of their itch, typically on a 10 cm line (0=no itch, 10=worst imaginable itch).",
    sourceType: 'Research',
    icon: SlidersHorizontal, // Represents a scale
    inputs: [
      { id: "vas_score_cm", label: "VAS Score (cm or 0-10)", type: 'number', min:0, max:10, step:0.1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
    ],
    calculationLogic: (inputs) => {
      const score = parseFloat(Number(inputs.vas_score_cm).toFixed(1)) || 0;
      let severity = "";
      if (score === 0) severity = "No itch";
      else if (score < 3) severity = "Mild itch";
      else if (score < 7) severity = "Moderate itch";
      else if (score < 9) severity = "Severe itch";
      else severity = "Very severe itch";
      
      const interpretation = `VAS for Pruritus: ${score} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, >0-2.9 Mild, 3-6.9 Moderate, 7-8.9 Severe, 9-10 Very severe).`;
      return { score, interpretation, details: { Reported_VAS_Score: score, Assessed_Severity: severity } };
    },
    references: ["Huskisson EC. Measurement of pain. Lancet. 1974.", "Phan NQ, Blome C, Fritz F, et al. Assessment of pruritus intensity: prospective study on validity and reliability of the visual analogue scale, numerical rating scale and verbal rating scale in patients with chronic pruritus. Acta Derm Venereol. 2012."]
  },
  {
    id: "nrs_pruritus",
    name: "Numeric Rating Scale (NRS) for Pruritus",
    acronym: "NRS Pruritus",
    condition: "Pruritus",
    keywords: ["nrs", "numeric rating scale", "pruritus", "itch", "intensity", "patient reported"],
    description: "A simple scale for patients to rate the intensity of their itch on an 11-point scale (0=no itch, 10=worst imaginable itch).",
    sourceType: 'Research',
    icon: CircleDot, // Represents discrete points on a scale
    inputs: [
      { id: "nrs_score", label: "NRS Score (0-10)", type: 'number', min:0, max:10, step:1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.nrs_score) || 0;
      let severity = "";
      if (score === 0) severity = "No itch";
      else if (score <= 3) severity = "Mild itch"; // NRS bands can differ slightly from VAS
      else if (score <= 6) severity = "Moderate itch";
      else if (score <= 8) severity = "Severe itch";
      else severity = "Very severe itch";

      const interpretation = `NRS for Pruritus: ${score} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, 1-3 Mild, 4-6 Moderate, 7-8 Severe, 9-10 Very severe).`;
      return { score, interpretation, details: { Reported_NRS_Score: score, Assessed_Severity: severity } };
    },
    references: ["Phan NQ, Blome C, Fritz F, et al. Assessment of pruritus intensity: prospective study on validity and reliability of the visual analogue scale, numerical rating scale and verbal rating scale in patients with chronic pruritus. Acta Derm Venereol. 2012."]
  },
  {
    id: "five_d_itch",
    name: "5-D Itch Scale",
    acronym: "5-D Itch",
    condition: "Pruritus",
    keywords: ["5d itch", "pruritus", "itch", "multidimensional", "patient reported"],
    description: "A multidimensional patient-reported outcome measure for chronic pruritus, assessing Duration, Degree, Direction, Disability, and Distribution.",
    sourceType: 'Research',
    icon: Puzzle, // Represents multiple dimensions
    inputs: [
      { id: "d1_duration", label: "Domain 1: Duration (Total hours itching per day)", type: 'select', options: [{value:1, label:"1 (<1 hr)"}, {value:2, label:"2 (1-3 hrs)"}, {value:3, label:"3 (4-6 hrs)"}, {value:4, label:"4 (7-12 hrs)"}, {value:5, label:"5 (>12 hrs)"}], defaultValue:1, validation: getValidationSchema('select',[],1,5)},
      { id: "d2_degree", label: "Domain 2: Degree (Severity of worst itch episode)", type: 'select', options: [{value:1, label:"1 (Mild)"}, {value:2, label:"2 (Mild-Moderate)"}, {value:3, label:"3 (Moderate)"}, {value:4, label:"4 (Moderate-Severe)"}, {value:5, label:"5 (Severe)"}], defaultValue:1, validation: getValidationSchema('select',[],1,5)},
      { id: "d3_direction", label: "Domain 3: Direction (Itch getting better or worse over past month)", type: 'select', options: [{value:1, label:"1 (Much better)"}, {value:2, label:"2 (Somewhat better)"}, {value:3, label:"3 (No change)"}, {value:4, label:"4 (Somewhat worse)"}, {value:5, label:"5 (Much worse)"}], defaultValue:3, validation: getValidationSchema('select',[],1,5)},
      { id: "d4_disability", label: "Domain 4: Disability (Impact on QoL - sleep, mood, activities)", type: 'select', options: [{value:1, label:"1 (Not at all)"}, {value:2, label:"2 (A little)"}, {value:3, label:"3 (Moderately)"}, {value:4, label:"4 (A lot)"}, {value:5, label:"5 (Very much)"}], defaultValue:1, validation: getValidationSchema('select',[],1,5)},
      { id: "d5_distribution", label: "Domain 5: Distribution (Body parts affected)", type: 'select', options: [{value:1, label:"1 (1-2 parts)"}, {value:2, label:"2 (3-5 parts)"}, {value:3, label:"3 (6-10 parts)"}, {value:4, label:"4 (11-18 parts)"}, {value:5, label:"5 (All over/Almost all over)"}], defaultValue:1, validation: getValidationSchema('select',[],1,5)},
    ],
    calculationLogic: (inputs) => {
      const d1 = Number(inputs.d1_duration) || 1;
      const d2 = Number(inputs.d2_degree) || 1;
      const d3 = Number(inputs.d3_direction) || 1;
      const d4 = Number(inputs.d4_disability) || 1;
      const d5 = Number(inputs.d5_distribution) || 1;
      const totalScore = d1 + d2 + d3 + d4 + d5;
      
      const interpretation = `5-D Itch Scale Total Score: ${totalScore} (Range: 5-25). Higher score indicates more severe and impactful pruritus. No universally defined severity bands, used to track change.`;
      return { score: totalScore, interpretation, details: { D1_Duration_Score: d1, D2_Degree_Score: d2, D3_Direction_Score: d3, D4_Disability_Score: d4, D5_Distribution_Score: d5 } };
    },
    references: ["Elman S, Hynan LS, Gabriel V, Mayo MJ. The 5-D Itch Scale: a new measure of pruritus. Br J Dermatol. 2010 Mar;162(3):587-93."]
  }
];
    
    

