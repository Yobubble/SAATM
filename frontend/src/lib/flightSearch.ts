import { Aircraft, AircraftApiResponse } from "../utils/types";

export interface SearchResult {
    selectedFlight: Aircraft | null;
    searchResults: Aircraft[];
    error: string | null;
}

/**
 * Search for flights by flight ID
 * @param flightId - The flight ID to search for
 * @param aircraftData - The aircraft data to search through
 * @returns SearchResult object containing the selected flight, search results, and any errors
 */

// TEST No.1
export function searchFlights(
    flightId: string,
    aircraftData: AircraftApiResponse | null,
): SearchResult {
    // Validate input
    if (flightId.trim() === "") {
        return {
            selectedFlight: null,
            searchResults: [],
            error: "Flight ID cannot be empty.",
        };
    }

    // Check if aircraft data is available
    if (!aircraftData) {
        return {
            selectedFlight: null,
            searchResults: [],
            error: "Aircraft data not available yet.",
        };
    }

    const normalizedFlightId = flightId.trim().toLowerCase();

    // Try to find exact match first
    const exactMatch = aircraftData.aircraft.find(
        (ac) => ac.flight?.trim().toLowerCase() === normalizedFlightId,
    );

    if (exactMatch) {
        return {
            selectedFlight: exactMatch,
            searchResults: [],
            error: null,
        };
    }

    // If no exact match, find prefix matches
    const prefixMatches = aircraftData.aircraft.filter((ac) =>
        ac.flight?.trim().toLowerCase().startsWith(normalizedFlightId),
    );

    if (prefixMatches.length > 0) {
        return {
            selectedFlight: null,
            searchResults: prefixMatches,
            error: null,
        };
    }

    // No matches found
    return {
        selectedFlight: null,
        searchResults: [],
        error: "No flights found.",
    };
}

/**
 * Update the selected flight with the latest data from aircraft data
 * @param selectedFlight - The currently selected flight
 * @param aircraftData - The latest aircraft data
 * @returns Updated flight or null if not found
 */
export function updateSelectedFlight(
    selectedFlight: Aircraft | null,
    aircraftData: AircraftApiResponse | null,
): Aircraft | null {
    if (!selectedFlight || !aircraftData) {
        return selectedFlight;
    }

    const updatedFlight = aircraftData.aircraft.find(
        (ac) => ac.hex === selectedFlight.hex,
    );

    return updatedFlight || selectedFlight;
}
