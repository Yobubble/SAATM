import { describe, it, expect } from "vitest";
import {
    filterAircraftByAltitude,
    validateAltitudeRange,
    getAltitudeFilterStats,
} from "./altitudeFilter";
import { mockAircraftData } from "../utils/mock_data";

// Test Suite 3: Filter Aircraft from Altitude
// Technique used: AUC/ADUPC
// TR = {[1,2,3], [1,2,4,5], [1,2,4,6,7], [1,2,4,6,2]}
describe("filterAircraftByAltitude", () => {
    // Test Case 1 [1,2,3,2,3,...,2,8]: return aircrafts within the min and max range
    it("should filter by both minimum and maximum altitude", () => {
        const result = filterAircraftByAltitude(mockAircraftData, 10000, 20000);

        expect(result).toHaveLength(2);
        expect(result[0].alt_baro).toBe(13000);
        expect(result[1].alt_baro).toBe(17000);
    });

    // Test Case 2 [1,2,4,5,2,4,5,...,2,8]: return aircrafts above min
    it("should filter by minimum altitude only", () => {
        const result = filterAircraftByAltitude(mockAircraftData, 20000, null);

        expect(result).toHaveLength(6);
        expect(result[0].alt_baro).toBe(21000);
        expect(result[1].alt_baro).toBe(25000);
        expect(result[2].alt_baro).toBe(29000);
        expect(result[3].alt_baro).toBe(33000);
        expect(result[4].alt_baro).toBe(37000);
        expect(result[5].alt_baro).toBe(41000);
    });

    // Test Case 3 [1,2,4,6,7,2,4,6,7,...,2,8]: return aircrafts below max
    it("should filter by maximum altitude only", () => {
        const result = filterAircraftByAltitude(mockAircraftData, null, 10000);

        expect(result).toHaveLength(2);
        expect(result[0].alt_baro).toBe(5000);
        expect(result[1].alt_baro).toBe(9000);
    });

    // Test Case 4 [1,2,4,6,2,4,6...,2,8]: return all the aircrafts because no min or max found
    it("should return all aircraft when no filters are applied", () => {
        const result = filterAircraftByAltitude(mockAircraftData, null, null);

        expect(result).toHaveLength(10);
        expect(result).toEqual(mockAircraftData);
    });

    // Additional tests to improve coverage 
    it("should treat 0 as no filter (min=0 max=0 => return all)", () => {
        const res = filterAircraftByAltitude(mockAircraftData, 0, 0);
        expect(res).toHaveLength(mockAircraftData.length);
        expect(res).toEqual(mockAircraftData);
    });

    it("should treat min=0 as no min and filter only by max", () => {
        const res = filterAircraftByAltitude(mockAircraftData, 0, 10000);
        expect(res).toHaveLength(2);
        expect(res.map((a) => a.alt_baro)).toEqual([5000, 9000]);
    });

    it("should treat max=0 as no max and filter only by min", () => {
        const res = filterAircraftByAltitude(mockAircraftData, 10000, 0);
        expect(res.length).toBeGreaterThan(0);
        expect(res.every((a) => a.alt_baro >= 10000)).toBeTruthy();
    });

    it("should include endpoints when using exact min and max (inclusive)", () => {
        // Assuming there is an aircraft with alt_baro === 21000
        const res = filterAircraftByAltitude(mockAircraftData, 21000, 21000);
        expect(res).toHaveLength(1);
        expect(res[0].alt_baro).toBe(21000);
    });

    it("should return correct results when min and max are swapped (using validate only) - no filtering function change", () => {
        // filterAircraftByAltitude won't error, but validateAltitudeRange should flag this.
        const result = filterAircraftByAltitude(mockAircraftData, 30000, 20000);
        // When min > max, the function will treat 'only min' path because max check fails; expect >= 30000
        expect(result.every((a) => a.alt_baro >= 30000)).toBeTruthy();
    });
});

// Additional tests to improve coverage This part NOT IN REQUIREMENT
describe("validateAltitudeRange", () => {
    it("should validate correct range (min < max)", () => {
        const res = validateAltitudeRange(10000, 20000);
        expect(res.isValid).toBeTruthy();
        expect(res.error).toBeUndefined();
    });

    it("should return invalid when min > max", () => {
        const res = validateAltitudeRange(30000, 20000);
        expect(res.isValid).toBeFalsy();
        expect(res.error).toBe(
            "Minimum altitude cannot be greater than maximum altitude.",
        );
    });

    it("should return invalid when min is negative", () => {
        const res = validateAltitudeRange(-1, 10000);
        expect(res.isValid).toBeFalsy();
        expect(res.error).toBe("Minimum altitude cannot be negative.");
    });

    it("should return invalid when max is negative", () => {
        const res = validateAltitudeRange(10000, -100);
        expect(res.isValid).toBeFalsy();
        expect(res.error).toBe("Maximum altitude cannot be negative.");
    });

    it("should accept null values for min or max", () => {
        expect(validateAltitudeRange(null, 10000).isValid).toBeTruthy();
        expect(validateAltitudeRange(10000, null).isValid).toBeTruthy();
        expect(validateAltitudeRange(null, null).isValid).toBeTruthy();
    });
});

// Additional tests to improve coverage This part NOT IN REQUIREMENT
describe("getAltitudeFilterStats", () => {
    it("should return correct stats for a given range", () => {
        const stats = getAltitudeFilterStats(mockAircraftData, 10000, 20000);
        expect(stats.total).toBe(mockAircraftData.length);
        expect(stats.filtered).toBe(2);
        expect(stats.percentage).toBe(20);
    });

    it("should return 100% when no filters applied", () => {
        const stats = getAltitudeFilterStats(mockAircraftData, null, null);
        expect(stats.total).toBe(mockAircraftData.length);
        expect(stats.filtered).toBe(mockAircraftData.length);
        expect(stats.percentage).toBe(100);
    });

    it("should handle empty aircraft arrays", () => {
        const empty: typeof mockAircraftData = [];
        const stats = getAltitudeFilterStats(empty, 10000, 20000);
        expect(stats.total).toBe(0);
        expect(stats.filtered).toBe(0);
        expect(stats.percentage).toBe(0);
    });
});