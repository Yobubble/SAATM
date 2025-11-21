import { describe, it, expect } from "vitest";
import { filterAircraftByAltitude } from "./altitudeFilter";
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
});
