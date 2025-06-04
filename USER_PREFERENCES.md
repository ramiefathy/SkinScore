
# User Project Preferences for SkinScore App

This document tracks observed and confirmed user preferences to guide the development of the SkinScore application.

## 1. General Development Philosophy
*   **Modularity:** Strong preference for modular code organization. This facilitates easier management, editing, and understanding of the codebase (e.g., the refactor of `toolData.ts` into individual tool files under `src/lib/tools/`).
*   **Clarity and User Experience (UX):** High priority on clear visual distinction of UI elements, logical information flow, and an intuitive experience for the end-user (typically healthcare professionals).
*   **Iterative Improvement:** Willingness to "take a step back" for overarching planning and to iteratively refine features and the user interface.
*   **Systematic Tracking:** Values and requests systematic tracking of project changes (`CHANGELOG.md`) and a high-level project plan (`PROJECT_PLAN.md`).

## 2. Specific UI/UX Preferences
*   **Form Design:**
    *   **Alignment:** Emphasis on consistent horizontal and vertical alignment of form elements and UI components for a clean, professional appearance. Misalignments, even minor, should be addressed.
    *   **Visual Grouping:** For tools with sub-sections (e.g., different body parts in PASI or mSWAT), these sub-sections should be clearly delineated visually (e.g., using borders, titles, distinct layout).
    *   **Tool-Appropriate Interaction:**
        *   For tools that are direct classifications (e.g., IGA scores, Fitzpatrick Skin Type), prefer static display of the levels/options with their descriptions rather than interactive form elements (like a single dropdown).
        *   For tools involving calculations from multiple inputs (e.g., mSWAT, PASI), the application should handle all internal calculations (summing, multiplication by factors) based on detailed user inputs for each component, rather than requiring users to pre-calculate values or input only a final score.
*   **Data Display:**
    *   **Detailed Results:** For tools with complex calculations or nested data structures (like mSWAT's regional inputs), the results display should clearly present all levels of detail, not just a summary or `[object Object]`.

## 3. Communication & Workflow
*   **Contradictory Requests:** Requests to be notified if a new development request seems to contradict these established preferences, allowing for confirmation or adjustment.
*   **Preference Updates:** New inferred preferences should be confirmed with the user before being formally added to this document. This document should be updated when new explicit preferences are stated.

## 4. Error Handling & Debugging
*   User actively provides error messages and stack traces from Next.js for debugging.
*   Expects fixes to address the root cause of reported errors.

*(This file will be updated as new preferences are observed or explicitly stated.)*
