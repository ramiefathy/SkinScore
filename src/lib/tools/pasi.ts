import type { Tool, InputConfig, InputOption, FormSectionConfig } from '../types';
import { Gauge } from 'lucide-react';
import { getValidationSchema, severityOptions0to4, areaOptions0to6 } from '../toolValidation';

export const pasiTool: Tool = {
  id: "pasi",
  name: "Psoriasis Area and Severity Index (PASI)",
  acronym: "PASI",
  description: "The PASI is the most widely used clinical severity scale for psoriasis, developed to provide a standardized, quantitative assessment of disease severity for use in clinical trials and practice.",
  condition: "Psoriasis / Psoriatic Arthritis",
  keywords: ["pasi", "psoriasis", "plaque psoriasis", "severity", "index", "psoriatic arthritis"],
  sourceType: 'Clinical Guideline',
  icon: Gauge,
  rationale: "The rationale for PASI was to combine both the extent of body surface area involvement and the severity of key clinical features (erythema, induration, and desquamation) into a single composite score. The PASI divides the body into four regions: head, upper limbs, trunk, and lower limbs, each weighted by its relative surface area. For each region, the area of involvement is scored from 0 to 6, and the severity of erythema, induration, and desquamation is rated from 0 (none) to 4 (maximum). The total PASI score ranges from 0 (no disease) to 72 (maximal disease).",
  clinicalPerformance: "The PASI has good internal consistency and moderate interobserver reliability. Fink et al. reported an interrater ICC of 0.895 and an intrarater ICC of 0.877 among trained physicians using image-based assessments. Automated computer-guided PASI measurements (ACPMs) have demonstrated high agreement with physician assessments (ICC 0.86) and excellent reproducibility (ICC 0.99), outperforming physicians for intrarater reliability. The PASI is most reliable when used by trained clinicians, but reliability decreases in routine practice due to subjectivity and variability in scoring.\n\nSensitivity and specificity are not typically reported for PASI, as it is a continuous severity index rather than a diagnostic tool. Its primary psychometric strengths are good internal consistency, moderate to high inter- and intrarater reliability among trained users, and moderate sensitivity to clinical change.\n\nValidation and Comparative Studies\nThe PASI has been directly compared to alternative tools such as the Body Surface Area (BSA), Physician Global Assessment (PGA), Lattice System Physician's Global Assessment (LS-PGA), Simplified Psoriasis Index (SPI), and Self-Administered PASI (SAPASI). Systematic reviews have found that the PASI is the most thoroughly validated and extensively studied psoriasis severity score, with strong correlations to PGA and LS-PGA, and moderate sensitivity to change. However, none of the available scores, including PASI, meet all ideal validation criteria, and the choice of tool may depend on the specific clinical or research context.\n\nIn pediatric populations, the PASI is frequently used in research but rarely in general practice. The American Academy of Dermatology–National Psoriasis Foundation guideline notes that there is limited literature on the effectiveness or practicality of PASI scoring in children [7]. The Simplified Psoriasis Index (SPI) has been validated in children and may offer greater feasibility and clinical utility [34].\n\nLimitations and Challenges\nThe main limitations of PASI include:\nInterobserver and intraobserver variability\nComplex calculation\nLow responsiveness in mild disease\nFloor effect\nLack of quality of life assessment [31]\n\nThe tool is less sensitive to change in patients with mild disease and may not capture the full impact of psoriasis on patients' lives. The American Academy of Dermatology and National Psoriasis Foundation acknowledge these pitfalls and recommend the use of PASI in conjunction with other clinical and patient-reported measures [13].\n\nStrategies to Improve Reliability\nStrategies to improve the reliability and clinical utility of PASI include structured training for clinicians, standardization of scoring criteria, use of automated or image-based scoring systems, and integration with patient-reported outcome measures [31]. Audit and feedback, academic detailing, and provider reminders can further support consistent application in clinical practice.",
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
  references: [
    "Sampogna F, Sera F, Mazzotti E, et al. Performance of the Self-administered Psoriasis Area and Severity Index in Evaluating Clinical and Sociodemographic Subgroups of Patients With Psoriasis. Archives of Dermatology. 2003;139(3):353-8; discussion 357. doi:10.1001/archderm.139.3.353.",
    "Fink C, Alt C, Uhlmann L, et al. Intra- And Interobserver Variability of Image-Based PASI Assessments in 120 Patients Suffering From Plaque-Type Psoriasis. Journal of the European Academy of Dermatology and Venereology : JEADV. 2018;32(8):1314-1319. doi:10.1111/jdv.14960.",
    "Fink C, Alt C, Uhlmann L, et al. Precision and Reproducibility of Automated Computer-Guided Psoriasis Area and Severity Index Measurements in Comparison With Trained Physicians. The British Journal of Dermatology. 2019;180(2):390-396. doi:10.1111/bjd.17200.",
    "Puzenat E, Bronsard V, Prey S, et al. What Are the Best Outcome Measures for Assessing Plaque Psoriasis Severity? A Systematic Review of the Literature. Journal of the European Academy of Dermatology and Venereology : JEADV. 2010;24 Suppl 2:10-6. doi:10.1111/j.1468-3083.2009.03562.x.",
    "van Geel MJ, Otero ME, de Jong EM, van de Kerkhof PC, Seyger MM. Validation of the Simplified Psoriasis Index in Dutch Children and Adolescents With Plaque Psoriasis. The British Journal of Dermatology. 2017;176(3):771-776. doi:10.1111/bjd.15120.",
    "Folle L, Fenzl P, Fagni F, et al. DeepNAPSI Multi-Reader Nail Psoriasis Prediction Using Deep Learning. Scientific Reports. 2023;13(1):5329. doi:10.1038/s41598-023-32440-8."
  ]
};
