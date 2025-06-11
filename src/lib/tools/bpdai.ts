
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react';
import { getValidationSchema } from '../toolValidation';

const bpdaiBodyRegions = [
  { id: 'hn', name: 'Head/Neck' },
  { id: 'tr', name: 'Trunk' },
  { id: 'ul', name: 'Upper Limbs' },
  { id: 'll', name: 'Lower Limbs' },
];

const bpdaiLesionCountOptions: InputOption[] = [
  { value: 0, label: "0 (No lesions)" },
  { value: 1, label: "1 (1-3 lesions)" },
  { value: 2, label: "2 (4-10 lesions)" },
  { value: 3, label: "3 (>10 lesions)" },
];

const bpdaiBSAOptions: InputOption[] = [
  { value: 0, label: "0 (0%)" },
  { value: 1, label: "1 (<10%)" },
  { value: 2, label: "2 (10-30%)" },
  { value: 3, label: "3 (>30%)" },
];

const bpdaiMucosalSiteOptions: InputOption[] = [
  { id: 'oral', name: 'Oral' },
  { id: 'ocular', name: 'Ocular' },
  { id: 'nasal', name: 'Nasal' },
  { id: 'genital_anal', name: 'Genital/Anal' },
];

const bpdaiFormSections: FormSectionConfig[] = [
  {
    id: 'bpdai_skin_blisters_group',
    title: 'Skin Activity - Blisters/Erosions (Max Score: 24)',
    description: 'Assess number of lesions and BSA % involvement for each region.',
    gridCols: 2,
    inputs: bpdaiBodyRegions.flatMap(region => [
      {
        id: `blisters_num_${region.id}`,
        label: `${region.name} - Lesion Count`,
        type: 'select',
        options: bpdaiLesionCountOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', bpdaiLesionCountOptions, 0, 3)
      } as InputConfig,
      {
        id: `blisters_bsa_${region.id}`,
        label: `${region.name} - BSA %`,
        type: 'select',
        options: bpdaiBSAOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', bpdaiBSAOptions, 0, 3)
      } as InputConfig,
    ])
  },
  {
    id: 'bpdai_skin_urticaria_group',
    title: 'Skin Activity - Urticarial Plaques/Erythema (Max Score: 24)',
    description: 'Assess number of lesions and BSA % involvement for each region.',
    gridCols: 2,
    inputs: bpdaiBodyRegions.flatMap(region => [
      {
        id: `urticaria_num_${region.id}`,
        label: `${region.name} - Lesion Count`,
        type: 'select',
        options: bpdaiLesionCountOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', bpdaiLesionCountOptions, 0, 3)
      } as InputConfig,
      {
        id: `urticaria_bsa_${region.id}`,
        label: `${region.name} - BSA %`,
        type: 'select',
        options: bpdaiBSAOptions,
        defaultValue: 0,
        validation: getValidationSchema('select', bpdaiBSAOptions, 0, 3)
      } as InputConfig,
    ])
  },
  {
    id: 'bpdai_mucosal_group',
    title: 'Mucosal Involvement (Max Score: 4)',
    description: 'Check all affected mucosal sites (1 point per site).',
    gridCols: 2,
    inputs: bpdaiMucosalSiteOptions.map(site => ({
      id: `mucosal_${site.id}`,
      label: site.name,
      type: 'checkbox',
      defaultValue: false,
      validation: getValidationSchema('checkbox')
    } as InputConfig))
  },
  {
    id: 'bpdai_pruritus_group',
    title: 'Pruritus (Max Score: 10)',
    gridCols: 1,
    inputs: [
      {
        id: 'pruritus_vas',
        label: 'Pruritus VAS (0-10 cm)',
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 0,
        validation: getValidationSchema('number', [], 0, 10),
        description: 'Patient rates average itch intensity over past 24h (0=no itch, 10=worst imaginable itch).'
      }
    ]
  }
];

export const bpdaiTool: Tool = {
  id: "bpdai",
  name: "Bullous Pemphigoid Disease Area Index",
  acronym: "BPDAI",
  description: "BPDAI quantifies disease severity in bullous pemphigoid (BP) by assessing skin lesions (blisters/erosions and urticarial plaques/erythema across 4 body regions), mucosal involvement (4 sites), and pruritus. The total score ranges from 0-62. It has high interobserver reliability and correlates well with anti-BP180 titers and physician global assessment.",
  condition: "Bullous Pemphigoid",
  keywords: ["bpdai", "bullous pemphigoid", "lesion scoring", "mucosal involvement", "urticaria", "erythema", "blister", "activity index", "pruritus"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: bpdaiFormSections,
  calculationLogic: (inputs) => {
    let skinBlistersScore = 0;
    let skinUrticariaScore = 0;
    let mucosalScore = 0;
    const details: Record<string, any> = { Skin_Blisters_Erosions: {}, Skin_Urticarial_Erythema: {}, Mucosal_Involvement: {} };

    bpdaiBodyRegions.forEach(region => {
      const blisterNum = Number(inputs[`blisters_num_${region.id}`]) || 0;
      const blisterBSA = Number(inputs[`blisters_bsa_${region.id}`]) || 0;
      skinBlistersScore += blisterNum + blisterBSA;
      details.Skin_Blisters_Erosions[region.name] = { count_score: blisterNum, bsa_score: blisterBSA, total: blisterNum + blisterBSA };

      const urticariaNum = Number(inputs[`urticaria_num_${region.id}`]) || 0;
      const urticariaBSA = Number(inputs[`urticaria_bsa_${region.id}`]) || 0;
      skinUrticariaScore += urticariaNum + urticariaBSA;
      details.Skin_Urticarial_Erythema[region.name] = { count_score: urticariaNum, bsa_score: urticariaBSA, total: urticariaNum + urticariaBSA };
    });

    bpdaiMucosalSiteOptions.forEach(site => {
      if (inputs[`mucosal_${site.id}`]) {
        mucosalScore += 1;
        details.Mucosal_Involvement[site.name] = 1;
      } else {
        details.Mucosal_Involvement[site.name] = 0;
      }
    });

    const pruritusScore = parseFloat(Number(inputs.pruritus_vas).toFixed(1)) || 0;

    const totalActivityScore = skinBlistersScore + skinUrticariaScore + mucosalScore + pruritusScore;

    let severityCategory = "Undefined";
    // Using cutoffs from Masmoudi W, et al. Br J Dermatol. 2020 for the 0-62 BPDAI
    if (totalActivityScore <= 11) severityCategory = "Mild BP";
    else if (totalActivityScore <= 32) severityCategory = "Moderate BP";
    else severityCategory = "Severe BP";
    if (totalActivityScore === 0) severityCategory = "No activity/Remission";


    const interpretation = `Total BPDAI Score: ${totalActivityScore.toFixed(1)} (Range: 0-62).
Severity (Masmoudi et al. 2020): ${severityCategory}.
(Bands: 0-11 Mild; 12-32 Moderate; ≥33 Severe).
Subscores: Skin Blisters/Erosions: ${skinBlistersScore}, Skin Urticarial/Erythema: ${skinUrticariaScore}, Mucosal: ${mucosalScore}, Pruritus VAS: ${pruritusScore.toFixed(1)}.`;

    return {
      score: parseFloat(totalActivityScore.toFixed(1)),
      interpretation,
      details: {
        ...details,
        Skin_Blisters_Erosions_Subtotal: skinBlistersScore,
        Skin_Urticarial_Erythema_Subtotal: skinUrticariaScore,
        Mucosal_Involvement_Subtotal: mucosalScore,
        Pruritus_VAS_Score: pruritusScore,
        Total_BPDAI_Activity_Score: parseFloat(totalActivityScore.toFixed(1)),
        Severity_Category_Masmoudi2020: severityCategory,
      }
    };
  },
  references: [
    "Murrell DF, Daniel BS, Joly P, et al. Definitions and outcome measures for bullous pemphigoid: recommendations by an international group of experts. J Am Acad Dermatol. 2012 Mar;66(3):479-85.",
    "Murrell DF, et al. Validation of the Bullous Pemphigoid Disease Area Index. J Am Acad Dermatol. 2012;66(4):617–624.e1.",
    "Masmoudi W, et al. International validation of BPDAI and calculation of cut-off values defining mild, moderate, and severe BP. Br J Dermatol. 2020;183(2):426–433."
  ]
};

    