// frontend/src/utils/types.ts

export interface Aircraft {
    hex: string;
    flight?: string;
    lat: number;
    lon: number;
    alt_baro: number;
    gs: number;
    track: number;
}

export interface AircraftApiResponse {
    total: number;
    now: number;
    message: string;
    aircraft: Aircraft[];
    cached: boolean;
    location: {
        lat: number;
        lon: number;
        radius: number;
    };
}

// Defines the structure for a single radio transcript message
export type TranscriptMessage = {
    timestamp: number;
    text: string;
};