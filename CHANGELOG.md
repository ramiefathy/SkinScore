
# Changelog

All notable changes to this SkinScore project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning (though not formally versioned in this context yet).

## [UNRELEASED]

### Added
- **IIM Classification and Severity Tools (2024-06-02):**
    - Implemented the **Revised Classification System for Idiopathic Inflammatory Myopathies (IIMs) – Sontheimer 2002 (iim_sontheimer2002)** to classify IIM subtypes including Classic DM, Amyopathic DM, Hypomyopathic DM, Overlap Myositis, and Polymyositis.
    - Implemented the **Dermatomyositis Skin Severity Index (DSSI)** for quantifying skin severity in DM.
    - Implemented the **Sarcoidosis Activity and Severity Index (SASI)** for assessing cutaneous sarcoidosis severity, specifically facial involvement.
- **Pyoderma Gangrenosum Diagnostic Tools (2024-06-02):**
    - Implemented the **Delphi Consensus Criteria for Ulcerative Pyoderma Gangrenosum (pg_delphi)** based on Maverakis E et al., 2018.
    - Implemented the **PARACELSUS Score for Pyoderma Gangrenosum (pg_paracelsus)** based on Jockenhöfer F et al., 2019.
    - Implemented the **Su Criteria for Pyoderma Gangrenosum (pg_su)** based on Su WP et al., 2004.
- **Additional Scoring Tools (2024-06-02):**
    - Added **PEST (Psoriasis Epidemiology Screening Tool)** for psoriatic arthritis screening.
    - Added **ABSIS (Autoimmune Bullous Skin Disorder Intensity Score)** for pemphigus severity.
    - Added **BPDAI (Bullous Pemphigoid Disease Area Index)** for bullous pemphigoid activity.
    - Added **PUSH Tool (Pressure Ulcer Scale for Healing)** for pressure ulcer monitoring.
    - Added **CLASI (Cutaneous Lupus Erythematosus Disease Area and Severity Index)** for cutaneous lupus.
    - Added **CDASI (Cutaneous Dermatomyositis Disease Area and Severity Index)** for dermatomyositis.
    - Added **BWAT (Bates-Jensen Wound Assessment Tool)** for chronic wound assessment.

### Changed
- **Tool Categorization (2024-06-02):**
    - Grouped PEST, PASI, NAPSI, PGA Psoriasis, and PSSI tools under the condition "Psoriasis / Psoriatic Arthritis".
    - Grouped SCORAD, EASI, SASSAD, vIGA-AD, HECSI, and DASI tools under the condition "Atopic Dermatitis / Eczema".

### Fixed
- **Module Resolution Errors (2024-06-02):**
    - Systematically addressed "Module not found" errors for `pest.ts`, `absis.ts`, `bpdai.ts`, `push.ts`, `clasi.ts`, `cdasi.ts`, and `bwat.ts` by ensuring correct file creation and/or re-registration in `src/lib/tools/index.ts`.

### Added
- **Project Management Files (2024-06-02):**
    - Initial `PROJECT_PLAN.md` to outline goals, implemented features, and future roadmap.
    - This `CHANGELOG.md` file to track development progress.
    - `USER_PREFERENCES.md` to document user-specific guidelines and preferences for the project.
