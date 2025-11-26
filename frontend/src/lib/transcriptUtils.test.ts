import { describe, it, expect } from "vitest";
import {
    parseTimestamp,
    getMessagesUpToTime,
    shouldShowMessage,
    getNextMessage,
    getTimeUntilNextMessage,
    validateTranscriptMessage,
    filterMessagesByTimeRange,
    getTranscriptProgress,
} from "./transcriptUtils";

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

    // Additional tests below to improve coverage NOT IN REQUIREMENT.
    it("parses 0.00 as zero", () => {
        expect(parseTimestamp("0.00")).toBe(0);
    });

    it("parses variants with leading zeros", () => {
        expect(parseTimestamp("00.05")).toBe(5);
        expect(parseTimestamp("0.5")).toBe(5);
    });

    it("parses multi-digit minutes and seconds", () => {
        expect(parseTimestamp("12.34")).toBe(12 * 60 + 34);
    });

    it("returns 0 for empty, missing parts or invalid parts like '1.' or '.30'", () => {
        expect(parseTimestamp("")).toBe(0);
        expect(parseTimestamp("1.")).toBe(0);
        expect(parseTimestamp(".30")).toBe(0);
    });

    it("parses seconds >= 60 (no validation in parseTimestamp itself)", () => {
        // parseTimestamp treats 2.60 as 180 seconds (2*60 + 60)
        expect(parseTimestamp("2.60")).toBe(180);
    });

    it("parses floats like '1.3' as 63 seconds", () => {
        expect(parseTimestamp("1.3")).toBe(63);
    });
});

describe("transcript utils other functions", () => {
    const messages = [
        { timestamp: "0.05", speaker: "A", text: "hello" }, // 5 sec
        { timestamp: "1.00", speaker: "B", text: "hi" },    // 60 sec
        { timestamp: "2.30", speaker: "C", text: "hey" },   // 150 sec
    ];

    it("getMessagesUpToTime returns messages up to current time and newIndex", () => {
        const res1 = getMessagesUpToTime(messages, 0); // before first message (0 sec)
        expect(res1.messages).toHaveLength(0);
        expect(res1.newIndex).toBe(0);

        const res2 = getMessagesUpToTime(messages, 5); // at first message
        expect(res2.messages).toHaveLength(1);
        expect(res2.messages[0].text).toBe("hello");
        expect(res2.newIndex).toBe(1);

        const res3 = getMessagesUpToTime(messages, 60); // at second message boundary
        expect(res3.messages).toHaveLength(2);
        expect(res3.newIndex).toBe(2);

        // Test with previousIndex, starting from 1 and currentTime includes both remaining messages
        const res4 = getMessagesUpToTime(messages, 200, 1);
        expect(res4.messages.map((m) => m.text)).toEqual(["hi", "hey"]);
        expect(res4.newIndex).toBe(3);

        // Empty messages edge case
        const resEmpty = getMessagesUpToTime([], 100);
        expect(resEmpty.messages).toHaveLength(0);
        expect(resEmpty.newIndex).toBe(0);
    });

    it("shouldShowMessage correctly determines visibility", () => {
        const msg = { timestamp: "1.30", speaker: "X", text: "t" }; // 90 sec
        expect(shouldShowMessage(msg, 90)).toBe(true);
        expect(shouldShowMessage(msg, 89)).toBe(false);
    });

    it("getNextMessage returns correct next message or null", () => {
        expect(getNextMessage(messages, 0)).toEqual(messages[0]);
        expect(getNextMessage(messages, 2)).toEqual(messages[2]);
        expect(getNextMessage(messages, 3)).toBe(null);
    });

    it("getTimeUntilNextMessage returns time till next message, 0 when past, or null if none", () => {
        // next at 5s, currentTime > next => 0
        expect(getTimeUntilNextMessage(messages, 66, 0)).toBe(0);

        // next at 60s, currentTime 50 => 10
        expect(getTimeUntilNextMessage(messages, 50, 1)).toBe(10);

        // No next message => null
        expect(getTimeUntilNextMessage(messages, 0, 3)).toBe(null);
    });

    it("validateTranscriptMessage validates all fields and timestamp rules", () => {
        const validMsg = { timestamp: "0.10", speaker: "A", text: "ok" };
        expect(validateTranscriptMessage(validMsg).isValid).toBe(true);

        expect(validateTranscriptMessage(null).isValid).toBe(false);
        expect(validateTranscriptMessage({} as any).isValid).toBe(false);
        expect(validateTranscriptMessage({ timestamp: "a.10", speaker: "A", text: "t" } as any).error).toBe(
            "Timestamp contains non-numeric values",
        );
        expect(validateTranscriptMessage({ timestamp: "1.60", speaker: "A", text: "t" } as any).error).toBe(
            "Seconds must be between 0 and 59",
        );
        expect(validateTranscriptMessage({ timestamp: "0.05", speaker: 123, text: "t" } as any).error).toBe(
            "Invalid or missing speaker",
        );
        expect(validateTranscriptMessage({ timestamp: "0.05", speaker: "A", text: 123 } as any).error).toBe(
            "Invalid or missing text",
        );
    });

    it("filterMessagesByTimeRange filters correctly", () => {
        const filtered = filterMessagesByTimeRange(messages, 6, 150); // from >5 up to 150
        // Should include messages with timestamps: 1.00 (60) and 2.30 (150)
        expect(filtered.map((m) => m.text)).toEqual(["hi", "hey"]);

        // No messages in range
        expect(filterMessagesByTimeRange(messages, 151, 200)).toHaveLength(0);
    });

    it("getTranscriptProgress computes correct percentage and clamps to 100", () => {
        expect(getTranscriptProgress(2, 4)).toBe(50);
        expect(getTranscriptProgress(0, 0)).toBe(0);
        expect(getTranscriptProgress(5, 4)).toBe(100);
    });
});