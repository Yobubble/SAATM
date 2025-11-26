import { Aircraft, AircraftApiResponse } from "../utils/types";

/**
 * Create a mock AircraftApiResponse with custom aircraft data
 * @param aircraft - Array of aircraft
 * @param location - Optional location override
 * @returns Complete AircraftApiResponse object
 */
export function createMockAircraftResponse(
    aircraft: Aircraft[],
    location?: { lat: number; lon: number; radius: number },
): AircraftApiResponse {
    return {
        total: aircraft.length,
        now: Date.now() / 1000,
        message: "mock data",
        aircraft,
        cached: false,
        location: location || {
            lat: 13.69,
            lon: 100.75,
            radius: 100,
        },
    };
}

/**
 * Check if mock data mode is enabled
 * @param aircraftData - The aircraft data response
 * @returns True if using mock data
 */
export function isMockData(aircraftData: AircraftApiResponse | null): boolean {
    return aircraftData?.message === "mock data";
}

/**
 * Get aircraft data based on mock mode setting
 * @param useMockData - Whether to use mock data
 * @param mockAircraft - Array of mock aircraft
 * @param realData - Real aircraft data from API
 * @returns Appropriate aircraft data response
 */
export function getAircraftData(
    useMockData: boolean,
    mockAircraft: Aircraft[],
    realData: AircraftApiResponse | null,
): AircraftApiResponse | null {
    if (useMockData) {
        return createMockAircraftResponse(mockAircraft);
    }
    return realData;
}

/**
 * Create a mock aircraft object with default values
 * @param overrides - Partial aircraft data to override defaults
 * @returns Complete Aircraft object
 */
export function createMockAircraft(overrides: Partial<Aircraft>): Aircraft {
    const defaults: Aircraft = {
        hex: "000000",
        flight: "TEST123",
        lat: 13.69,
        lon: 100.75,
        alt_baro: 10000,
        gs: 250,
        track: 0,
    };

    return { ...defaults, ...overrides };
}

/**
 * Generate multiple mock aircraft with varying parameters
 * @param count - Number of aircraft to generate
 * @param baseLocation - Center location for aircraft
 * @param spreadRadius - How far aircraft can be from center (in degrees)
 * @returns Array of mock aircraft
 */
export function generateMockAircraftArray(
    count: number,
    baseLocation: { lat: number; lon: number } = { lat: 13.69, lon: 100.75 },
    spreadRadius: number = 0.5,
): Aircraft[] {
    const aircraft: Aircraft[] = [];

    for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() - 0.5) * spreadRadius * 2;
        const lonOffset = (Math.random() - 0.5) * spreadRadius * 2;
        const altitude = Math.floor(Math.random() * 35000) + 5000;
        const groundSpeed = Math.floor(Math.random() * 300) + 150;
        const track = Math.floor(Math.random() * 360);

        aircraft.push(
            createMockAircraft({
                hex: `00000${i.toString(16).padStart(3, "0")}`,
                flight: `TST${i.toString().padStart(3, "0")}`,
                lat: baseLocation.lat + latOffset,
                lon: baseLocation.lon + lonOffset,
                alt_baro: altitude,
                gs: groundSpeed,
                track,
            }),
        );
    }

    return aircraft;
}
