import { describe, it, expect } from "vitest";
import { searchFlights } from "./flightSearch";
import { createMockAircraftResponse } from "./mockDataBuilder";
import { mockAircraftData } from "../utils/mock_data";

// Test Suite 1: Search Flights
// Technique used: AUC/ADUPC
// TR = {[1,2,3], [1,2,4], [1,2,4,5], [1,2,4,6], [1,2,4,6,8], [6,7], [8,9], [8,10]}
describe("searchFlights", () => {
    // Test Case 1 [1,2,3]: return "Flight ID cannot be empty." when flightId is an empty string
    it("should return error when flight ID is empty", () => {
        const mockAircraftResponse =
            createMockAircraftResponse(mockAircraftData);

        const result = searchFlights("", mockAircraftResponse);

        expect(result.error).toBe("Flight ID cannot be empty.");
        expect(result.selectedFlight).toBeNull();
        expect(result.searchResults).toEqual([]);
    });

    // Test Case 2 [1,2,4,5]: return "Aircraft data not available yet." when aircraftData is null
    it("should return error when aircraft data is null", () => {
        const result = searchFlights("TEST123", null);

        expect(result.error).toBe("Aircraft data not available yet.");
        expect(result.selectedFlight).toBeNull();
        expect(result.searchResults).toEqual([]);
    });

    // Test Case 3 [1,2,4,6,7]: return exact matched aircraft from flightId.
    it("should find exact match (case insensitive)", () => {
        const mockAircraftResponse =
            createMockAircraftResponse(mockAircraftData);
        const result = searchFlights("ict062", mockAircraftResponse);

        expect(result.error).toBeNull();
        expect(result.selectedFlight).toEqual(mockAircraftData[0]);
        expect(result.searchResults).toEqual([]);
    });

    // Test Case 4 [1,2,4,6,8,9]: return a set of matched aircraft from prefix
    it("should return prefix matches when no exact match found", () => {
        const mockAircraftResponse =
            createMockAircraftResponse(mockAircraftData);
        const result = searchFlights("ICT", mockAircraftResponse);

        expect(result.error).toBeNull();
        expect(result.selectedFlight).toBeNull();
        expect(result.searchResults).toHaveLength(2);
        expect(result.searchResults).toContain(mockAircraftData[0]);
        expect(result.searchResults).toContain(mockAircraftData[1]);
    });

    // Test Case 5 [1,2,4,6,8,10]: return "no flight found." when there's no flight match with the keywords
    it("should return error when no flights found", () => {
        const mockAircraftResponse =
            createMockAircraftResponse(mockAircraftData);
        const result = searchFlights("NOTFOUND", mockAircraftResponse);

        expect(result.error).toBe("No flights found.");
        expect(result.selectedFlight).toBeNull();
        expect(result.searchResults).toEqual([]);
    });
});
