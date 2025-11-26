// frontend/src/utils/mockTranscript.ts
import { TranscriptMessage } from "./types";

// This is the hand-transcribed data for the radio simulation.
export const mockTranscript: TranscriptMessage[] = [
    {
        timestamp: "0.01",
        speaker: "ATC",
        text: "Direct SABSA 19L QNH 1003 BKP146.",
    },
    { timestamp: "0.05", speaker: "ATC", text: "BKP146, High speed approved." },
    { timestamp: "0.08", speaker: "Pilot", text: "Roger BKP146." },
    { timestamp: "0.16", speaker: "ATC", text: "Decend 14000 feet BKP146." },
    {
        timestamp: "0.19",
        speaker: "ATC",
        text: "BKP146 Decend 11000 feet QNH 1003.",
    },
    { timestamp: "0.23", speaker: "Pilot", text: "Decend 11000 1003 BKP146." },
    {
        timestamp: "0.49",
        speaker: "ATC",
        text: "AIQ647 confirm decend 3000 feet.",
    },
    {
        timestamp: "0.52",
        speaker: "ATC",
        text: "AIQ647 decend 2600 feet cleared ILS-Z Runway 21R.",
    },
    {
        timestamp: "0.57",
        speaker: "Pilot",
        text: "Devend 2600 feet cleared ILS-Z 21R AIQ647.",
    },
    {
        timestamp: "1.02",
        speaker: "Pilot",
        text: "AIQ3119, Established runway 21R.",
    },
    {
        timestamp: "1.06",
        speaker: "ATC",
        text: "AIQ3119, can you reduce minimum approach speed?",
    },
    { timestamp: "1.12", speaker: "ATC", text: "Say your minimum." },
    { timestamp: "1.17", speaker: "Pilot", text: "Minimum 141 knots, AIQ3119" },
    { timestamp: "1.19", speaker: "ATC", text: "Roger" },
    {
        timestamp: "1.21",
        speaker: "ATC",
        text: "AIQ3119, contact tower 118.1.",
    },
    { timestamp: "1.24", speaker: "Pilot", text: "1181 AIQ3119." },
    {
        timestamp: "1.30",
        speaker: "ATC",
        text: "AIQ647, reduce speed 140 and clear ILS-Z runway 21R report established.",
    },
    {
        timestamp: "1.36",
        speaker: "Pilot",
        text: "Speed 140 runway 21R report established, AIQ647.",
    },
    { timestamp: "1.42", speaker: "ATC", text: "NOK305 reduce speed 160." },
    {
        timestamp: "1.46",
        speaker: "Pilot",
        text: "reduce speed 160 knots, NOK305",
    },
    { timestamp: "1.55", speaker: "Pilot", text: "NOK537 SABAI3A." },
    {
        timestamp: "1.57",
        speaker: "ATC",
        text: "NOK537, radar contacted descend FL140 direct NOD",
    },
];
