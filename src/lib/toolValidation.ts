
import type { InputOption } from './types';
import { z } from 'zod';

// Helper for Zod validation schemas based on input type
export const getValidationSchema = (inputType: string, options?: Array<InputOption>, min?: number, max?: number): z.ZodSchema<any> => {
  switch (inputType) {
    case 'number':
      let numSchema: z.ZodNumber = z.coerce.number({
        invalid_type_error: "Must be a number"
      });

      if (min !== undefined) {
        numSchema = numSchema.min(min, { message: `Must be ${min} or more.` });
      }
      if (max !== undefined) {
        numSchema = numSchema.max(max, { message: `Must be ${max} or less.` });
      }
      return numSchema.nullable().optional();
    case 'select':
      if (options && options.length > 0) {
        const firstValueType = typeof options[0].value;
        if (firstValueType === 'number') {
          return z.coerce.number({invalid_type_error: "Selection required"}).nullable().optional();
        } else if (firstValueType === 'string') {
          return z.string({invalid_type_error: "Selection required"}).nullable().optional();
        }
      }
      return z.string().nullable().optional();
    case 'checkbox':
      return z.boolean().optional();
    case 'text':
    case 'textarea':
      return z.string().nullable().optional();
    case 'radio':
        if (options && options.length > 0 && typeof options[0].value === 'number') {
            return z.coerce.number({invalid_type_error: "Selection required"}).nullable().optional();
        }
        return z.string().nullable().optional();
    default:
      return z.any().optional();
  }
};

export const severityOptions0to4: InputOption[] = [ {value:0, label:"0-None"}, {value:1, label:"1-Slight/Mild"}, {value:2, label:"2-Moderate"}, {value:3, label:"3-Marked/Severe"}, {value:4, label:"4-Very Severe"} ];
export const areaOptions0to6: InputOption[] = [ {value:0, label:"0 (0%)"}, {value:1, label:"1 (1-9%)"}, {value:2, label:"2 (10-29%)"}, {value:3, label:"3 (30-49%)"}, {value:4, label:"4 (50-69%)"}, {value:5, label:"5 (70-89%)"}, {value:6, label:"6 (90-100%)"} ];

export const masiRegionMultiplierMapData: Record<string, number> = {
  "forehead": 0.3,
  "right_malar": 0.3,
  "left_malar": 0.3,
  "chin": 0.1
};

export const ctcaeCriteriaSnippets: Record<string, Record<number, string>> = {
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

export const ctcaeAdverseEventOptions: InputOption[] = Object.keys(ctcaeCriteriaSnippets).map(ae => ({ value: ae, label: ae }));
ctcaeAdverseEventOptions.push({value: "Other", label: "Other (Specify in notes/report)"});
