
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
    "Olsen EA, Hordinsky MK, Price VH, et al. Alopecia areata investigational assessment guidelines--Part II. National Alopecia Areata Foundation. J Am Acad Dermatol. 2004 Sep;51(3):440-7.",
    "Meah N, Wall D, York K, et al. The Alopecia Areata Scale: A new instrument to measure the psychosocial impact of alopecia areata. Br J Dermatol. 2020 Jan;182(1):181-187. (Note: This describes a QoL scale, SALT itself is for extent)."
  ]
};
