const path = require('path');
const fs = require('fs');

/**
 * Mock radio transcription controller
 * In the future, this will fetch from an ATC radio API.
 * For now, it just uses a local audio file and returns mock text.
 */
exports.radioController = async (req, res) => {
    try {
        const audioPath = path.join(__dirname, '../mock/sample_radio.mp3');

        if (!fs.existsSync(audioPath)) {
            return res.status(404).json({
                success: false,
                message: 'Audio file not found for mock transcription.',
            });
        }

        console.log(`Mock transcribing: ${audioPath}`);

        // Simulate "transcribing" with fake delay and output
        setTimeout(() => {
            res.json({
                success: true,
                source: 'mock_audio',
                filename: 'sample_radio.wav',
                transcript: "Tower to flight 123, you are cleared for takeoff runway 27.",
                confidence: 0.96,
                timestamp: new Date().toISOString(),
            });
        }, 1500);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
