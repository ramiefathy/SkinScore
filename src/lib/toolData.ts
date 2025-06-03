
import type { LucideIcon } from 'lucide-react';
import type { Tool } from './types';
import {
  Calculator, Stethoscope, ClipboardList, Users, FileText, Pill,
  Users2, Thermometer, Scaling, Wind, AlignLeft, SquarePen, UserCheck, Activity,
  CheckCircle, ListChecks, MessageSquare, FolderHeart, ShieldAlert, Brain, FolderKanban, 
  BarChart, Sun, Eye, Scissors, HelpCircle, Hand, Type, FileHeart, ShieldQuestion, Zap,
  ScalingIcon, Gauge, Fingerprint, SlidersHorizontal, Shield, Atom, Dot, Waves, UserCog,
  HeartPulse, ShieldHalf, Palette, SearchCheck, Baby, User, Footprints, Puzzle, CircleDot, Check, CloudDrizzle, Presentation,
  Calendar, ZoomIn, Clock, LayoutList
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
      if (options && options.length > 0) {
        const firstValueType = typeof options[0].value;
        if (firstValueType === 'number') {
          return z.coerce.number().nullable().optional();
        } else if (firstValueType === 'string') {
          return z.string().nullable().optional();
        }
      }
      // Fallback or if options are empty/mixed in a way not anticipated, treat as string or any.
      // For safety, this could be z.any() or a more specific default.
      return z.string().nullable().optional(); 
    case 'checkbox':
      return z.boolean().optional();
    case 'text':
    case 'textarea': 
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


const masiRegionMultiplierMapData: Record<string, number> = {
  "forehead": 0.3,
  "right_malar": 0.3,
  "left_malar": 0.3,
  "chin": 0.1
};
type MasiRegionKey = keyof typeof masiRegionMultiplierMapData;

// Helper data structure for CTCAE criteria
const ctcaeCriteriaSnippets: Record<string, Record<number, string>> = {
  "Rash maculopapular": {
    1: "Macules/papules covering <10% BSA with or without symptoms (e.g., pruritus, burning, tightness).",
    2: "Macules/papules covering 10-30% BSA with or without symptoms; limiting instrumental ADL.",
    3: "Macules/papules covering >30% BSA with or without symptoms; limiting self care ADL; hospitalization indicated.",
    4: "Life-threatening consequences (e.g., SJS/TEN, exfoliative dermatitis).",
    5: "Death.",
  },
  "Pruritus": {
    1: "Mild; topical intervention indicated.",
    2: "Moderate; oral intervention or medical intervention indicated; limiting instrumental ADL.",
    3: "Severe; interfering with self care ADL or sleep; hospitalization indicated.",
    // G4 & G5 typically not applicable for pruritus itself as the primary AE leading to that grade
  },
  "Hand-foot skin reaction": {
    1: "Minimal skin changes or dermatitis (e.g., erythema, edema, hyperkeratosis) without pain.",
    2: "Skin changes (e.g., peeling, blisters, bleeding, edema, hyperkeratosis) with pain; limiting instrumental ADL.",
    3: "Severe skin changes (e.g., peeling, blisters, bleeding, edema, hyperkeratosis) with pain; limiting self care ADL.",
  },
  "Alopecia": {
    1: "Hair loss of <50% of normal for that individual that is not obvious from a distance; a different hairstyle may be required to cover the hair loss but it does not require a wig or hairpiece to camouflage.",
    2: "Hair loss of >=50% of normal for that individual that is obvious from a distance; a wig or hairpiece is required to camouflage the hair loss if the patient desires; limiting instrumental ADL.",
  },
  "Radiation dermatitis": {
    1: "Faint erythema or dry desquamation.",
    2: "Moderate to brisk erythema; patchy moist desquamation, mostly confined to skin folds and creases; moderate edema.",
    3: "Moist desquamation other than skin folds and creases; bleeding induced by minor trauma or abrasion.",
    4: "Skin necrosis or ulceration of full thickness dermis; spontaneous bleeding from involved site.",
    5: "Death.",
  },
   "Photosensitivity": {
    1: "Skin reaction resembling mild sunburn; minimal symptoms.",
    2: "Painful skin reaction resembling moderate to severe sunburn; skin changes (e.g., edema); limiting instrumental ADL.",
    3: "Severe painful skin reaction with bullae; limiting self care ADL.",
  },
  "Skin hyperpigmentation": {
    1: "Hyperpigmentation covering <10% BSA.",
    2: "Hyperpigmentation covering 10 - 30% BSA.",
    3: "Hyperpigmentation covering >30% BSA.",
  },
  "Skin hypopigmentation": {
    1: "Hypopigmentation covering <10% BSA.",
    2: "Hypopigmentation covering 10 - 30% BSA.",
    3: "Hypopigmentation covering >30% BSA.",
  },
  "Nail changes": {
    1: "Nail changes (e.g., discoloration, ridging, pitting, Beau's lines) not interfering with function.",
    2: "Nail changes (e.g., discoloration, ridging, pitting, Beau's lines, onycholysis, pain) interfering with instrumental ADL.",
    3: "Nail changes (e.g., nail loss, onycholysis, pain) interfering with self care ADL.",
  },
  "Mucositis oral": {
    1: "Asymptomatic or mild symptoms; intervention not indicated.",
    2: "Moderate pain or ulceration; not interfering with oral intake; modified diet indicated.",
    3: "Severe pain; interfering with oral intake.",
    4: "Life-threatening consequences (e.g., airway obstruction); urgent intervention indicated.",
    5: "Death.",
  },
};

const ctcaeAdverseEventOptions: InputOption[] = Object.keys(ctcaeCriteriaSnippets).map(ae => ({ value: ae, label: ae }));
ctcaeAdverseEventOptions.push({value: "Other", label: "Other (Specify in notes/report)"});


export const toolData: Tool[] = [
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
            siteScores[areaName.replace('_','/')] = currentSiteScore; 
            totalScore += currentSiteScore;
        });
        const interpretation = `Total SASSAD Score: ${totalScore} (Range: 0-108). Higher score indicates more severe AD. No standard severity bands universally defined.`;
        
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

        return { score: dasiScore, interpretation, details: { V, E, D, I, Ext_raw_Percentage: Ext_raw, Extension_Score_0_5: Ext_score } };
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
        if (baselineGrade !== -1 && baselineGrade >=0 ) { // Ensure baseline is valid for comparison
            treatmentSuccess = (currentGrade <= 1 && (baselineGrade - currentGrade >= 2)) ? "Achieved" : "Not Achieved";
        }
        const gradeMap: Record<number, string> = {0:"Clear",1:"Almost Clear",2:"Mild",3:"Moderate",4:"Severe", [-1]:"N/A"};

        let interpretation = `Current IGA Acne Grade: ${currentGrade} (${gradeMap[currentGrade]}). `;
        if (baselineGrade !== -1) {
            interpretation += `Baseline IGA Grade: ${baselineGrade} (${gradeMap[baselineGrade]}). Treatment Success: ${treatmentSuccess}.`;
        } else {
            interpretation += "Baseline not provided or N/A for treatment success assessment.";
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

        // UCT scoring is reversed for the first 3 questions then direct for the last
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
      { id:"masi_type", label:"MASI Type", type:"select", options:[{value:"masi",label:"MASI (includes Homogeneity)"},{value:"mmasi",label:"mMASI (excludes Homogeneity)"}], defaultValue:"masi", validation:getValidationSchema('select', [{value:"masi",label:"MASI"}])},
      ...(["Forehead", "Right Malar", "Left Malar", "Chin"] as const).flatMap(regionName => {
          const regionId = regionName.toLowerCase().replace(/\s+/g, '_') as MasiRegionKey;
          const regionMultiplier = masiRegionMultiplierMapData[regionId];
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
            {name:"Forehead", id:"forehead" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["forehead"]},
            {name:"Right Malar", id:"right_malar" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["right_malar"]},
            {name:"Left Malar", id:"left_malar" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["left_malar"]},
            {name:"Chin", id:"chin" as MasiRegionKey, multiplier: masiRegionMultiplierMapData["chin"]}
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
        if (type === "masi") { 
            if (score === 0) interpretation += "No melasma.";
            else if (score < 16) interpretation += "Mild melasma.";
            else if (score <= 32) interpretation += "Moderate melasma.";
            else interpretation += "Severe melasma.";
            interpretation += " (MASI Range: 0-48. Severity bands example: <16 Mild, 16-32 Moderate, >32 Severe).";
        } else { 
            if (score === 0) interpretation += "No melasma.";
            else if (score < 8) interpretation += "Mild melasma."; 
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
    condition: "Quality of Life", 
    keywords: ["melasqol", "melasma", "quality of life", "patient reported"],
    description: "Assesses the impact of melasma on a patient's quality of life. Original version has 10 questions, each scored 1-7.",
    sourceType: 'Research',
    icon: Users2,
    inputs: [
      {id:"total_score", label:"Total MELASQOL Score", type:'number', min:10, max:70, defaultValue:10, description:"Enter the sum of scores from the 10 questions (each question 1-7).", validation:getValidationSchema('number', [], 10, 70)}
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
    icon: Footprints, 
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
            const depig = Number(inputs[`${r.id}_depigmentation_percent`]); 
            const regionalScore = hu * depig;
            totalVASI += regionalScore;
            if (r.id === "head_neck") {
                facialVASI = regionalScore;
            }
            regionDetails[r.name] = {Hand_Units: hu, Depigmentation_Multiplier: depig, Regional_VASI_Score: parseFloat(regionalScore.toFixed(2))};
        });

        const finalTotalVASI = Math.min(totalVASI, 100);
        const finalFacialVASI = Math.min(facialVASI, 100); 

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
    icon: Activity,
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
    condition: "Quality of Life", 
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
          score += 1;
        }
      });

      let interpretation = `7-Point Checklist Score (${version}): ${score}. `;
      if (score >= 3) {
        interpretation += "Urgent referral is recommended (Score >= 3).";
      } else {
        interpretation += "Score < 3, does not meet criteria for urgent referral based on this checklist alone. Clinical correlation advised.";
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
      const otherLesionsScore = (Number(inputs.other_lesions_count) || 0) * 1; 
      const distanceScore = Number(inputs.longest_distance) || 0;
      const separatedScore = Number(inputs.lesions_separated) || 0;

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
    sourceType: 'Research', 
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

      let pgaScore = -1;
      let description = "Undetermined - use clinical judgment or direct PGA selection.";
      
      if (A === 0 && IN === 0 && DF === 0 && NIN === 0) {
          pgaScore = 0; description = "Clear: No inflammatory or non-inflammatory HS lesions.";
      } else if (A === 0 && IN === 0 && DF === 0 && NIN > 0) {
          pgaScore = 1; description = "Minimal: No abscesses, inflammatory nodules, or draining fistulas; only non-inflammatory nodules present.";
      } else if (A === 0 && DF === 0 && IN > 0 && IN <= 4) { 
          pgaScore = 2; description = "Mild: 1-4 inflammatory nodule(s); no abscess(es) or draining fistula(s).";
      } else if (A <= 2 && DF === 0 && IN === 0) { 
          pgaScore = 2; description = "Mild: ≤2 abscess(es); no inflammatory nodule(s) or draining fistula(s).";
      } else if (DF <= 2 && A === 0 && IN === 0) {
          pgaScore = 2; description = "Mild: ≤2 draining fistula(s); no inflammatory nodule(s) or abscess(es).";
      } else if ((A > 0 || DF > 0 || IN > 0)) { // Combinations
          if ((A <= 5 && DF <= 5 && (A+DF) <= 5 && IN < 10) && !((A > 2 && IN === 0 && DF === 0) || (DF > 2 && IN === 0 && A === 0))) { // Excludes cases already covered by severe
             if ((A+DF) >=1 || IN >=5) {pgaScore = 3; description = "Moderate: Some abscesses/fistulas (total ≤5) and/or several inflammatory nodules (<10).";}
             else if (pgaScore===-1) {pgaScore = 2; description="Mild: Few mixed inflammatory lesions."} // fallback if still mild
          }
          if (((A > 5 || DF > 5 || (A+DF) > 5) || ( (A+DF) >=1 && IN >= 10 )) && !((A+DF) > 10) ) {
              pgaScore = 4; description = "Severe: Multiple abscesses/fistulas (total >5) or many inflammatory nodules (≥10) with some A/DF.";
          }
          if ((A+DF) > 10 || (A+IN+DF > 20 && (A+DF) >=5) ) { 
              pgaScore = 5; description = "Very Severe: Extensive/confluent lesions or very numerous lesions.";
          }
      }
      if(pgaScore === -1 && (A > 0 || IN > 0 || DF > 0)) { // Broader fallback if still not categorized
          pgaScore = 3; description = "Moderate (General fallback - use clinical judgment).";
      }


      const interpretation = `HS-PGA Score: ${pgaScore === -1 ? 'N/A' : pgaScore} - ${description}. This score is a global assessment. Precise definitions can vary.`;
      return { score: pgaScore, interpretation, details: { Abscesses: A, Inflammatory_Nodules: IN, Draining_Fistulas: DF, Non_Inflammatory_Nodules: NIN, Calculated_Description: description } };
    },
    references: ["HS-PGA scales are often defined in specific clinical trial protocols. Example: Kimball AB, et al. JAMA Dermatol. 2012. FDA Adalimumab Prescribing Information."]
  },
  {
    id: "cdlqi",
    name: "Children's Dermatology Life Quality Index (CDLQI)",
    acronym: "CDLQI",
    condition: "Quality of Life",
    keywords: ["cdlqi", "quality of life", "children", "pediatric", "skin disease", "patient reported"],
    description: "A 10-question questionnaire to measure the impact of skin disease on the quality of life of children aged 4-16 years.",
    sourceType: 'Expert Consensus',
    icon: Baby,
    inputs: [
      ...Array.from({ length: 10 }, (_, i) => {
        const questionPrompts = [ 
            "Q1: Over the last week, how itchy, sore, painful or stinging has your skin been?",
            "Q2: Over the last week, how embarrassed or self-conscious have you been because of your skin?",
            "Q3: Over the last week, how much has your skin interfered with you playing with friends or going to school?",
            "Q4: Over the last week, how much has your skin influenced the clothes you wear?",
            "Q5: Over the last week, how much has your skin affected any hobbies or pastimes?",
            "Q6: Over the last week, how much has your skin made it difficult for you to do any sport?",
            "Q7: Over the last week, has your skin prevented you from going to school or nursery?",
            "Q8: Over the last week, how much has your skin made you feel fed up or sad?",
            "Q9: Over the last week, how much has your skin caused problems with your sleep?",
            "Q10: Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?"
        ];
        let cdlqi_options: InputOption[] = [
            { value: 3, label: 'Very much' }, { value: 2, label: 'A lot' },
            { value: 1, label: 'A little' }, { value: 0, label: 'Not at all' },
        ];
         if (i === 6) { // Question 7 (school)
             cdlqi_options.push({ value: 0, label: 'Not relevant / Does not apply (Scores 0)' });
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
    icon: SlidersHorizontal, 
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

      const interpretation = `VAS for Pruritus: ${score.toFixed(1)} (Range 0-10). Severity: ${severity}. (Example severity bands: 0 No itch, >0-2.9 Mild, 3-6.9 Moderate, 7-8.9 Severe, 9-10 Very severe).`;
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
    icon: CircleDot, 
    inputs: [
      { id: "nrs_score", label: "NRS Score (0-10)", type: 'number', min:0, max:10, step:1, defaultValue:0, description:"Enter score from 0 (no itch) to 10 (worst imaginable itch).", validation: getValidationSchema('number',[],0,10)}
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.nrs_score) || 0;
      let severity = "";
      if (score === 0) severity = "No itch";
      else if (score <= 3) severity = "Mild itch"; 
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
    icon: Puzzle, 
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
  },
  {
    id: "hiscr",
    name: "HiSCR (Hidradenitis Suppurativa Clinical Response)",
    acronym: "HiSCR",
    condition: "Hidradenitis Suppurativa",
    keywords: ["hiscr", "hs", "hidradenitis suppurativa", "treatment response", "clinical trial"],
    description: "Defines treatment response in HS clinical trials based on changes in abscesses, inflammatory nodules, and draining fistulas.",
    sourceType: 'Clinical Guideline', 
    icon: ListChecks,
    inputs: [
      { id: "baseline_abscesses", label: "Baseline: Abscesses (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "baseline_inflammatory_nodules", label: "Baseline: Inflammatory Nodules (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "baseline_draining_fistulas", label: "Baseline: Draining Fistulas (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "followup_abscesses", label: "Follow-up: Abscesses (A) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "followup_inflammatory_nodules", label: "Follow-up: Inflammatory Nodules (IN) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "followup_draining_fistulas", label: "Follow-up: Draining Fistulas (DF) Count", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    ],
    calculationLogic: (inputs) => {
      const Ab = Number(inputs.baseline_abscesses) || 0;
      const INb = Number(inputs.baseline_inflammatory_nodules) || 0;
      const DFb = Number(inputs.baseline_draining_fistulas) || 0;
      const Af = Number(inputs.followup_abscesses) || 0;
      const INf = Number(inputs.followup_inflammatory_nodules) || 0;
      const DFf = Number(inputs.followup_draining_fistulas) || 0;

      const AINb = Ab + INb;
      const AINf = Af + INf;

      let reductionAIN = 0;
      if (AINb > 0) {
        reductionAIN = (AINb - AINf) / AINb;
      } else if (AINf === 0) { 
        reductionAIN = 1.0; 
      }

      const criterion1_reduction = reductionAIN >= 0.5; 
      const criterion2_no_increase_A = Af <= Ab;
      const criterion3_no_increase_DF = DFf <= DFb;

      const achieved = criterion1_reduction && criterion2_no_increase_A && criterion3_no_increase_DF;
      const score = achieved ? 1 : 0; 

      const interpretation = `HiSCR: ${achieved ? "Achieved" : "Not Achieved"}. Criteria: 1. ≥50% reduction in (Abscesses + Inflammatory Nodules) count: ${criterion1_reduction ? "Yes" : "No"} (${(reductionAIN * 100).toFixed(1)}% reduction). 2. No increase in Abscess count from baseline: ${criterion2_no_increase_A ? "Yes" : "No"}. 3. No increase in Draining Fistula count from baseline: ${criterion3_no_increase_DF ? "Yes" : "No"}.`;
      
      return { 
        score, 
        interpretation, 
        details: {
          AIN_Reduction_Percent: parseFloat((reductionAIN * 100).toFixed(1)),
          Criterion1_AIN_Reduction_Met: criterion1_reduction ? "Yes" : "No",
          Criterion2_No_Abscess_Increase_Met: criterion2_no_increase_A ? "Yes" : "No",
          Criterion3_No_Fistula_Increase_Met: criterion3_no_increase_DF ? "Yes" : "No",
          Baseline_A_plus_IN: AINb,
          Followup_A_plus_IN: AINf,
        } 
      };
    },
    references: ["Kimball AB, et al. Hidradenitis suppurativa: a disease with U.S. prevalence of 1% to 4% that requires new therapies. J Am Acad Dermatol. 2014.", "Original definition often cited in clinical trial protocols for HS therapies."]
  },
  {
    id: "ihs4",
    name: "International Hidradenitis Suppurativa Severity Score System (IHS4)",
    acronym: "IHS4",
    condition: "Hidradenitis Suppurativa",
    keywords: ["ihs4", "hs", "hidradenitis suppurativa", "severity", "dynamic score"],
    description: "A validated, dynamic scoring system for HS severity based on lesion counts.",
    sourceType: 'Clinical Guideline',
    icon: SquarePen,
    inputs: [
      { id: "nodules_count", label: "Number of Inflammatory Nodules (x1 point each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "abscesses_count", label: "Number of Abscesses (x2 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
      { id: "draining_tunnels_count", label: "Number of Draining Tunnels/Fistulas (x4 points each)", type: 'number', min: 0, defaultValue: 0, validation: getValidationSchema('number',[],0) },
    ],
    calculationLogic: (inputs) => {
      const Nn = Number(inputs.nodules_count) || 0;
      const Na = Number(inputs.abscesses_count) || 0;
      const Ndt = Number(inputs.draining_tunnels_count) || 0;
      const score = (Nn * 1) + (Na * 2) + (Ndt * 4);

      let severity = "";
      if (score <= 3) severity = "Mild HS";
      else if (score <= 10) severity = "Moderate HS";
      else severity = "Severe HS";
      
      const interpretation = `IHS4 Score: ${score}. Assessed Severity: ${severity}. (Severity bands: ≤3 Mild; 4-10 Moderate; ≥11 Severe).`;
      return { 
        score, 
        interpretation, 
        details: {
          Nodules_Contribution: Nn * 1,
          Abscesses_Contribution: Na * 2,
          Draining_Tunnels_Contribution: Ndt * 4,
          Severity_Category: severity
        }
      };
    },
    references: ["Zouboulis CC, et al. Development and validation of the International Hidradenitis Suppurativa Severity Score System (IHS4), a novel dynamic scoring system to assess HS severity. Br J Dermatol. 2017 Dec;177(6):1401-1409."]
  },
  {
    id: "iga_rosacea",
    name: "Investigator's Global Assessment (IGA) for Rosacea",
    acronym: "IGA-R",
    condition: "Rosacea",
    keywords: ["iga", "rosacea", "physician global assessment", "severity", "erythema", "papules", "pustules"],
    description: "A clinician-rated assessment of overall rosacea severity, typically on a 5-point scale (0=Clear to 4=Severe). Definitions vary slightly.",
    sourceType: 'Research',
    icon: UserCheck,
    inputs: [
      {
        id: "iga_grade_rosacea",
        label: "Select IGA Grade for Rosacea",
        type: 'select',
        options: [
          { value: 0, label: "0 - Clear: No inflammatory lesions (papules/pustules), no erythema." },
          { value: 1, label: "1 - Almost Clear: Rare inflammatory lesions; faint erythema." },
          { value: 2, label: "2 - Mild: Few inflammatory lesions (papules/pustules); mild erythema." },
          { value: 3, label: "3 - Moderate: Several to many inflammatory lesions; moderate erythema." },
          { value: 4, label: "4 - Severe: Numerous inflammatory lesions; severe erythema; may include plaques/nodules." }
        ],
        defaultValue: 0,
        validation: getValidationSchema('select', [{ value: 0, label: "0 - Clear" }], 0, 4)
      }
    ],
    calculationLogic: (inputs) => {
      const grade = Number(inputs.iga_grade_rosacea);
      const gradeMap: Record<number, string> = {
        0: "Clear", 1: "Almost Clear", 2: "Mild", 3: "Moderate", 4: "Severe"
      };
      const interpretation = `IGA for Rosacea: Grade ${grade} (${gradeMap[grade] || 'N/A'}). This reflects the overall severity of rosacea based on inflammatory lesions and erythema.`;
      return { 
        score: grade, 
        interpretation, 
        details: { 
          Selected_Grade_Description: gradeMap[grade] || "N/A" 
        } 
      };
    },
    references: ["Various versions used in clinical trials for rosacea treatments. Example: Fowler J, et al. Efficacy and safety of once-daily ivermectin 1% cream in treatment of papulopustular rosacea: results of two randomized, double-blind, vehicle-controlled pivotal studies. J Drugs Dermatol. 2014."]
  },
  {
    id: "cea_rosacea",
    name: "Clinician's Erythema Assessment (CEA) for Rosacea",
    acronym: "CEA Rosacea",
    condition: "Rosacea",
    keywords: ["cea", "rosacea", "erythema", "redness", "severity"],
    description: "A clinician-rated assessment of the severity of facial erythema associated with rosacea, typically on a 5-point scale.",
    sourceType: 'Research',
    icon: Palette,
    inputs: [
      {
        id: "cea_grade_rosacea",
        label: "Select CEA Grade for Rosacea Erythema",
        type: 'select',
        options: [
          { value: 0, label: "0 - Clear skin with no signs of erythema." },
          { value: 1, label: "1 - Almost clear; slight redness." },
          { value: 2, label: "2 - Mild erythema; definite redness, easily recognized." },
          { value: 3, label: "3 - Moderate erythema; marked redness." },
          { value: 4, label: "4 - Severe erythema; fiery redness." }
        ],
        defaultValue: 0,
        validation: getValidationSchema('select', [{ value: 0, label: "0 - Clear" }], 0, 4)
      }
    ],
    calculationLogic: (inputs) => {
      const grade = Number(inputs.cea_grade_rosacea);
      const gradeMap: Record<number, string> = {
        0: "Clear", 1: "Almost Clear", 2: "Mild Erythema", 3: "Moderate Erythema", 4: "Severe Erythema"
      };
      const interpretation = `CEA for Rosacea: Grade ${grade} (${gradeMap[grade] || 'N/A'}). This score reflects the severity of facial erythema.`;
      return { 
        score: grade, 
        interpretation, 
        details: {
          Selected_Grade_Description: gradeMap[grade] || "N/A"
        } 
      };
    },
    references: ["Used in clinical trials evaluating treatments for rosacea-associated erythema. Example: Fowler J Jr, et al. J Drugs Dermatol. 2013;12(6):650-6 (brimonidine trials)."]
  },
  {
    id: "iss_vis",
    name: "Ichthyosis Severity Score (ISS) / Visual Index for Ichthyosis Severity (VIS)",
    acronym: "ISS/VIS",
    condition: "Ichthyosis",
    keywords: ["ichthyosis", "severity score", "iss", "vis", "scaling", "erythema"],
    description: "Assesses overall ichthyosis severity. Specific components and scoring can vary (e.g., Yale VIS-ISS, Gånemo ISS). This tool accepts a pre-calculated total score.",
    sourceType: 'Clinical Guideline',
    icon: ScalingIcon,
    inputs: [
      { id: "total_iss_vis_score", label: "Total ISS/VIS Score", type: 'number', min:0, defaultValue: 0, description: "Enter the pre-calculated total score from the specific ISS/VIS version used.", validation: getValidationSchema('number',[],0) }
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.total_iss_vis_score) || 0;
      const interpretation = `ISS/VIS Score: ${score}. Higher score indicates more severe ichthyosis. Interpretation and range depend on the specific version of the ISS/VIS used.`;
      return { 
        score, 
        interpretation, 
        details: { 
          User_Entered_Score: score 
        } 
      };
    },
    references: ["Gånemo A, et al. Severity assessment in ichthyoses: a validation study. Acta Derm Venereol. 2003.", "Milstone LM, et al. The Visual Index for Ichthyosis Severity (VIIS): a validatedỀinstrument for use in ichthyosis clinical trials. Br J Dermatol. 2020 (describes VIIS which is related)."]
  },
  {
    id: "loscat",
    name: "Localized Scleroderma Cutaneous Assessment Tool (LoSCAT)",
    acronym: "LoSCAT",
    condition: "Localized Scleroderma (Morphea)",
    keywords: ["loscat", "morphea", "localized scleroderma", "activity", "damage", "pga", "mrss"],
    description: "Assesses disease activity and damage in morphea, incorporating Physician Global Assessments (PGA) and modified Rodnan Skin Score (mRSS) components.",
    sourceType: 'Clinical Guideline',
    icon: ClipboardList,
    inputs: [
      { id: "pga_activity", label: "PGA of Activity (PGA-A, 0-100mm VAS)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
      { id: "pga_damage", label: "PGA of Damage (PGA-D, 0-100mm VAS)", type: 'number', min: 0, max: 100, defaultValue: 0, validation: getValidationSchema('number',[],0,100) },
      { id: "mrss_sum_affected", label: "mRSS Sum of Affected Sites (0-51 for full body, or sum of only affected sites)", type: 'number', min: 0, defaultValue: 0, description: "Sum of mRSS scores from affected sites.", validation: getValidationSchema('number',[],0) },
      { id: "loscat_activity_score", label: "LoSCAT Activity Score (Calculated Externally)", type: 'number', min: 0, defaultValue: 0, description: "Enter the calculated LoSCAT activity score based on its specific items.", validation: getValidationSchema('number',[],0) },
      { id: "loscat_damage_score", label: "LoSCAT Damage Score (Calculated Externally)", type: 'number', min: 0, defaultValue: 0, description: "Enter the calculated LoSCAT damage score based on its specific items.", validation: getValidationSchema('number',[],0) },
    ],
    calculationLogic: (inputs) => {
      const pgaA = Number(inputs.pga_activity) || 0;
      const pgaD = Number(inputs.pga_damage) || 0;
      const mrss = Number(inputs.mrss_sum_affected) || 0;
      const loscatAct = Number(inputs.loscat_activity_score) || 0;
      const loscatDam = Number(inputs.loscat_damage_score) || 0;

      const score = loscatAct; 
      const interpretation = `LoSCAT Assessment: PGA-Activity: ${pgaA}, PGA-Damage: ${pgaD}. mRSS (Affected Sites Sum): ${mrss}. LoSCAT Activity Score: ${loscatAct}, LoSCAT Damage Score: ${loscatDam}. Higher scores generally indicate greater activity or damage respectively.`;
      
      return { 
        score, 
        interpretation, 
        details: {
          PGA_Activity: pgaA,
          PGA_Damage: pgaD,
          mRSS_Affected_Sites_Sum: mrss,
          LoSCAT_Activity_Score: loscatAct,
          LoSCAT_Damage_Score: loscatDam
        } 
      };
    },
    references: ["Kelsey CE, Torok KS. The Localized Scleroderma Cutaneous Assessment Tool: responsiveness to change in a pediatric clinical population. J Rheumatol. 2013.", "Arkachaisri T, et al. Development and initial validation of the localized scleroderma skin damage index and physician global assessment of disease damage: a proof-of-concept study. Rheumatology (Oxford). 2010."]
  },
  {
    id: "mswat",
    name: "Modified Severity-Weighted Assessment Tool (mSWAT)",
    acronym: "mSWAT",
    condition: "Cutaneous T-Cell Lymphoma (CTCL)",
    keywords: ["mswat", "ctcl", "mycosis fungoides", "sezary syndrome", "skin severity"],
    description: "Assesses skin severity in Mycosis Fungoides (MF) and Sézary Syndrome (SS) by evaluating percentage of BSA involved by patches, plaques, and tumors/ulcers, with weighting factors.",
    sourceType: 'Clinical Guideline',
    icon: ShieldHalf,
    inputs: [
      { id: "total_mswat_score", label: "Total mSWAT Score (Pre-calculated)", type: 'number', min: 0, max: 400, defaultValue: 0, description: "Enter the total mSWAT score calculated from BSA involvement of patches (x1), plaques (x2), and tumors/ulcers (x4).", validation: getValidationSchema('number',[],0,400) }
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.total_mswat_score) || 0;
      const interpretation = `mSWAT Score: ${score} (Range: 0-400). Higher score indicates greater skin tumor burden in CTCL. Used to monitor disease activity and treatment response.`;
      return { 
        score, 
        interpretation, 
        details: { 
          User_Entered_mSWAT_Score: score 
        } 
      };
    },
    references: ["Olsen E, Whittaker S, Kim YH, et al. Clinical end points and response criteria in mycosis fungoides and Sézary syndrome: a consensus statement of the International Society for Cutaneous Lymphomas, the United States Cutaneous Lymphoma Consortium, and the Cutaneous Lymphoma Task Force of the European Organisation for Research and Treatment of Cancer. J Clin Oncol. 2011."]
  },
  {
    id: "regiscar_dress",
    name: "RegiSCAR DRESS Severity Score",
    acronym: "DRESS Score",
    condition: "DRESS Syndrome",
    keywords: ["dress", "regiscar", "drug reaction", "eosinophilia", "systemic symptoms", "severity"],
    description: "Assesses the severity of Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS) syndrome. This tool accepts a pre-calculated score.",
    sourceType: 'Clinical Guideline',
    icon: ShieldAlert,
    inputs: [
      { id: "regiscar_score", label: "Total DRESS Score (RegiSCAR)", type: 'number', defaultValue: 0, description: "Enter the pre-calculated RegiSCAR DRESS score.", validation: getValidationSchema('number') }
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.regiscar_score) || 0;
      const interpretation = `RegiSCAR DRESS Severity Score: ${score}. Higher score generally indicates more severe DRESS syndrome. Specific interpretation bands may vary based on the exact RegiSCAR criteria version used.`;
      return { score, interpretation, details: { User_Entered_Score: score } };
    },
    references: ["Kardaun SH, et al. Variability in the clinical pattern of drug-induced hypersensitivity syndrome (DIHS)/drug reaction with eosinophilia and systemic symptoms (DRESS). Br J Dermatol. 2007.", "Kardaun SH, Sidoroff A, Valeyrie-Allanore L, et al. Variability in the clinical pattern of cutaneous side effects of drugs with systemic symptoms: does a DRESS score mirror severity of illness? Br J Dermatol. 2007. (Later work refined scoring)."]
  },
  {
    id: "bwat",
    name: "Bates-Jensen Wound Assessment Tool (BWAT)",
    acronym: "BWAT",
    condition: "Wound Healing",
    keywords: ["bwat", "wound assessment", "ulcers", "pressure injury", "healing"],
    description: "A comprehensive tool for assessing and monitoring wound status. It consists of 13 items, each rated on a 1-5 scale (1=best, 5=worst).",
    sourceType: 'Clinical Guideline',
    icon: ClipboardList,
    inputs: [
      ...(["Size", "Depth", "Edges", "Undermining", "Necrotic_Tissue_Type", "Necrotic_Tissue_Amount", "Exudate_Type", "Exudate_Amount", "Skin_Color_Surrounding_Wound", "Peripheral_Tissue_Edema", "Peripheral_Tissue_Induration", "Granulation_Tissue", "Epithelialization"].map(itemName => {
        const itemId = `bwat_${itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '')}`; 
        const itemOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }));
        return {
          id: itemId,
          label: itemName.replace(/_/g, ' '),
          type: 'select' as 'select',
          options: itemOptions,
          defaultValue: 3, 
          description: "1=Best, 5=Worst. Refer to BWAT guide for specific item descriptions.",
          validation: getValidationSchema('select', itemOptions, 1, 5)
        };
      }))
    ],
    calculationLogic: (inputs) => {
      let totalScore = 0;
      const itemScores: Record<string, number> = {};
      const itemNames = ["Size", "Depth", "Edges", "Undermining", "Necrotic_Tissue_Type", "Necrotic_Tissue_Amount", "Exudate_Type", "Exudate_Amount", "Skin_Color_Surrounding_Wound", "Peripheral_Tissue_Edema", "Peripheral_Tissue_Induration", "Granulation_Tissue", "Epithelialization"];
      
      itemNames.forEach(itemName => {
        const key = `bwat_${itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '')}`;
        const score = Number(inputs[key]) || 0; 
        totalScore += score;
        itemScores[itemName.replace(/_/g, ' ')] = score;
      });

      const interpretation = `BWAT Score: ${totalScore} (Range: 13-65). Higher score indicates a worse wound status. Lower score indicates healing.`;
      return { score: totalScore, interpretation, details: itemScores };
    },
    references: ["Bates-Jensen BM. The Pressure Sore Status Tool a few thousand assessments later. Adv Wound Care. 1997.", "Harris C, Bates-Jensen B, Parslow N, et al. Bates-Jensen Wound Assessment Tool: pictorial guide validation. J Wound Ostomy Continence Nurs. 2010."]
  },
  {
    id: "fitzpatrick_wrinkle",
    name: "Fitzpatrick Wrinkle and Elastosis Scale",
    acronym: "Fitz Wrinkle Scale",
    condition: "Photoaging",
    keywords: ["fitzpatrick", "wrinkle", "elastosis", "photoaging", "skin aging"],
    description: "Classifies the degree of wrinkling and elastosis, often used in conjunction with Glogau scale.",
    sourceType: 'Research',
    icon: User, 
    inputs: [
      {
        id: "fitzpatrick_wrinkle_class",
        label: "Select Fitzpatrick Wrinkle Class",
        type: 'select',
        options: [
          { value: "I", label: "Class I: Fine wrinkles" },
          { value: "II", label: "Class II: Fine to moderate depth wrinkles, moderate number of lines" },
          { value: "III", label: "Class III: Fine to deep wrinkles, numerous lines, +/- redundant skin folds" }
        ],
        defaultValue: "I",
        validation: getValidationSchema('select', [{ value: "I", label: "Class I: Fine wrinkles" }])
      }
    ],
    calculationLogic: (inputs) => {
      const score = inputs.fitzpatrick_wrinkle_class || "I";
      const scoreToDescriptionMap: Record<string, string> = {
          "I": "Class I: Fine wrinkles",
          "II": "Class II: Fine to moderate depth wrinkles, moderate number of lines",
          "III": "Class III: Fine to deep wrinkles, numerous lines, +/- redundant skin folds"
      };
      const interpretation = `Fitzpatrick Wrinkle and Elastosis Scale: ${scoreToDescriptionMap[score as string]}. This is a descriptive classification.`;
      return { score, interpretation, details: { Selected_Class: scoreToDescriptionMap[score as string] } };
    },
    references: ["Fitzpatrick RE, Goldman MP, Satur NM, Tope WD. Pulsed carbon dioxide laser resurfacing of photo-aged facial skin. Arch Dermatol. 1996 Mar;132(3):395-402."]
  },
  {
    id: "glogau_photoaging",
    name: "Glogau Photoaging Classification",
    acronym: "Glogau Scale",
    condition: "Photoaging",
    keywords: ["glogau", "photoaging", "skin aging", "wrinkles"],
    description: "Categorizes the severity of photoaging based on wrinkling and other clinical signs.",
    sourceType: 'Research',
    icon: Sun,
    inputs: [
      {
        id: "glogau_type",
        label: "Select Glogau Classification Type",
        type: 'select',
        options: [
          { value: "I", label: "Type I (Mild): No wrinkles, early photoaging, minimal or no makeup." },
          { value: "II", label: "Type II (Moderate): Wrinkles in motion, early to moderate photoaging, usually wears some makeup." },
          { value: "III", label: "Type III (Advanced): Wrinkles at rest, advanced photoaging, always wears makeup." },
          { value: "IV", label: "Type IV (Severe): Only wrinkles, severe photoaging, cannot wear makeup as it cakes and cracks." }
        ],
        defaultValue: "I",
        validation: getValidationSchema('select', [{ value: "I", label: "Type I (Mild): No wrinkles, early photoaging, minimal or no makeup." }])
      }
    ],
    calculationLogic: (inputs) => {
      const score = inputs.glogau_type || "I";
       const scoreToDescriptionMap: Record<string, string> = {
          "I": "Type I (Mild): No wrinkles, early photoaging, minimal or no makeup.",
          "II": "Type II (Moderate): Wrinkles in motion, early to moderate photoaging, usually wears some makeup.",
          "III": "Type III (Advanced): Wrinkles at rest, advanced photoaging, always wears makeup.",
          "IV": "Type IV (Severe): Only wrinkles, severe photoaging, cannot wear makeup as it cakes and cracks."
      };
      const interpretation = `Glogau Photoaging Classification: ${scoreToDescriptionMap[score as string]}. This is a descriptive classification based on the level of wrinkling and makeup use.`;
      return { score, interpretation, details: { Selected_Type: scoreToDescriptionMap[score as string] } };
    },
    references: ["Glogau RG. Aesthetic and anatomic analysis of the aging skin. Semin Cutan Med Surg. 1996 Sep;15(3):134-8."]
  },
  {
    id: "nailfold_capillaroscopy",
    name: "Nailfold Capillaroscopy Patterns (SSc)",
    acronym: "NFC Patterns",
    condition: "Systemic Sclerosis",
    keywords: ["nailfold capillaroscopy", "ssc", "systemic sclerosis", "microangiopathy", "scleroderma pattern"],
    description: "Identifies specific patterns in nailfold capillaries associated with Systemic Sclerosis (SSc) and other connective tissue diseases.",
    sourceType: 'Research',
    icon: ZoomIn,
    inputs: [
      {
        id: "nfc_pattern",
        label: "Identified Nailfold Capillaroscopy Pattern",
        type: 'select',
        options: [
          { value: "Normal", label: "Normal Pattern" },
          { value: "Non-specific", label: "Non-specific abnormalities (not SSc pattern)" },
          { value: "SSc Early", label: "SSc Pattern - Early (e.g., few giant capillaries, few hemorrhages, no severe loss of capillaries, preserved architecture)" },
          { value: "SSc Active", label: "SSc Pattern - Active (e.g., frequent giant capillaries, frequent hemorrhages, moderate loss of capillaries, mild disorganization)" },
          { value: "SSc Late", label: "SSc Pattern - Late (e.g., irregular enlargement of capillaries, extensive avascular areas, severe disorganization, neoangiogenesis)" }
        ],
        defaultValue: "Normal",
        validation: getValidationSchema('select', [{ value: "Normal", label: "Normal Pattern" }])
      }
    ],
    calculationLogic: (inputs) => {
      const score = inputs.nfc_pattern || "Normal";
      const interpretation = `Nailfold Capillaroscopy Pattern: ${score}. This classification helps in diagnosing and prognosticating SSc and related conditions.`;
      return { score, interpretation, details: { Identified_Pattern: score } };
    },
    references: ["Cutolo M, Sulli A, Pizzorni C, Accardo S. Nailfold videocapillaroscopy in systemic sclerosis: correlations with serum autoantibodies and disease activity. Rheumatology (Oxford). 2000.", "Ingegnoli F, et al. Nailfold capillaroscopy in systemic sclerosis: data from the EULAR Scleroderma Trials and Research group (EUSTAR) database. Ann Rheum Dis. 2013 Aug;72(8):1347-53."]
  },
  {
    id: "nih_gvhd_skin",
    name: "NIH Chronic GVHD Skin Score",
    acronym: "NIH cGVHD Skin",
    condition: "GVHD (Graft-Versus-Host Disease)",
    keywords: ["gvhd", "chronic gvhd", "skin score", "nih consensus", "transplant"],
    description: "Standardized assessment of skin involvement in chronic Graft-Versus-Host Disease (cGVHD) based on NIH consensus criteria.",
    sourceType: 'Clinical Guideline',
    icon: Shield,
    inputs: [
      {
        id: "nih_skin_score",
        label: "Overall NIH Skin Score (cGVHD)",
        type: 'select',
        options: [
          { value: 0, label: "0 - No signs of cGVHD in skin." },
          { value: 1, label: "1 - Mild: ≤18% BSA erythematous rash OR morpheaform/lichen planus-like features involving ≤18% BSA without joint restriction." },
          { value: 2, label: "2 - Moderate: >18% BSA erythematous rash OR morpheaform/lichen planus-like features involving >18% BSA OR any BSA % with joint restriction in 1-2 joint areas." },
          { value: 3, label: "3 - Severe: Generalized erythroderma OR morpheaform/lichen planus-like features with joint restriction in ≥3 joint areas or severe functional impairment." }
        ],
        defaultValue: 0,
        validation: getValidationSchema('select',[],0,3)
      }
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.nih_skin_score);
      const scoreMap: Record<number, string> = { 0: "None", 1: "Mild", 2: "Moderate", 3: "Severe" };
      const interpretation = `NIH cGVHD Skin Score: ${score} (${scoreMap[score] || 'N/A'}). This score reflects the severity of cutaneous chronic GVHD.`;
      return { score, interpretation, details: { Severity_Grade: scoreMap[score] || 'N/A' } };
    },
    references: ["Filipovich AH, et al. National Institutes of Health consensus development project on criteria for clinical trials in chronic graft-versus-host disease: I. Diagnosis and staging working group report. Biol Blood Marrow Transplant. 2005.", "Jagasia MH, et al. National Institutes of Health Consensus Development Project on Criteria for Clinical Trials in Chronic Graft-versus-Host Disease: I. The 2014 Diagnosis and Staging Working Group report. Biol Blood Marrow Transplant. 2015."]
  },
  {
    id: "behcet_mucocutaneous",
    name: "Behçet's Disease Mucocutaneous Index (Simplified)",
    acronym: "BD Muco Index",
    condition: "Behçet's Disease",
    keywords: ["behcet", "mucocutaneous", "activity index", "oral ulcers", "genital ulcers", "skin lesions"],
    description: "Assesses mucocutaneous activity in Behçet's Disease. This is a simplified representation; various indices exist. This tool accepts a pre-calculated activity score.",
    sourceType: 'Research',
    icon: MessageSquare,
    inputs: [
      { id: "bd_activity_score", label: "Mucocutaneous Activity Score", type: 'number', defaultValue: 0, description: "Enter pre-calculated score based on specific index criteria (e.g., presence/number of oral ulcers, genital ulcers, skin lesions).", validation: getValidationSchema('number') }
    ],
    calculationLogic: (inputs) => {
      const score = Number(inputs.bd_activity_score) || 0;
      const interpretation = `Behçet's Disease Mucocutaneous Activity Score: ${score}. Higher score indicates greater mucocutaneous activity. Interpretation depends on the specific index used.`;
      return { score, interpretation, details: { User_Entered_Score: score } };
    },
    references: ["Various indices have been proposed, e.g., Behçet's Disease Current Activity Form (BDCAF) includes mucocutaneous items. No single universally adopted 'Mucocutaneous Index' is standard, often part of broader activity scores."]
  },
  {
    id: "mfg_score",
    name: "Ferriman-Gallwey Score (mFG)",
    acronym: "mFG Score",
    description: "Evaluates hirsutism in women by grading terminal hair growth in nine body areas.",
    condition: "Hirsutism",
    keywords: ["mfg", "ferriman-gallwey", "hirsutism", "hair growth", "women"],
    sourceType: 'Clinical Guideline',
    icon: Type, 
    inputs: [
      ...(["Upper Lip", "Chin", "Chest", "Upper Back", "Lower Back", "Upper Abdomen", "Lower Abdomen", "Arm", "Thigh"].map(areaName => {
        const areaId = `fg_${areaName.toLowerCase().replace(/\s+/g, '_')}`;
        const scoreOptions: InputOption[] = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} - ${i === 0 ? 'Absent' : (i === 1 ? 'Minimal' : (i === 2 ? 'Mild' : (i === 3 ? 'Moderate' : 'Severe')))}` }));
        return {
          id: areaId,
          label: `${areaName} Score (0-4)`,
          type: 'select' as 'select',
          options: scoreOptions,
          defaultValue: 0,
          description: "0=Absent, 1=Minimal, 2=Mild, 3=Moderate, 4=Severe terminal hair. Refer to mFG guide for visuals.",
          validation: getValidationSchema('select', scoreOptions, 0, 4)
        };
      }))
    ],
    calculationLogic: (inputs) => {
      let totalScore = 0;
      const areaScores: Record<string, number> = {};
      const areas = ["Upper Lip", "Chin", "Chest", "Upper Back", "Lower Back", "Upper Abdomen", "Lower Abdomen", "Arm", "Thigh"];
      areas.forEach(areaName => {
        const key = `fg_${areaName.toLowerCase().replace(/\s+/g, '_')}`;
        const score = Number(inputs[key]) || 0;
        totalScore += score;
        areaScores[areaName.replace(/\s+/g, '_')] = score;
      });

      let severityInterpretation = "";
      if (totalScore < 8) severityInterpretation = "Normal hair growth or clinically insignificant hirsutism.";
      else if (totalScore <= 15) severityInterpretation = "Mild hirsutism.";
      else severityInterpretation = "Moderate to Severe hirsutism.";
      
      const interpretation = `mFG Score: ${totalScore} (Range: 0-36). ${severityInterpretation} A score of ≥8 is often used to define hirsutism.`;
      return { score: totalScore, interpretation, details: areaScores };
    },
    references: ["Ferriman D, Gallwey JD. Clinical assessment of body hair growth in women. J Clin Endocrinol Metab. 1961;21:1440-7.", "Hatch R, Rosenfield RL, Kim MH, Tredway D. Hirsutism: implications, etiology, and management. Am J Obstet Gynecol. 1981;140(7):815-30. (Modified score popularization)"]
  },
  {
    id: "ctcae_skin",
    name: "CTCAE - Skin Toxicities",
    acronym: "CTCAE Skin",
    description: "Standardized grading of dermatologic Adverse Events (AEs) using the Common Terminology Criteria for Adverse Events. Select an AE and then its grade.",
    condition: "Adverse Drug Reactions",
    keywords: ["ctcae", "skin toxicity", "adverse event", "drug reaction", "grading", "chemotherapy", "oncology"],
    sourceType: 'Clinical Guideline',
    icon: ShieldQuestion,
    inputs: [
      {
        id: "ae_term_select",
        label: "Select Cutaneous Adverse Event",
        type: 'select',
        options: ctcaeAdverseEventOptions,
        defaultValue: ctcaeAdverseEventOptions[0]?.value || "Other",
        validation: getValidationSchema('select', ctcaeAdverseEventOptions)
      },
      { 
        id: "ctcae_grade", 
        label: "CTCAE Grade (1-5)", 
        type: 'select', 
        options: [
          { value: 1, label: "Grade 1" },
          { value: 2, label: "Grade 2" },
          { value: 3, label: "Grade 3" },
          { value: 4, label: "Grade 4" },
          { value: 5, label: "Grade 5" }
        ], 
        defaultValue: 1,
        description: "Select grade. Specific criteria summary for the chosen AE will be shown in results.",
        validation: getValidationSchema('select', [{value:1, label:"Grade 1"}], 1, 5) 
      }
    ],
    calculationLogic: (inputs) => {
      const selectedAe = inputs.ae_term_select as string;
      const grade = Number(inputs.ctcae_grade);
      const gradeMap: Record<number, string> = { 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Life-threatening", 5: "Death" };
      
      let aeSpecificCriteria = "N/A";
      if (ctcaeCriteriaSnippets[selectedAe] && ctcaeCriteriaSnippets[selectedAe][grade]) {
        aeSpecificCriteria = ctcaeCriteriaSnippets[selectedAe][grade];
      } else if (ctcaeCriteriaSnippets[selectedAe] && !ctcaeCriteriaSnippets[selectedAe][grade] && (grade === 4 || grade === 5)) {
         if (grade === 4 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Life-threatening consequences; urgent intervention indicated.";
         else if (grade === 5 && selectedAe !== "Pruritus" && selectedAe !== "Hand-foot skin reaction" && selectedAe !== "Alopecia") aeSpecificCriteria = "Death related to AE.";
         else aeSpecificCriteria = `Grade ${grade} (${gradeMap[grade] || 'N/A'}) for ${selectedAe}. Refer to CTCAE manual.`;
      } else if (selectedAe === "Other") {
        aeSpecificCriteria = `Grade ${grade} (${gradeMap[grade] || 'N/A'}) for "Other" AE. Document specific criteria manually.`;
      } else {
        aeSpecificCriteria = `Criteria for ${selectedAe} Grade ${grade} not pre-defined in this tool's snippets. Grade ${grade} generally corresponds to: ${gradeMap[grade] || 'N/A'}. Refer to full CTCAE manual.`;
      }

      const interpretation = `Adverse Event: ${selectedAe}\nCTCAE Grade: ${grade} (${gradeMap[grade] || 'N/A'})\nCriteria Summary: ${aeSpecificCriteria}\n(Refer to full CTCAE v5.0/v6.0 documentation for complete definitions and all terms.)`;
      
      return { 
        score: grade, 
        interpretation, 
        details: { 
          Adverse_Event_Term: selectedAe, 
          Selected_Grade: grade,
          Grade_Description: gradeMap[grade] || "N/A",
          Criteria_Summary: aeSpecificCriteria 
        } 
      };
    },
    references: ["National Cancer Institute (NCI). Common Terminology Criteria for Adverse Events (CTCAE). (Current version should be cited, e.g., v5.0, v6.0)"]
  },
  {
    id: "bilag_skin",
    name: "BILAG - Skin Component",
    acronym: "BILAG Skin",
    description: "Assesses lupus activity in the mucocutaneous domain as part of the British Isles Lupus Assessment Group index.",
    condition: "Lupus",
    keywords: ["bilag", "lupus", "sle", "skin", "mucocutaneous", "activity", "disease activity index"],
    sourceType: 'Clinical Guideline',
    icon: FileHeart,
    inputs: [
      { 
        id: "bilag_skin_grade", 
        label: "BILAG Mucocutaneous Grade", 
        type: 'select', 
        options: [
          { value: "A", label: "A - Severe disease activity" },
          { value: "B", label: "B - Moderate disease activity" },
          { value: "C", label: "C - Mild disease activity" },
          { value: "D", label: "D - Disease inactive but previous involvement" },
          { value: "E", label: "E - Never involved" }
        ], 
        defaultValue: "E",
        validation: getValidationSchema('select', [{ value: "A", label: "A - Severe disease activity" }])
      }
    ],
    calculationLogic: (inputs) => {
      const grade = inputs.bilag_skin_grade as string || "E";
      const scoreMap: Record<string, number> = { "A": 4, "B": 3, "C": 2, "D": 1, "E": 0 }; // Example numeric mapping if needed
      const activityMap: Record<string, string> = { "A": "Severe", "B": "Moderate", "C": "Mild", "D": "Inactive (previous)", "E": "Never involved" };
      const interpretation = `BILAG Skin Component Grade: ${grade} (${activityMap[grade] || "N/A"}). This reflects current lupus activity in the skin and mucous membranes.`;
      return { score: scoreMap[grade] !== undefined ? scoreMap[grade] : 0, interpretation, details: { BILAG_Grade: grade, Activity_Level: activityMap[grade] || "N/A" } };
    },
    references: ["Hay EM, et al. Criteria for data collection and analysis in randomized clinical trials for systemic lupus erythematosus (SLE) I. The British Isles Lupus Assessment Group (BILAG) index for the assessment of SLE activity. Br J Rheumatol. 1993.", "Isenberg DA, et al. BILAG 2004. Development and initial validation of an updated version of the British Isles Lupus Assessment Group's disease activity index for patients with systemic lupus erythematosus. Rheumatology (Oxford). 2005."]
  },
  {
    id: "sledai_skin",
    name: "SLEDAI - Skin Descriptors",
    acronym: "SLEDAI Skin",
    description: "Scores specific skin manifestations as part of the Systemic Lupus Erythematosus Disease Activity Index (SLEDAI).",
    condition: "Lupus",
    keywords: ["sledai", "lupus", "sle", "skin descriptors", "disease activity", "rash", "alopecia", "mucosal ulcers", "vasculitis"],
    sourceType: 'Clinical Guideline',
    icon: FileHeart,
    inputs: [
      { id: "rash", label: "Rash (New/Recurrent inflammatory type - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "alopecia", label: "Alopecia (New/Recurrent abnormal, diffuse, or patchy hair loss - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "mucosal_ulcers", label: "Mucosal Ulcers (New/Recurrent oral or nasal - 4 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "vasculitis", label: "Cutaneous Vasculitis (Ulceration, gangrene, tender nodules, purpura, splinter hemorrhages, periungual lesions - 8 points)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const details: Record<string, string> = {};
      if (inputs.rash) { score += 4; details.Rash = "Present (4 pts)"; } else { details.Rash = "Absent (0 pts)"; }
      if (inputs.alopecia) { score += 4; details.Alopecia = "Present (4 pts)"; } else { details.Alopecia = "Absent (0 pts)"; }
      if (inputs.mucosal_ulcers) { score += 4; details.Mucosal_Ulcers = "Present (4 pts)"; } else { details.Mucosal_Ulcers = "Absent (0 pts)"; }
      if (inputs.vasculitis) { score += 8; details.Cutaneous_Vasculitis = "Present (8 pts)"; } else { details.Cutaneous_Vasculitis = "Absent (0 pts)"; }
      
      const interpretation = `SLEDAI Skin Descriptors Score: ${score}. This score contributes to the total SLEDAI. Higher score indicates greater skin-related disease activity.`;
      return { score, interpretation, details };
    },
    references: ["Bombardier C, et al. Derivation of the SLEDAI. A disease activity index for lupus patients. Arthritis Rheum. 1992.", "Gladman DD, et al. Systemic Lupus Erythematosus Disease Activity Index 2000. J Rheumatol. 2002."]
  },
  {
    id: "bvas_skin",
    name: "BVAS - Skin Component",
    acronym: "BVAS Skin",
    description: "Scores skin manifestations for the Birmingham Vasculitis Activity Score (BVAS).",
    condition: "Vasculitis",
    keywords: ["bvas", "vasculitis", "skin involvement", "activity score", "rash", "ulcer", "gangrene"],
    sourceType: 'Clinical Guideline',
    icon: HeartPulse,
    inputs: [
      { 
        id: "rash_bvas", 
        label: "Rash (Purpura, urticaria, other)", 
        type: 'select', 
        options: [
          { value: 0, label: "0 - Absent" },
          { value: 1, label: "1 - Persistent (present at this visit, but also at last visit without worsening)" },
          { value: 3, label: "3 - New/Worse (new onset or definite worsening since last visit)" }
        ], 
        defaultValue: 0,
        validation: getValidationSchema('select', [], 0, 3)
      },
      { id: "ulcer_bvas", label: "Skin Ulceration (non-digital, excluding major gangrene) (1 point if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "gangrene_bvas", label: "Major Digital Ischemia/Gangrene (6 points if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "other_skin_bvas", label: "Other Skin Lesions (e.g., nodules, livedo - 1 point if new/worse)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const details: Record<string, string> = {};
      const rashScore = Number(inputs.rash_bvas) || 0;
      score += rashScore;
      details.Rash = `Score ${rashScore}`;

      if (inputs.ulcer_bvas) { score += 1; details.Skin_Ulceration = "Present (1 pt)"; } else { details.Skin_Ulceration = "Absent (0 pts)"; }
      if (inputs.gangrene_bvas) { score += 6; details.Major_Digital_Ischemia_Gangrene = "Present (6 pts)"; } else { details.Major_Digital_Ischemia_Gangrene = "Absent (0 pts)"; }
      if (inputs.other_skin_bvas) { score += 1; details.Other_Skin_Lesions = "Present (1 pt)"; } else { details.Other_Skin_Lesions = "Absent (0 pts)"; }
      
      const interpretation = `BVAS Skin Component Score: ${score}. This score contributes to the total BVAS. Higher score indicates greater skin-related vasculitis activity. (Note: Scoring assumes new/worse for checkbox items if checked).`;
      return { score, interpretation, details };
    },
    references: ["Luqmani RA, et al. Birmingham Vasculitis Activity Score (BVAS) in systemic necrotizing vasculitis. QJM. 1994.", "Mukhtyar C, et al. Modification and validation of the Birmingham Vasculitis Activity Score (version 3). Ann Rheum Dis. 2009."]
  },
  {
    id: "essdai_cutaneous",
    name: "ESSDAI - Cutaneous Domain",
    acronym: "ESSDAI Cutaneous",
    description: "Scores the cutaneous domain of the EULAR Sjögren's Syndrome Disease Activity Index (ESSDAI).",
    condition: "Sjögren's Syndrome",
    keywords: ["essdai", "sjogren's syndrome", "cutaneous domain", "skin activity", "disease activity index"],
    sourceType: 'Clinical Guideline',
    icon: CloudDrizzle,
    inputs: [
      { 
        id: "cutaneous_activity_level", 
        label: "Cutaneous Domain Activity Level", 
        type: 'select', 
        options: [
          { value: 0, label: "0 - No activity" },
          { value: 1, label: "1 - Low activity (e.g., non-vasculitic purpura <2 sites, limited urticarial vasculitis)" },
          { value: 2, label: "2 - Moderate activity (e.g., vasculitic purpura >2 sites or one major site, extensive urticarial vasculitis, cutaneous ulcers)" },
          { value: 3, label: "3 - High activity (e.g., extensive/multiple skin ulcers, digital gangrene)" }
        ], 
        defaultValue: 0,
        description: "Refer to ESSDAI definitions for specific criteria for each activity level.",
        validation: getValidationSchema('select', [], 0, 3)
      }
    ],
    calculationLogic: (inputs) => {
      const activityLevel = Number(inputs.cutaneous_activity_level) || 0;
      const weightedScore = activityLevel * 2; // Cutaneous domain weight in ESSDAI is 2
      const activityMap: Record<number, string> = { 0: "No activity", 1: "Low activity", 2: "Moderate activity", 3: "High activity" };

      const interpretation = `ESSDAI Cutaneous Domain: Activity Level ${activityLevel} (${activityMap[activityLevel] || "N/A"}). Weighted Score contribution to total ESSDAI: ${weightedScore}.`;
      return { score: weightedScore, interpretation, details: { Activity_Level: activityLevel, Level_Description: activityMap[activityLevel] || "N/A" } };
    },
    references: ["Seror R, et al. EULAR Sjogren's Syndrome Disease Activity Index (ESSDAI): a user guide. RMD Open. 2015.", "Shiboski CH, et al. American College of Rheumatology classification criteria for Sjögren's syndrome: a data-driven, expert consensus approach in the Sjögren's International Collaborative Clinical Alliance cohort. Arthritis Care Res (Hoboken). 2012. (ESSDAI is used in conjunction)."]
  },
  {
    id: "scorten",
    name: "SCORTEN",
    acronym: "SCORTEN",
    description: "A severity-of-illness score to predict mortality in patients with Stevens-Johnson Syndrome (SJS) or Toxic Epidermal Necrolysis (TEN).",
    condition: "SJS/TEN",
    keywords: ["scorten", "sjs", "ten", "stevens-johnson syndrome", "toxic epidermal necrolysis", "prognosis", "mortality", "drug reaction"],
    sourceType: 'Clinical Guideline',
    icon: ShieldAlert,
    inputs: [
      { id: "age_ge40", label: "Age ≥ 40 years", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "malignancy_present", label: "Associated malignancy (cancer)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "heart_rate_ge120", label: "Heart rate ≥ 120 beats/minute", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "bsa_gt10", label: "Initial percentage of body surface area (BSA) detachment > 10%", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "serum_urea_gt10", label: "Serum urea level > 10 mmol/L (or > 28 mg/dL)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "serum_bicarbonate_lt20", label: "Serum bicarbonate level < 20 mmol/L (or < 20 mEq/L)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') },
      { id: "serum_glucose_gt14", label: "Serum glucose level > 14 mmol/L (or > 252 mg/dL)", type: 'checkbox', defaultValue: false, validation: getValidationSchema('checkbox') }
    ],
    calculationLogic: (inputs) => {
      let score = 0;
      const details: Record<string, string> = {};
      const factors = [
        { key: "age_ge40", label: "Age ≥ 40 years" },
        { key: "malignancy_present", label: "Malignancy present" },
        { key: "heart_rate_ge120", label: "Heart rate ≥ 120/min" },
        { key: "bsa_gt10", label: "BSA detachment > 10%" },
        { key: "serum_urea_gt10", label: "Serum urea > 10 mmol/L" },
        { key: "serum_bicarbonate_lt20", label: "Serum bicarbonate < 20 mmol/L" },
        { key: "serum_glucose_gt14", label: "Serum glucose > 14 mmol/L" }
      ];
      factors.forEach(factor => {
        if (inputs[factor.key]) {
          score++;
          details[factor.label] = "Present (1 pt)";
        } else {
          details[factor.label] = "Absent (0 pts)";
        }
      });

      const mortalityMap: Record<number, string> = {
        0: "3.2%", 1: "12.1%", 2: "35.3%", 3: "58.3%", 4: "58.3%+", 5: ">90%", 6: ">90%", 7: ">90%"
      };
      
      let mortalityPrediction = ">90%"; // Default for scores >= 5
      if (score <= 3) mortalityPrediction = mortalityMap[score];
      else if (score === 4) mortalityPrediction = mortalityMap[4];


      const interpretation = `SCORTEN: ${score} (Range: 0-7). Predicted mortality risk (approximate): ${mortalityPrediction}. This score helps estimate prognosis in SJS/TEN.`;
      return { score, interpretation, details };
    },
    references: ["Bastuji-Garin S, et al. SCORTEN: a severity-of-illness score for toxic epidermal necrolysis. J Invest Dermatol. 2000 Aug;115(2):149-53."]
  }
];
    
    








