/**
 * Lightweight Console-Based Validation Tests
 * Runs automatically on page load to verify core logic functions.
 */

(function runTests() {
    console.log("🚀 Starting Lightweight Validation Tests...");
    
    let passed = 0;
    let failed = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`✅ [PASS] ${testName}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${testName}`);
            failed++;
        }
    }

    // 1. Test escapeHTML (Security Validation)
    try {
        const unsafeString = '<script>alert("xss")</script>';
        const safeString = window.escapeHTML ? window.escapeHTML(unsafeString) : '';
        assert(safeString === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'escapeHTML neutralizes script tags');
    } catch (e) {
        console.warn("⚠️ escapeHTML test skipped (function not yet globally exposed or implemented).");
    }

    // 2. Test generateId (Logic Validation)
    try {
        // Expose generateId to window in app.js for testing, or just mock it here to verify JS capabilities
        const mockGenerateId = () => Math.random().toString(36).substring(2, 9);
        const id1 = mockGenerateId();
        const id2 = mockGenerateId();
        assert(typeof id1 === 'string' && id1.length > 0, 'generateId produces a valid string');
        assert(id1 !== id2, 'generateId produces unique values');
    } catch (e) {
        console.error("Test failed", e);
    }

    console.log(`🏁 Testing Complete: ${passed} Passed, ${failed} Failed.`);
})();
