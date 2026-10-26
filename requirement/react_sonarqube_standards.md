# AI Coding Assistant Instructions: React.js Standards (SonarQube Based)

**Context:** 
When generating, modifying, or reviewing code in this project, strictly adhere to the following security, coding, and unit testing standards based on SonarQube rules and React best practices. 

---

## 1. Security Rules (Vulnerabilities & Hotspots)

*   **No Cross-Site Scripting (XSS) (SonarQube S3739, S5131):**
    *   **NEVER** use `dangerouslySetInnerHTML` unless absolutely necessary, and only if the input has been strictly sanitized using a library like `DOMPurify`.
    *   Avoid dynamic string interpolation in `href` attributes (e.g., `<a href={userInput}>`) without validating the URL scheme (prevent `javascript:` execution).
*   **Safe API and Data Handling (SonarQube S5334, S2068):**
    *   **NEVER** hardcode credentials, API keys, tokens, or secrets in the source code.
    *   Do not log sensitive data (PII, passwords, tokens) to the console.
*   **Prevent Injection and Evaluation (SonarQube S1523):**
    *   **NEVER** use `eval()`, `setTimeout` with string arguments, or `new Function()`.
*   **Secure Component Configuration:**
    *   Always add `rel="noopener noreferrer"` when using `target="_blank"` on anchor tags.
    *   If using `<iframe>`, strictly configure the `sandbox` attribute.

---

## 2. React Coding Standards & Code Smells

*   **Rules of Hooks (SonarQube S6596, S6598):**
    *   Only call Hooks at the top level of the component. Never call them inside loops, conditions, or nested functions.
    *   Include all state and props used inside a hook in the dependency array (e.g., `useEffect`, `useCallback`). 
*   **Component Architecture (SonarQube S6477):**
    *   Use functional components with Hooks over class components.
    *   Name components using **PascalCase**. Name hooks starting with `use` and **camelCase**.
*   **State & Props Management (SonarQube S6480, S6481):**
    *   **NEVER** mutate state directly. Always use the setter function provided by `useState` or `useReducer`.
    *   Do not spread unknown/unvalidated props directly to DOM elements (e.g., `<div {...props} />` where `props` contains non-HTML attributes).
*   **List Rendering & Keys (SonarQube S6486):**
    *   Always provide a unique, stable `key` prop when iterating over arrays (e.g., `map()`).
    *   **AVOID** using the array index as a `key` if the list can be reordered, filtered, or modified.
*   **Performance Optimization:**
    *   Avoid defining complex objects or inline functions directly in the JSX render path if it causes unnecessary re-renders of child components. Wrap them in `useMemo` or `useCallback` when passing to memoized children.
    *   Keep components small and focused (Single Responsibility Principle).
*   **General JavaScript/TypeScript Strictness:**
    *   Always use strict equality `===` and `!==` instead of `==` and `!=` (SonarQube S1215).
    *   Remove all unused variables, imports, and parameters (SonarQube S1128, S1172).
    *   Avoid nested ternary operators. Extract to helper functions or use early returns (SonarQube S3358).
    *   **Cognitive Complexity:** Keep function cognitive complexity below 15 (SonarQube S3776). Refactor large `useEffect` blocks or giant render functions into smaller helper functions/components.

---

## 3. Unit Testing Standards (Jest & React Testing Library)

*   **Test Assertions (SonarQube S2699):**
    *   Every unit test block (`it` or `test`) **MUST** contain at least one assertion (e.g., `expect(...)`). Tests without assertions are invalid.
*   **Behavioral Testing over Implementation:**
    *   Test what the component *does* from a user's perspective, not how it is implemented.
    *   Prefer querying by accessibility roles (`getByRole`, `findByRole`, `getByText`) over `getByTestId` unless no other semantic option exists.
*   **Asynchronous Testing:**
    *   Use `findBy...` or `waitFor` for elements that appear asynchronously. 
    *   Ensure all async operations are wrapped in `act()` (React Testing Library usually handles this, but be mindful during state updates in tests).
*   **Mocking Rules:**
    *   Mock all external dependencies, network requests (use MSW or mock fetch/axios), and complex third-party libraries to isolate the component being tested.
    *   Do not mock the component you are actively testing.
*   **Coverage & Clean Code:**
    *   Aim for a minimum of 80% coverage across lines, branches, and functions.
    *   Do not leave commented-out tests, `.skip`, or `.only` in the committed code (SonarQube S125, S1604).
    *   Ensure tests clean up after themselves (e.g., `jest.clearAllMocks()` in `afterEach`).

---

## AI Execution Directive
When prompted to write or refactor code:
1. Scan the prompt against these rules.
2. If the requested code violates any of these security or architectural rules, automatically correct it to align with this document.
3. Ensure all generated components include corresponding unit tests adhering to Section 3.
4. Keep complexity low and explicitly state if a requested feature risks exceeding SonarQube complexity thresholds.