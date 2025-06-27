
import type { Tool, InputConfig, FormSectionConfig } from '../types';
import { ShieldAlert } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const scortenFactors = [
  { key: "age_ge40", label: "Age >40 years" },
  { key: "malignancy_present", label: "Presence of malignancy" },
  { key: "heart_rate_ge120", label: "Heart rate >120/min" },
  { key: "bsa_gt10", label: "Initial percentage of epidermal detachment >10%" },
  { key: "serum_urea_gt10", label: "Serum urea >10 mmol/L" },
  { key: "serum_bicarbonate_lt20", label: "Serum bicarbonate <20 mmol/L" },
  { key: "serum_glucose_gt14", label: "Serum glucose >14 mmol/L" }
];

const scortenFormSections: FormSectionConfig[] = scortenFactors.map(factor => ({
  id: factor.key,
  label: factor.label,
  type: 'checkbox',
  defaultValue: false,
  validation: getValidationSchema('checkbox')
} as InputConfig));


export const scortenTool: Tool = {
  id: "scorten",
  name: "SCORTEN",
  acronym: "SCORTEN",
  description: "A severity-of-illness score to predict mortality in patients with Stevens-Johnson Syndrome (SJS) or Toxic Epidermal Necrolysis (TEN).",
  condition: "SJS/TEN",
  keywords: ["scorten", "sjs", "ten", "stevens-johnson syndrome", "toxic epidermal necrolysis", "prognosis", "mortality", "drug reaction"],
  sourceType: 'Clinical Guideline',
  icon: ShieldAlert,
  rationale: "SCORTEN is a severity-of-illness score developed specifically to predict mortality in patients with Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN). The rationale for its development was the inadequacy of general severity scores (such as the Simplified Acute Physiology Score and burn scores) in this unique patient population, which led to the need for a disease-specific prognostic tool. SCORTEN was derived and validated using logistic regression modeling in a French cohort of SJS/TEN patients, identifying seven independent risk factors for mortality:\n\nAge >40 years\nPresence of malignancy\nHeart rate >120/min\nInitial percentage of epidermal detachment >10%\nSerum urea >10 mmol/L\nSerum glucose >14 mmol/L\nSerum bicarbonate <20 mmol/L\n\nEach risk factor present scores one point, for a total possible score of 0–7. The probability of death increases with the number of risk factors present, and the score is typically calculated within 24 hours of admission, with recalculation on day 3 recommended for improved prognostic accuracy.",
  clinicalPerformance: "SCORTEN has been extensively validated in multiple cohorts and settings. The original validation demonstrated excellent calibration (expected vs. observed mortality: 19.6% vs. 20%) and discrimination (area under the receiver operating characteristic curve [AUC] of 0.82). Subsequent studies and meta-analyses have confirmed its reasonable accuracy, with pooled standardized mortality ratios (SMR) close to 1, indicating good predictive performance. However, SCORTEN tends to overestimate mortality at higher scores, particularly in contemporary cohorts and in patients treated with immunomodulatory therapy. The discriminative power remains acceptable (AUC 0.75–0.83), but calibration may be affected by changes in supportive care and treatment protocols over time. Serial calculation (e.g., on day 3) may improve predictive accuracy. In pediatric populations, SCORTEN predicts morbidity and outcome, with higher scores correlating with longer hospital stays and increased complications, although mortality is rare in children. The tool’s reliability is supported by consistent associations between higher scores and worse outcomes, but interrater reliability and test-retest reliability have not been systematically reported.",
  formSections: scortenFormSections,
  calculationLogic: (inputs) => {
    let score = 0;
    const details: Record<string, string> = {};
    scortenFactors.forEach(factor => {
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

    let mortalityPrediction = ">90%";
    if (score <= 3) mortalityPrediction = mortalityMap[score];
    else if (score === 4) mortalityPrediction = mortalityMap[4];


    const interpretation = `SCORTEN: ${score} (Range: 0-7). Predicted mortality risk (approximate): ${mortalityPrediction}. This score helps estimate prognosis in SJS/TEN.`;
    return { score, interpretation, details };
  },
  references: [
    "Bastuji-Garin S, Fouchard N, Bertocchi M, et al. SCORTEN: A Severity-of-Illness Score for Toxic Epidermal Necrolysis. The Journal of Investigative Dermatology. 2000;115(2):149-53.",
    "Guégan S, Bastuji-Garin S, Poszepczynska-Guigné E, Roujeau JC, Revuz J. Performance of the SCORTEN During the First Five Days of Hospitalization to Predict the Prognosis of Epidermal Necrolysis. The Journal of Investigative Dermatology. 2006;126(2):272-6.",
    "Torres-Navarro I, Briz-Redón Á, Botella-Estrada R. Accuracy of SCORTEN to Predict the Prognosis of Stevens-Johnson Syndrome/Toxic Epidermal Necrolysis: A Systematic Review and Meta-Analysis. Journal of the European Academy of Dermatology and Venereology : JEADV. 2020;34(9):2066-2077.",
    "Sekula P, Liss Y, Davidovici B, et al. Evaluation of SCORTEN on a Cohort of Patients With Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis Included in the RegiSCAR Study. Journal of Burn Care & Research : Official Publication of the American Burn Association. 2011 Mar-Apr;32(2):237-45.",
    "Koh HK, Fook-Chong S, Lee HY. Assessment and Comparison of Performance of ABCD-10 and SCORTEN in Prognostication of Epidermal Necrolysis. JAMA Dermatology. 2020;156(12):1294-1299.",
    "Koh HK, Fook-Chong SMC, Lee HY. Improvement of Mortality Prognostication in Patients With Epidermal Necrolysis: The Role of Novel Inflammatory Markers and Proposed Revision of SCORTEN (Re-SCORTEN). JAMA Dermatology. 2022;158(2):160-166.",
    "Zavala S, O'Mahony M, Joyce C, Baldea AJ. How Does SCORTEN Score?. Journal of Burn Care & Research : Official Publication of the American Burn Association. 2018;39(4):555-561.",
    "Beck A, Quirke KP, Gamelli RL, Mosier MJ. Pediatric Toxic Epidermal Necrolysis: Using SCORTEN and Predictive Models to Predict Morbidity When a Focus on Mortality Is Not Enough. Journal of Burn Care & Research : Official Publication of the American Burn Association. 2015 Jan-Feb;36(1):167-77.",
    "Sorrell J, Anthony L, Rademaker A, et al. Score of Toxic Epidermal Necrosis Predicts the Outcomes of Pediatric Epidermal Necrolysis. Pediatric Dermatology. 2017;34(4):433-437.",
    "Dobry AS, Himed S, Waters M, Kaffenberger BH. Scoring Assessments in Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis. Frontiers in Medicine. 2022;9:883121.",
    "Waters M, Dobry A, Le ST, et al. Development of a Skin-Directed Scoring System for Stevens-Johnson Syndrome and Epidermal Necrolysis: A Delphi Consensus Exercise. JAMA Dermatology. 2023;159(7):772-777.",
    "Archer S, Donoso FS, Carver T, et al. Exploring the Barriers to and Facilitators of Implementing CanRisk in Primary Care: A Qualitative Thematic Framework Analysis. The British Journal of General Practice : The Journal of the Royal College of General Practitioners. 2023;73(733):e586-e596.",
    "Pfaffenlehner M, Behrens M, Zöller D, et al. Methodological Challenges Using Routine Clinical Care Data for Real-World Evidence: A Rapid Review Utilizing a Systematic Literature Search and Focus Group Discussion. BMC Medical Research Methodology. 2025;25(1):8.",
    "Johnson E, Emani VK, Ren J. Breadth of Coverage, Ease of Use, and Quality of Mobile Point-of-Care Tool Information Summaries: An Evaluation. JMIR mHealth and uHealth. 2016;4(4):e117.",
    "Ali GC, Ryan G, De Silva MJ. Validated Screening Tools for Common Mental Disorders in Low and Middle Income Countries: A Systematic Review. PloS One. 2016;11(6):e0156939.",
    "Bull C, Teede H, Watson D, Callander EJ. Selecting and Implementing Patient-Reported Outcome and Experience Measures to Assess Health System Performance. JAMA Health Forum. 2022;3(4):e220326.",
    "Bowden A, Fox-Rushby JA. A Systematic and Critical Review of the Process of Translation and Adaptation of Generic Health-Related Quality of Life Measures in Africa, Asia, Eastern Europe, the Middle East, South America. Social Science & Medicine (1982). 2003;57(7):1289-306.",
    "Peterson AM, Miller B, Ioerger P, et al. Most-Cited Patient-Reported Outcome Measures Within Otolaryngology—Revisiting the Minimal Clinically Important Difference: A Review. JAMA Otolaryngology-- Head & Neck Surgery. 2023;149(3):261-276.",
    "Malec JF, Ketchum JM. A Standard Method for Determining the Minimal Clinically Important Difference for Rehabilitation Measures. Archives of Physical Medicine and Rehabilitation. 2020;101(6):1090-1094.",
    "Angst F, Aeschlimann A, Angst J. The Minimal Clinically Important Difference Raised the Significance of Outcome Effects Above the Statistical Level, With Methodological Implications for Future Studies. Journal of Clinical Epidemiology. 2017;82:128-136.",
    "Jayadevappa R, Cook R, Chhatre S. Minimal Important Difference to Infer Changes in Health-Related Quality Of life-a Systematic Review. Journal of Clinical Epidemiology. 2017;89:188-198."
  ]
};
