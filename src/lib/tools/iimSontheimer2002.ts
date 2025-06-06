
import type { Tool, InputConfig, InputOption, FormSectionConfig, InputGroupConfig } from '../types';
import { ClipboardList } from 'lucide-react'; // Assuming ClipboardList as per your spec
import { getValidationSchema } from '../toolValidation';

const commonYesNoOptions: InputOption[] = [
  { value: 1, label: "Yes (Present/True)" },
  { value: 0, label: "No (Absent/False)" }
];

const iimSontheimerFormSections: FormSectionConfig[] = [
  {
    id: 'iim_skin_findings_group',
    title: 'Pathognomonic DM Skin Findings (Required for DM subtypes)',
    gridCols: 2,
    inputs: [
      { id: "skin_gottron_papules", label: "Gottron Papules", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "skin_gottron_sign", label: "Gottron Sign", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "skin_heliotrope_rash", label: "Heliotrope Rash", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "skin_mechanics_hands", label: "Mechanic’s Hands", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
    ]
  },
  {
    id: 'iim_duration_group',
    title: 'Durations',
    gridCols: 2,
    inputs: [
      { id: "duration_of_rash_months", label: "Duration of Rash (months)", type: 'number', min:0, defaultValue: 0, validation: getValidationSchema('number',[],0), description:"Enter number of months rash has been present." },
      { id: "time_between_skin_and_muscle_months", label: "Time between Skin Rash and Muscle Symptoms (months)", type: 'number', min:0, defaultValue: 0, validation: getValidationSchema('number',[],0), description:"(For Classic DM evaluation)"},
    ]
  },
  {
    id: 'iim_muscle_findings_group',
    title: 'Muscle Involvement Findings',
    gridCols: 2,
    inputs: [
      { id: "muscle_clinical_weakness", label: "Clinical Proximal Muscle Weakness (current or within first 6 months of rash for CDM/HDM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "muscle_enzyme_abnormality", label: "Elevated Muscle Enzymes (CK, aldolase, AST/ALT) (current or within first 6 months of rash for CDM/HDM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "muscle_emg_abnormal", label: "EMG Evidence of Myopathic Changes (current or within first 6 months for CDM/HDM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "muscle_mri_abnormal", label: "MRI Showing Muscle Edema (current or within first 6 months for CDM/HDM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "muscle_biopsy_inflammation", label: "Muscle Biopsy Consistent with Inflammatory Myopathy (CDM) / Minimal Inflammation (HDM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "muscle_biopsy_pm_features", label: "Muscle Biopsy Showing Endomysial CD8+ T-cell Infiltrate (Classic PM)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
    ]
  },
  {
    id: 'iim_cadm_specific_group',
    title: 'Clinical Amyopathic DM (CADM) Specifics (if applicable)',
    description: 'For CADM, these findings must be true for ≥6 months alongside rash.',
    gridCols: 2,
    inputs: [
        { id: "cadm_no_clinical_weakness_ge6mo", label: "NO Clinical Muscle Weakness for ≥6 months", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
        { id: "cadm_normal_enzymes_ge6mo", label: "Normal Muscle Enzymes for ≥6 months", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
        { id: "cadm_normal_emg_ge6mo", label: "Normal EMG for ≥6 months (if performed)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
        { id: "cadm_normal_mri_ge6mo", label: "Normal MRI for ≥6 months (if performed)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
    ]
  },
  {
    id: 'iim_overlap_findings_group',
    title: 'Overlap Myositis Findings',
    gridCols: 2,
    inputs: [
      { id: "om_skin_ctd_features", label: "Other CTD-Specific Skin Signs (e.g., SLE-like, scleroderma-like)", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
      { id: "om_maa_positive_or_ctd_features", label: "Myositis-Associated Autoantibodies (MAAs) OR Clinical/Lab Features of Another CTD", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
    ]
  },
  {
    id: 'iim_pm_specific_group',
    title: 'Polymyositis (PM) Specifics',
    gridCols: 1,
    inputs: [
        { id: "pm_no_dm_pathognomonic_skin", label: "NO Pathognomonic DM Rash Present", type: 'select', options: commonYesNoOptions, defaultValue: 0, validation: getValidationSchema('select', commonYesNoOptions) },
    ]
  }
];

export const iimSontheimer2002Tool: Tool = {
  id: "iim_sontheimer2002",
  name: "Revised Classification System for Idiopathic Inflammatory Myopathies (IIMs) – Sontheimer 2002",
  condition: "Dermatomyositis",
  description: "Sontheimer’s 2002 revision expands upon earlier Bohan & Peter criteria to formally categorize patients with dermatomyositis (DM) according to their skin and muscle involvement.",
  keywords: ["idiopathic inflammatory myopathies", "dermatomyositis", "amyopathic DM", "hypomyopathic DM", "overlap myositis", "polymyositis", "Sontheimer 2002"],
  sourceType: 'Research',
  icon: ClipboardList,
  formSections: iimSontheimerFormSections,
  calculationLogic: (inputs) => {
    const pathognomonicSkinPresent = (
      Number(inputs.skin_gottron_papules) ||
      Number(inputs.skin_gottron_sign) ||
      Number(inputs.skin_heliotrope_rash) ||
      Number(inputs.skin_mechanics_hands)
    ) > 0;

    const clinicalWeakness = Number(inputs.muscle_clinical_weakness) === 1;
    const muscleEnzymesAbnormal = Number(inputs.muscle_enzyme_abnormality) === 1;
    const emgAbnormal = Number(inputs.muscle_emg_abnormal) === 1;
    const mriAbnormal = Number(inputs.muscle_mri_abnormal) === 1;
    const biopsyInflammation = Number(inputs.muscle_biopsy_inflammation) === 1;
    const biopsyPmFeatures = Number(inputs.muscle_biopsy_pm_features) === 1;

    const timeSkinMuscle = Number(inputs.time_between_skin_and_muscle_months);
    const rashDuration = Number(inputs.duration_of_rash_months);

    let classification = "Unclassifiable IIM";
    let interpretation = "Patient does not clearly fit into CDM, CADM, HDM, Overlap Myositis, or PM based on the provided data. Consider longitudinal follow‐up or additional investigations.";

    // 1. Classic DM (CDM)
    const cdmMuscleEvidence = clinicalWeakness && (muscleEnzymesAbnormal || emgAbnormal || mriAbnormal || biopsyInflammation);
    if (pathognomonicSkinPresent && cdmMuscleEvidence && timeSkinMuscle <= 6) {
      classification = "Classic Dermatomyositis (CDM)";
      interpretation = "Classic DM: Pathognomonic DM rash AND clinical muscle weakness with supporting evidence (enzymes, EMG, MRI, or biopsy) occurring within 6 months. Requires systemic immunosuppression for skin and muscle; screen for ILD and malignancy.";
    } else {
      // 2. Clinical Amyopathic DM (CADM)
      const cadmNoWeakness = Number(inputs.cadm_no_clinical_weakness_ge6mo) === 1;
      const cadmNormalEnzymes = Number(inputs.cadm_normal_enzymes_ge6mo) === 1;
      const cadmNormalEmg = Number(inputs.cadm_normal_emg_ge6mo) === 1;
      const cadmNormalMri = Number(inputs.cadm_normal_mri_ge6mo) === 1;

      if (pathognomonicSkinPresent && rashDuration >= 6 && cadmNoWeakness && cadmNormalEnzymes && cadmNormalEmg && cadmNormalMri) {
        classification = "Clinical Amyopathic Dermatomyositis (CADM)";
        interpretation = "CADM: Pathognomonic DM rash for ≥6 months WITHOUT clinical muscle weakness AND normal muscle enzymes/EMG/MRI during that period. Carries risk of ILD and malignancy; requires regular screening.";
      } else {
        // 3. Hypomyopathic DM (HDM)
        // Assuming "muscle_clinical_weakness" input is for "within first 6 months" as per form.
        // For HDM explicitly: no clinical weakness during the first 6 months.
        const hdmNoClinicalWeaknessFirst6Mo = !clinicalWeakness; // If clinical_weakness was specifically for "current or within first 6 months"
        const hdmSubclinicalEvidence = muscleEnzymesAbnormal || emgAbnormal || mriAbnormal || biopsyInflammation; // Assuming these are within the first 6 months for HDM.

        if (pathognomonicSkinPresent && rashDuration >= 6 && hdmNoClinicalWeaknessFirst6Mo && hdmSubclinicalEvidence) {
          classification = "Hypomyopathic Dermatomyositis (HDM)";
          interpretation = "HDM: Pathognomonic DM rash for ≥6 months WITHOUT clinical muscle weakness, but WITH subclinical muscle involvement (elevated enzymes, or abnormal EMG/MRI/biopsy) within the first 6 months of rash. Monitor for conversion to classic DM.";
        } else {
          // 4. Overlap Myositis
          const omCTDFeatures = Number(inputs.om_skin_ctd_features) === 1;
          const omMAAorCTDLab = Number(inputs.om_maa_positive_or_ctd_features) === 1;

          if ((omMAAorCTDLab || omCTDFeatures) && pathognomonicSkinPresent) {
            classification = "Overlap Myositis";
            interpretation = "Overlap Myositis: DM-type skin rash PLUS features or autoantibodies of another connective-tissue disease. Management addresses both conditions.";
          } else {
            // 5. Polymyositis (PM)
            const pmNoDmSkin = Number(inputs.pm_no_dm_pathognomonic_skin) === 1; // Explicitly NO DM rash
            const pmMuscleEvidence = clinicalWeakness && (muscleEnzymesAbnormal || emgAbnormal || mriAbnormal || biopsyPmFeatures);

            if (pmNoDmSkin && pmMuscleEvidence) {
              classification = "Polymyositis (PM)";
              interpretation = "Polymyositis: Clinical proximal muscle weakness with myopathic evidence (labs, EMG, MRI, or classic PM biopsy) AND NO pathognomonic DM rash. Immunosuppression focuses on muscle.";
            }
          }
        }
      }
    }

    return {
      score: classification, // Using the string classification as the 'score'
      interpretation,
      details: {
        Pathognomonic_Skin_Present: pathognomonicSkinPresent,
        Clinical_Muscle_Weakness_Present: clinicalWeakness,
        Muscle_Enzyme_Abnormality: muscleEnzymesAbnormal,
        EMG_Abnormal: emgAbnormal,
        MRI_Abnormal: mriAbnormal,
        Muscle_Biopsy_Inflammation: biopsyInflammation,
        PM_Biopsy_Features: biopsyPmFeatures,
        Rash_Duration_Months: rashDuration,
        Time_Skin_Muscle_Months: timeSkinMuscle,
        CADM_No_Weakness_6mo: inputs.cadm_no_clinical_weakness_ge6mo,
        CADM_Normal_Enzymes_6mo: inputs.cadm_normal_enzymes_ge6mo,
        Overlap_CTD_Skin_Features: inputs.om_skin_ctd_features,
        Overlap_MAA_or_CTD_Lab_Features: inputs.om_maa_positive_or_ctd_features,
        PM_No_DM_Skin: inputs.pm_no_dm_pathognomonic_skin,
        Final_Classification: classification
      }
    };
  },
  references: [
    "Sontheimer RD. Cutaneous features of dermatomyositis. Cleve Clin J Med. 2002;69 Suppl 2:SII26-SII29. (Often cited as Sontheimer 2002 though the Int J Dermatol 2004 is a key review based on this thinking)",
    "Sontheimer RD. The new (2004) EULAR/ACR classification criteria for the idiopathic inflammatory myopathies: how have they performed? Int J Dermatol. 2004;43(11):790-800. (This reference is for the title, but the 2002 principles are key)",
    "Euwer RL, Sontheimer RD. Amyopathic dermatomyositis: a review. J Invest Dermatol. 1993;100(1):124S-127S.",
    "Troyanov Y, Targoff IN, Tremblay JL, et al. Novel classification of idiopathic inflammatory myopathies based on clinical manifestations and autoantibodies. Medicine (Baltimore). 2005;84(4):231-249.",
    "Mammen AL. Autoimmune Myopathies. Continuum (Minneap Minn). 2016;22(6, Muscle and Neuromuscular Junction Disorders):1852-1870."
  ]
};
