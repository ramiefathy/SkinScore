
import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { UserCheck } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const pgaPsoriasisOptions: InputOption[] = [
  { value: 0, label: "0 - Clear" }, { value: 1, label: "1 - Almost Clear / Minimal" }, { value: 2, label: "2 - Mild" },
  { value: 3, label: "3 - Mild to Moderate" }, { value: 4, label: "4 - Moderate" }, { value: 5, label: "5 - Moderate to Severe" }, { value: 6, label: "6 - Severe / Very Marked" }
];

export const pgaPsoriasisTool: Tool = {
  id: "pga_psoriasis",
  name: "Physician Global Assessment (PGA) for Psoriasis",
  acronym: "PGA Psoriasis",
  description: "The PGA is a clinician-rated, static global assessment of psoriasis severity, designed to provide a rapid, standardized evaluation of overall disease severity. The rationale for its development was to offer a simple alternative or complement to more complex tools such as the Psoriasis Area and Severity Index (PASI), particularly for use in clinical trials and routine practice. The PGA is typically structured as a 5- or 6-point ordinal scale, with categories such as \"clear,\" \"almost clear,\" \"mild,\" \"moderate,\" and \"severe.\" The assessment is based on the average severity of erythema, induration, and scaling across all involved body areas. The physician assigns a single score reflecting overall severity, without formal subscores. Composite measures, such as the product of PGA and body surface area (PGA × BSA), have been introduced to enhance sensitivity, especially in mild disease.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pga", "psoriasis", "physician global assessment", "severity", "psoriatic arthritis"],
  sourceType: 'Research',
  icon: UserCheck,
  formSections: [
    {
      id: "pga_level", label: "Select PGA Level (Example 7-Level)", type: 'select',
      options: pgaPsoriasisOptions,
      defaultValue: 0, validation: getValidationSchema('select', pgaPsoriasisOptions ,0,6)
    }
  ],
  calculationLogic: (inputs) => {
      const pgaLevel = Number(inputs.pga_level);
      const pgaDescription = pgaPsoriasisOptions.find(opt => opt.value === pgaLevel)?.label || "N/A";
      const score = pgaLevel;
      const interpretation = `PGA for Psoriasis: Level ${score} (${pgaDescription}). Score directly reflects assessed severity. PGA 0 or 1 often a treatment goal.`;
      return { score, interpretation, details: { pga_description: pgaDescription } };
  },
  references: [
    "Investigator and Patient Global Assessment Measures for Psoriasis Clinical Trials: A Systematic Review on Measurement Properties From the International Dermatology Outcome Measures (IDEOM) Initiative. Perez-Chada LM, Salame NF, Ford AR, et al. American Journal of Clinical Dermatology. 2020;21(3):323-338. doi:10.1007/s40257-019-00496-w.",
    "Physician Global Assessment (PGA) and Psoriasis Area and Severity Index (PASI): Why Do Both? A Systematic Analysis of Randomized Controlled Trials of Biologic Agents for Moderate to Severe Plaque Psoriasis. Robinson A, Kardos M, Kimball AB. Journal of the American Academy of Dermatology. 2012;66(3):369-75. doi:10.1016/j.jaad.2011.01.022.",
    "Joint AAD-NPF Guidelines of Care for the Management and Treatment of Psoriasis With Topical Therapy and Alternative Medicine Modalities for Psoriasis Severity Measures. Elmets CA, Korman NJ, Prater EF, et al. Journal of the American Academy of Dermatology. 2021;84(2):432-470. doi:10.1016/j.jaad.2020.07.087.",
    "Psoriasis Treat to Target: Defining Outcomes in Psoriasis Using Data From a Real-World, Population-Based Cohort Study (The British Association of Dermatologists Biologics and Immunomodulators Register, BADBIR). Mahil SK, Wilson N, Dand N, et al. The British Journal of Dermatology. 2020;182(5):1158-1166. doi:10.1111/bjd.18333.",
    "Evaluating Psoriasis With Psoriasis Area and Severity Index, Psoriasis Global Assessment, and Lattice System Physician's Global Assessment. Langley RG, Ellis CN. Journal of the American Academy of Dermatology. 2004;51(4):563-9. doi:10.1016/j.jaad.2004.04.012.",
    "Using the Physician Global Assessment in a Clinical Setting to Measure and Track Patient Outcomes. Pascoe VL, Enamandram M, Corey KC, et al. JAMA Dermatology. 2015;151(4):375-81. doi:10.1001/jamadermatol.2014.3513.",
    "PGAxBSA Composite Versus PASI: Comparison Across Disease Severities and as Therapeutic Response Measure for Cal/Bd Foam in Plaque Psoriasis. Gold LS, Hansen JB, Patel D, Veverka KA, Strober B. Journal of the American Academy of Dermatology. 2020;83(1):131-138. doi:10.1016/j.jaad.2020.02.077.",
    "A Study Examining Inter- And Intrarater Reliability of Three Scales for Measuring Severity of Psoriasis: Psoriasis Area and Severity Index, Physician's Global Assessment and Lattice System Physician's Global Assessment. Berth-Jones J, Grotzinger K, Rainville C, et al. The British Journal of Dermatology. 2006;155(4):707-13. doi:10.1111/j.1365-2133.2006.07389.x.",
    "A Study Examining Inter-Rater and Intrarater Reliability of a Novel Instrument for Assessment of Psoriasis: The Copenhagen Psoriasis Severity Index. Berth-Jones J, Thompson J, Papp K. The British Journal of Dermatology. 2008;159(2):407-12. doi:10.1111/j.1365-2133.2008.08680.x."
  ]
};
