import { Aircraft } from "../utils/types";

/**
 * Filter aircraft by altitude range
 * @param aircraft - Array of aircraft to filter
 * @param minAltitude - Minimum altitude (in feet). Use null or 0 for no minimum
 * @param maxAltitude - Maximum altitude (in feet). Use null or 0 for no maximum
 * @returns Filtered array of aircraft
 */

// TEST No.3
export function filterAircraftByAltitude(
    aircraft: Aircraft[],
    minAltitude: number | null,
    maxAltitude: number | null,
): Aircraft[] {
    return aircraft.filter((ac) => {
        const altitude = ac.alt_baro;

        // Both min and max are set
        if (minAltitude && minAltitude > 0 && maxAltitude && maxAltitude > 0) {
            return altitude >= minAltitude && altitude <= maxAltitude;
        }

        // Only min is set
        if (minAltitude && minAltitude > 0) {
            return altitude >= minAltitude;
        }

        // Only max is set
        if (maxAltitude && maxAltitude > 0) {
            return altitude <= maxAltitude;
        }

        // No filter applied
        return true;
    });
}

/**
 * Validate altitude filter values
 * @param minAltitude - Minimum altitude value
 * @param maxAltitude - Maximum altitude value
 * @returns Object with isValid flag and optional error message
 */
export function validateAltitudeRange(
    minAltitude: number | null,
    maxAltitude: number | null,
): { isValid: boolean; error?: string } {
    // Check if both values are provided
    if (
        minAltitude !== null &&
        maxAltitude !== null &&
        minAltitude > 0 &&
        maxAltitude > 0
    ) {
        if (minAltitude > maxAltitude) {
            return {
                isValid: false,
                error: "Minimum altitude cannot be greater than maximum altitude.",
            };
        }
    }

    // Check for negative values
    if (minAltitude !== null && minAltitude < 0) {
        return {
            isValid: false,
            error: "Minimum altitude cannot be negative.",
        };
    }

    if (maxAltitude !== null && maxAltitude < 0) {
        return {
            isValid: false,
            error: "Maximum altitude cannot be negative.",
        };
    }

    return { isValid: true };
}

/**
 * Get aircraft count statistics by altitude range
 * @param aircraft - Array of aircraft
 * @param minAltitude - Minimum altitude filter
 * @param maxAltitude - Maximum altitude filter
 * @returns Statistics object with total and filtered counts
 */
export function getAltitudeFilterStats(
    aircraft: Aircraft[],
    minAltitude: number | null,
    maxAltitude: number | null,
): { total: number; filtered: number; percentage: number } {
    const total = aircraft.length;
    const filtered = filterAircraftByAltitude(
        aircraft,
        minAltitude,
        maxAltitude,
    ).length;
    const percentage = total > 0 ? (filtered / total) * 100 : 0;

    return { total, filtered, percentage };
}
