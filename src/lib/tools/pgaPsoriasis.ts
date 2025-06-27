
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
  description: "The PGA is a clinician-rated, static global assessment of psoriasis severity, designed to provide a rapid, standardized evaluation of overall disease severity.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pga", "psoriasis", "physician global assessment", "severity", "psoriatic arthritis"],
  sourceType: 'Research',
  icon: UserCheck,
  rationale: "The rationale for its development was to offer a simple alternative or complement to more complex tools such as the Psoriasis Area and Severity Index (PASI), particularly for use in clinical trials and routine practice. The PGA is typically structured as a 5- or 6-point ordinal scale, with categories such as \"clear,\" \"almost clear,\" \"mild,\" \"moderate,\" and \"severe.\" The assessment is based on the average severity of erythema, induration, and scaling across all involved body areas. The physician assigns a single score reflecting overall severity, without formal subscores. Composite measures, such as the product of PGA and body surface area (PGA × BSA), have been introduced to enhance sensitivity, especially in mild disease.",
  clinicalPerformance: "The PGA demonstrates a strong correlation with PASI, particularly at higher levels of disease activity. A systematic review found the correlation coefficient (r^2) between PASI 75 and PGA clear/almost clear was 0.92 at 8–16 weeks and 0.89 at 17–24 weeks. A large real-world cohort (BADBIR) showed a Spearman correlation between PGA and PASI of 0.92. The PGA has substantial intrarater reliability and moderate interrater reliability, with ICCs of 0.75–0.80, though these are less than that of PASI or the Lattice System-PGA. While responsive to change, systematic reviews have noted that the 5- and 6-point PGA scales lack robust evidence for content validity compared to more complex instruments.\n\nValidation and Comparative Studies\nMultiple studies have validated the PGA in both clinical trials and real-world settings. Comparative studies have shown that the PGA is substantially redundant with PASI in moderate-to-severe disease. The PGA × BSA composite correlates well with PASI and is simpler to use, particularly in mild disease.\n\nReal-World Implementation\nThe PGA is widely used due to its simplicity and minimal time burden. The American Academy of Dermatology and National Psoriasis Foundation endorse the PGA as a valid and feasible measure. Barriers include variability in scoring among clinicians and a lack of standardized anchors. Facilitators include its integration into composite measures and treat-to-target strategies.",
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
    "Perez-Chada LM, Salame NF, Ford AR, et al. Investigator and Patient Global Assessment Measures for Psoriasis Clinical Trials: A Systematic Review on Measurement Properties From the International Dermatology Outcome Measures (IDEOM) Initiative. American Journal of Clinical Dermatology. 2020;21(3):323-338. doi:10.1007/s40257-019-00496-w.",
    "Robinson A, Kardos M, Kimball AB. Physician Global Assessment (PGA) and Psoriasis Area and Severity Index (PASI): Why Do Both? A Systematic Analysis of Randomized Controlled Trials of Biologic Agents for Moderate to Severe Plaque Psoriasis. Journal of the American Academy of Dermatology. 2012;66(3):369-75. doi:10.1016/j.jaad.2011.01.022.",
    "Elmets CA, Korman NJ, Prater EF, et al. Joint AAD-NPF Guidelines of Care for the Management and Treatment of Psoriasis With Topical Therapy and Alternative Medicine Modalities for Psoriasis Severity Measures. Journal of the American Academy of Dermatology. 2021;84(2):432-470. doi:10.1016/j.jaad.2020.07.087.",
    "Mahil SK, Wilson N, Dand N, et al. Psoriasis Treat to Target: Defining Outcomes in Psoriasis Using Data From a Real-World, Population-Based Cohort Study (The British Association of Dermatologists Biologics and Immunomodulators Register, BADBIR). The British Journal of Dermatology. 2020;182(5):1158-1166. doi:10.1111/bjd.18333.",
    "Langley RG, Ellis CN. Evaluating Psoriasis With Psoriasis Area and Severity Index, Psoriasis Global Assessment, and Lattice System Physician's Global Assessment. Journal of the American Academy of Dermatology. 2004;51(4):563-9. doi:10.1016/j.jaad.2004.04.012.",
    "Pascoe VL, Enamandram M, Corey KC, et al. Using the Physician Global Assessment in a Clinical Setting to Measure and Track Patient Outcomes. JAMA Dermatology. 2015;151(4):375-81. doi:10.1001/jamadermatol.2014.3513.",
    "Gold LS, Hansen JB, Patel D, Veverka KA, Strober B. PGAxBSA Composite Versus PASI: Comparison Across Disease Severities and as Therapeutic Response Measure for Cal/Bd Foam in Plaque Psoriasis. Journal of the American Academy of Dermatology. 2020;83(1):131-138. doi:10.1016/j.jaad.2020.02.077.",
    "Berth-Jones J, Grotzinger K, Rainville C, et al. A Study Examining Inter- And Intrarater Reliability of Three Scales for Measuring Severity of Psoriasis: Psoriasis Area and Severity Index, Physician's Global Assessment and Lattice System Physician's Global Assessment. The British Journal of Dermatology. 2006;155(4):707-13. doi:10.1111/j.1365-2133.2006.07389.x.",
    "Berth-Jones J, Thompson J, Papp K. A Study Examining Inter-Rater and Intrarater Reliability of a Novel Instrument for Assessment of Psoriasis: The Copenhagen Psoriasis Severity Index. The British Journal of Dermatology. 2008;159(2):407-12. doi:10.1111/j.1365-2133.2008.08680.x."
  ]
};
