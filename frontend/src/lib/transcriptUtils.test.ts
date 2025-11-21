import { describe, it, expect } from "vitest";
import { parseTimestamp } from "./transcriptUtils";

// Test Suite 2: Parse Timestamp
// Technique used: AUC/ADUPC
// TR = {[1,2], [2,3], [4,5], [4,6]}
describe("parseTimestamp", () => {
    // Test Case 1 [1,2,3]: return 0 when there's no dot to separate minute and second
    it("should parse zero timestamp", () => {
        expect(parseTimestamp("200")).toBe(0);
    });

    // Test Case 2 [1,2,4,5]: return 0 when minute or second isn't integer
    it("should parse zero timestamp", () => {
        expect(parseTimestamp("xyz.50")).toBe(0);
    });

    // Test Case 3 [1,2,4,6]: return 90 because 1 minute 30 seconds equal to 90 seconds
    it("should parse single digit seconds", () => {
        expect(parseTimestamp("1.30")).toBe(90);
    });
});
