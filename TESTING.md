# Testing Overview

This application emphasizes rigorous functional and regression testing to ensure high reliability across all core user workflows. Due to the lightweight nature of the application (Vanilla JavaScript, no build step), testing is divided into **Automated Console Validation** and **Manual Testing Workflows**.

## Test Coverage Strategy

### 1. Automated Logic Validation (`tests.js`)
We utilize a custom, lightweight testing script (`tests.js`) that automatically executes upon application load. It asserts core logic:
- **ID Generation:** Validates that `generateId()` produces unique, alphanumeric strings.
- **Sanitization:** Validates that `escapeHTML()` correctly neutralizes script injection attempts to prevent XSS vulnerabilities.

### 2. UI & Interaction Coverage (Manual)
The `MANUAL_TESTING.md` document provides full coverage for UI interactions that are difficult to reliably mock in a vanilla environment, including:
- **Drag-and-Drop Constraints:** Ensuring tasks correctly map to column status changes.
- **State Hydration:** Verifying `localStorage` read/write parity across browser refreshes.
- **Dynamic DOM Rendering:** Confirming search filtering and progress percentage calculations update the DOM without memory leaks.

## Expected Results
- Zero console errors during standard operation.
- The automated `tests.js` script should output `[PASS]` for all assertions in the browser console.
- Malicious inputs must render strictly as plaintext.
- The Google Cloud Run deployment must serve a 200 OK status on the `/health.html` endpoint.
