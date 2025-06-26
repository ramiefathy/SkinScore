
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { UserMinus } from 'lucide-react'; // Example icon, consider better for hair loss
import { getValidationSchema } from '../toolValidation';

const saltScalpRegions = [
  { id: 'vertex', name: 'Vertex', bsaWeight: 0.40, bsaPercentDisplay: 40 },
  { id: 'right_side', name: 'Right Side', bsaWeight: 0.18, bsaPercentDisplay: 18 },
  { id: 'left_side', name: 'Left Side', bsaWeight: 0.18, bsaPercentDisplay: 18 },
  { id: 'posterior', name: 'Posterior (Back of Head)', bsaWeight: 0.24, bsaPercentDisplay: 24 }
];

const saltFormSections: FormSectionConfig[] = saltScalpRegions.map(region => ({
  id: `salt_loss_percent_${region.id}`,
  label: `Percentage Hair Loss in ${region.name} (${region.bsaPercentDisplay}%)`,
  type: 'number',
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  validation: getValidationSchema('number', [], 0, 100),
  description: `Enter the percentage of hair loss (0-100) for the ${region.name} area.`
} as InputConfig));

export const saltTool: Tool = {
  id: "salt",
  name: "Severity of Alopecia Tool (SALT Score)",
  acronym: "SALT",
  condition: "Alopecia Areata",
  keywords: ["salt", "alopecia areata", "hair loss", "scalp involvement", "naaf"],
  description: "The SALT score quantifies the extent of scalp hair loss in alopecia areata as a percentage of total scalp area. It is calculated by summing the weighted percentage of hair loss from four scalp regions: Vertex (40%), Right Side (18%), Left Side (18%), and Posterior (24%).",
  sourceType: 'Research',
  icon: UserMinus, // Placeholder icon
  rationale: "The SALT score was developed to provide a standardized, quantitative assessment of scalp hair loss in patients with alopecia areata (AA). The rationale was to enable consistent measurement of disease extent for both clinical trials and routine practice, facilitating objective monitoring of disease progression and response to therapy. The SALT score divides the scalp into four regions, each assigned a percentage based on its relative surface area: • Vertex: 40% • Right profile: 18% • Left profile: 18% • Posterior: 24% For each region, the percentage of hair loss is estimated visually. The regional percentage hair loss is multiplied by the region’s weight, and the sum of all four regions gives the total SALT score, which ranges from 0 (no hair loss) to 100 (complete scalp hair loss).",
  clinicalPerformance: "The SALT score is widely used in both research and clinical practice. A large prospective cross-sectional study of 303 patients with AA (ages 6 months to 84 years) demonstrated that higher SALT scores were associated with longer disease duration, nail involvement, and neuropsychiatric comorbidities, supporting the tool’s construct validity. Trichoscopic markers of disease activity and severity also correlated with SALT scores. Automated image analysis approaches have been developed to standardize SALT scoring. Gudobba et al. found that automated algorithms could estimate percentage hair loss with an absolute error of 7% compared to manual scoring, which is within the range of inter-rater variability reported for manual SALT scoring. This supports the reproducibility of the SALT score when standardized imaging protocols are followed. However, formal inter-rater and intra-rater reliability statistics are infrequently reported in the literature.",
  formSections: [
    {
      id: "salt_inputs_group",
      title: "Scalp Hair Loss Assessment",
      description: "For each of the four scalp regions, estimate the percentage of hair loss (0-100%). The tool will apply the respective BSA weights for calculation.",
      gridCols: 2, // Display inputs in 2 columns
      inputs: saltFormSections as InputConfig[]
    }
  ],
  calculationLogic: (inputs) => {
    let totalSaltScore = 0;
    const regionalContributions: Record<string, number> = {};

    saltScalpRegions.forEach(region => {
      const lossPercent = Number(inputs[`salt_loss_percent_${region.id}`]) || 0;
      const contribution = (lossPercent / 100) * region.bsaWeight * 100; // Multiply by 100 to get score out of 100
      totalSaltScore += contribution;
      regionalContributions[`${region.name}_Contribution`] = parseFloat(contribution.toFixed(1));
    });

    const score = parseFloat(totalSaltScore.toFixed(1));

    let severityCategory = "";
    if (score === 0) severityCategory = "S0 - No hair loss";
    else if (score <= 25) severityCategory = "S1 - Mild (≤25% loss)";
    else if (score <= 50) severityCategory = "S2 - Moderate (26–50% loss)";
    else if (score <= 75) severityCategory = "S3 - Severe (51–75% loss)";
    else if (score < 100) severityCategory = "S4 - Very Severe (76–99% loss)";
    else severityCategory = "S5 - Alopecia Totalis (100% loss)";

    const interpretation = `Total SALT Score: ${score} (Range: 0-100). Severity Category: ${severityCategory}.`;

    return {
      score,
      interpretation,
      details: {
        ...regionalContributions,
        Total_SALT_Score: score,
        Severity_Category: severityCategory
      }
    };
  },
  references: [
    "Xia E, Li SJ, Drake L, et al. An Assessment of Current Clinician-Reported and Patient-Reported Outcome Measures for Alopecia Areata: A Scoping Review. The Journal of Investigative Dermatology. 2023;143(7):1133-1137.e12. doi:10.1016/j.jid.2023.02.020.",
    "Sun DI, Paller AS. Assessment of Alopecia Areata Disease Severity In Pediatric Patients. Pediatric Dermatology. 2025;42 Suppl 1:31-35. doi:10.1111/pde.15830.",
    "Kaya G, Tak AY. Evaluation of SALT Score Severity in Correlation With Trichoscopic Findings in Alopecia Areata: A Study of 303 Patients. Archives of Dermatological Research. 2025;317(1):523. doi:10.1007/s00403-025-04026-z.",
    "Gudobba C, Mane T, Bayramova A, et al. Automating Hair Loss Labels for Universally Scoring Alopecia From Images: Rethinking Alopecia Scores. JAMA Dermatology. 2023;159(2):143-150. doi:10.1001/jamadermatol.2022.5415.",
    "Bernardis E, Nukpezah J, Li P, Christensen T, Castelo-Soccio L. Pediatric Severity of Alopecia Tool. Pediatric Dermatology. 2018;35(1):e68-e69. doi:10.1111/pde.13327.",
    "Rangu S, Rogers R, Castelo-Soccio L. Understanding Alopecia Areata Characteristics in Children Under the Age of 4 Years. Pediatric Dermatology. 2019;36(6):854-858. doi:10.1111/pde.13990.",
    "Putterman E, Patel DP, Andrade G, et al. Severity of Disease and Quality of Life in Parents of Children With Alopecia Areata, Totalis, and Universalis: A Prospective, Cross-Sectional Study. Journal of the American Academy of Dermatology. 2019;80(5):1389-1394. doi:10.1016/j.jaad.2018.12.051.",
    "Moussa A, Bennett M, Wall D, et al. The Alopecia Areata Severity and Morbidity Index (ASAMI) Study: Results From a Global Expert Consensus Exercise on Determinants of Alopecia Areata Severity. JAMA Dermatology. 2024;160(3):341-350. doi:10.1001/jamadermatol.2023.5869."
  ]
};
