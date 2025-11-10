export interface AircraftData {
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
    aircraft: AircraftData[];
    cached: boolean;
    location: {
        lat: number;
        lon: number;
        radius: number;
    };
}
