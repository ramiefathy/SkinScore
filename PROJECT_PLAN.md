
# SkinScores - Clinical Scoring Tools: Project Plan

## 1. Project Goal

To create a user-friendly, responsive web application for dermatologists and other healthcare professionals to quickly access, use, and understand various clinical scoring tools. A key design principle is ensuring data privacy through client-side calculations, with no patient data transmitted or stored externally unless explicitly designed for such (and with user consent).

## 2. Technology Stack (Implemented)

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **State Management (Client-side):** React Hooks (useState, useMemo, useCallback, useEffect)
*   **Form Handling:** React Hook Form with Zod for validation

## 3. Core Features

### 3.1. Implemented
    *   **Application Shell:** Basic layout (Header, Main Content Area, Footer).
    *   **Tool Discovery:**
        *   Searchable header dropdown for selecting tools.
        *   Category-based dropdown for browsing tools.
        *   Display of recently used tools in the search selector.
    *   **Tool Interaction:**
        *   Dynamic form generation based on individual tool configurations (`formSections`).
        *   Support for simple input types (number, select, checkbox, radio, text).
        *   Support for grouped inputs (`InputGroupConfig`) for better visual organization within forms (e.g., PASI, mSWAT).
        *   Client-side calculation logic for each tool.
        *   Display of calculation results, including score, interpretation, and detailed breakdown.
        *   Static display of assessment levels for classification-type tools (e.g., IGA scores, Fitzpatrick Skin Type) instead of an interactive form.
    *   **Data Management & Structure:**
        *   Modular tool data structure: each tool defined in its own file under `src/lib/tools/`, aggregated in `src/lib/tools/index.ts`.
        *   Shared validation logic and constants in `src/lib/toolValidation.ts`.
        *   Typed configurations for tools, inputs, and results (`src/lib/types.ts`).
    *   **User Experience:**
        *   Responsive design for basic usability on different screen sizes.
        *   Clipboard copy functionality for results.
        *   Toast notifications for actions like copying results.
        *   Focus on UI alignment and consistency (ongoing).
    *   **Persistence:**
        *   Recently used tools saved to `localStorage`.

### 3.2. Needs Adjustment / Refinement
    *   **UI/UX Consistency:**
        *   **Form Alignment:** Continue refining alignment for all form elements, especially in complex grid layouts and when descriptions are present/absent, to ensure a consistently polished look. (Partially addressed for `FormDescription`, but ongoing review needed).
        *   **Visual Hierarchy:** Review spacing, font sizes, and visual weight across components (`ToolInfo`, `ToolForm`, `ResultsDisplay`) to ensure a clear and intuitive user flow.
        *   **Responsiveness:** More thorough testing and refinement for various screen sizes, especially for complex forms.
    *   **Error Handling & Validation:**
        *   Ensure Zod validation messages are consistently user-friendly and clearly displayed.
        *   Improve visual feedback for input validation errors directly on the form fields beyond the default `FormMessage`.
    *   **Tool Definition Robustness:**
        *   **`staticList` in `ToolInfo.tsx`**: Ensure the rendering logic for `staticList` tools is robust enough to handle potential variations in how options might be structured within `formSections` (e.g., if a tool had multiple `InputConfig` items contributing to its static display).
        *   **Complex Tool Results (`ResultsDisplay.tsx`):** Continuously verify that the display of detailed, nested results for tools like mSWAT is clear, accurate, and handles all data structures gracefully. (Multi-level nesting addressed, but good to monitor).
    *   **Code Quality & Maintainability:**
        *   Review large components for potential further breakdown if complexity increases.
        *   Add comments where logic is complex or non-obvious.

### 3.3. Future Features / Enhancements (To Be Implemented / Considered)
    *   **Expanded Tool Library:**
        *   Continuously add more relevant dermatological scoring tools.
        *   Consider tools for related sub-specialties if there's a user need.
    *   **User Accounts/Profiles (Optional - Strong Privacy Considerations):**
        *   Save "favorite" tools.
        *   Anonymized calculation history (if privacy can be rigorously guaranteed or data stored locally with explicit user consent and management tools). This is a significant feature requiring careful design.
    *   **Enhanced Results Visualization:**
        *   For tools where it makes sense (e.g., tracking scores over time if history is implemented), consider simple charts (using ShadCN/Recharts).
    *   **Offline Capabilities (Progressive Web App - PWA):**
        *   Enable core functionality (tool selection, calculation) without an internet connection after the initial load.
    *   **Internationalization (i18n):**
        *   Support for multiple languages in UI and tool content.
    *   **Accessibility (A11y) Audit & Improvements:**
        *   Conduct a thorough accessibility review (WCAG compliance) and implement necessary improvements.
    *   **Printable/Exportable Reports:**
        *   Option to generate a clean, printable summary of a calculation result.
    *   **Tool Information Enhancements:**
        *   Ability to embed diagrams or images within `ToolInfo.tsx` for tools where visual aids are beneficial (e.g., Rule of Nines illustrations for SCORAD, visual guides for mFG score).
        *   More detailed "How to Use" or "Scoring Guide" sections within the app for complex tools.
    *   **Advanced Search/Filtering:**
        *   Beyond current name/keyword search, allow filtering by condition, body part, etc.
    *   **Settings/Preferences Panel:**
        *   User-configurable display options (e.g., theme preferences beyond system default if desired, default units if applicable).
    *   **Testing:**
        *   Implement unit tests for calculation logic.
        *   Implement integration/E2E tests for key user flows.
    *   **Genkit AI Integration (Placeholder - If Future Interest):**
        *   _This was not an initial project requirement but is a common modern app feature to consider long-term if desired._
        *   Potential for AI-assisted tool suggestion based on inputted symptoms/signs.
        *   AI-powered summarization of reference materials for tools.

## 4. Key Considerations

*   **Data Privacy:** The core principle of local, client-side calculation must be maintained. Any feature that might involve data storage or transmission needs extremely careful consideration of privacy and security.
*   **Usability:** The application must be intuitive and efficient for busy healthcare professionals.
*   **Accuracy:** Calculation logic for all tools must be meticulously validated against source materials.
*   **Maintainability:** The codebase, especially tool definitions, should remain easy to update and expand.

## 5. Development Process Notes
*   This plan will be updated iteratively.
*   A `CHANGELOG.md` will track notable changes.
*   A `USER_PREFERENCES.md` will track specific user requests and observed preferences for project direction.
