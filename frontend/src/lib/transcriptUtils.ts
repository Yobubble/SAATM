import { TranscriptMessage } from "../utils/types";

/**
 * Parse timestamp string in "M.SS" format to total seconds
 * @param timestamp - Timestamp string in "M.SS" format (e.g., "1.30" = 1 minute 30 seconds)
 * @returns Total seconds as a number
 */

// TEST No.2
export function parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(".");
    if (parts.length !== 2) {
        return 0;
    }
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) {
        return 0;
    }

    return minutes * 60 + seconds;
}

/**
 * Get messages that should be displayed at a given time
 * @param allMessages - Complete list of transcript messages
 * @param currentTime - Current time in seconds
 * @param previousIndex - Index of the last message that was shown
 * @returns Object with new messages to display and updated index
 */
export function getMessagesUpToTime(
    allMessages: TranscriptMessage[],
    currentTime: number,
    previousIndex: number = 0,
): { messages: TranscriptMessage[]; newIndex: number } {
    const newMessages: TranscriptMessage[] = [];
    let index = previousIndex;

    while (index < allMessages.length) {
        const message = allMessages[index];
        const messageTimestamp = parseTimestamp(message.timestamp);

        if (currentTime >= messageTimestamp) {
            newMessages.push(message);
            index++;
        } else {
            break;
        }
    }

    return { messages: newMessages, newIndex: index };
}

/**
 * Check if a specific message should be shown at current time
 * @param message - The transcript message to check
 * @param currentTime - Current playback time in seconds
 * @returns True if the message should be displayed
 */
export function shouldShowMessage(
    message: TranscriptMessage,
    currentTime: number,
): boolean {
    const messageTime = parseTimestamp(message.timestamp);
    return currentTime >= messageTime;
}

/**
 * Get the next message that will appear
 * @param allMessages - Complete list of transcript messages
 * @param currentIndex - Current index in the transcript
 * @returns Next message or null if at the end
 */
export function getNextMessage(
    allMessages: TranscriptMessage[],
    currentIndex: number,
): TranscriptMessage | null {
    if (currentIndex >= allMessages.length) {
        return null;
    }
    return allMessages[currentIndex];
}

/**
 * Calculate time until next message
 * @param allMessages - Complete list of transcript messages
 * @param currentTime - Current playback time in seconds
 * @param currentIndex - Current index in the transcript
 * @returns Seconds until next message, or null if no more messages
 */
export function getTimeUntilNextMessage(
    allMessages: TranscriptMessage[],
    currentTime: number,
    currentIndex: number,
): number | null {
    const nextMessage = getNextMessage(allMessages, currentIndex);
    if (!nextMessage) {
        return null;
    }

    const nextMessageTime = parseTimestamp(nextMessage.timestamp);
    const timeUntil = nextMessageTime - currentTime;
    return timeUntil > 0 ? timeUntil : 0;
}

/**
 * Validate transcript message format
 * @param message - Message to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateTranscriptMessage(message: any): {
    isValid: boolean;
    error?: string;
} {
    if (!message) {
        return { isValid: false, error: "Message is null or undefined" };
    }

    if (!message.timestamp || typeof message.timestamp !== "string") {
        return { isValid: false, error: "Invalid or missing timestamp" };
    }

    if (!message.speaker || typeof message.speaker !== "string") {
        return { isValid: false, error: "Invalid or missing speaker" };
    }

    if (!message.text || typeof message.text !== "string") {
        return { isValid: false, error: "Invalid or missing text" };
    }

    // Validate timestamp format
    const timestampParts = message.timestamp.split(".");
    if (timestampParts.length !== 2) {
        return { isValid: false, error: "Timestamp must be in M.SS format" };
    }

    const minutes = parseInt(timestampParts[0], 10);
    const seconds = parseInt(timestampParts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) {
        return {
            isValid: false,
            error: "Timestamp contains non-numeric values",
        };
    }

    if (seconds < 0 || seconds >= 60) {
        return { isValid: false, error: "Seconds must be between 0 and 59" };
    }

    return { isValid: true };
}

/**
 * Filter messages within a time range
 * @param messages - Array of transcript messages
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @returns Filtered array of messages
 */
export function filterMessagesByTimeRange(
    messages: TranscriptMessage[],
    startTime: number,
    endTime: number,
): TranscriptMessage[] {
    return messages.filter((message) => {
        const messageTime = parseTimestamp(message.timestamp);
        return messageTime >= startTime && messageTime <= endTime;
    });
}

/**
 * Get transcript progress percentage
 * @param currentIndex - Current message index
 * @param totalMessages - Total number of messages
 * @returns Progress percentage (0-100)
 */
export function getTranscriptProgress(
    currentIndex: number,
    totalMessages: number,
): number {
    if (totalMessages === 0) {
        return 0;
    }
    return Math.min(100, (currentIndex / totalMessages) * 100);
}
