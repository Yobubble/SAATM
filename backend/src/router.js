const express = require('express');
const axios = require('axios');
const router = express.Router();
const { radioController } = require('./controllers/radioController');

// ======== Default Location (VTBS - Suvarnabhumi Airport) ========
const DEFAULT_LAT = 13.7;   // latitude
const DEFAULT_LON = 100.76; // longitude
const DEFAULT_RADIUS = 75; // kilometers

// ======== Cache Variables ========
let cachedData = null;
let lastFetchTime = 0;

// ======== Helper Function to Fetch Data ========
async function fetchAircraftData() {
  try {
    const url = `https://api.adsb.lol/v2/lat/${DEFAULT_LAT}/lon/${DEFAULT_LON}/dist/${DEFAULT_RADIUS}`;
    const response = await axios.get(url);
    const data = response.data;

    const aircraft = (data.ac || []).map(ac => ({
      hex: ac.hex,
      flight: ac.flight,
      lat: ac.lat,
      lon: ac.lon,
      alt_baro: ac.alt_baro,
      gs: ac.gs,
      track: ac.track,
      baro_rate: ac.baro_rate,
      seen: ac.seen,
    }));

    cachedData = {
      total: aircraft.length,
      now: data.now,
      message: data.msg || 'No error',
      aircraft,
    };

    lastFetchTime = Date.now();
    console.log(`✅ Aircraft data updated: ${aircraft.length} entries`);

  } catch (error) {
    console.error('❌ Error fetching aircraft data:', error.message);
    cachedData = { error: 'No ADS-B data available or API request failed' };
  }
}

// ======== API Endpoint ========
/**
 * @route   GET /api/aircraft
 * @desc    Returns aircraft data from cache (auto-updated every 1s)
 * @access  Public
 */
router.get('/aircraft', async (req, res) => {
  // If data is older than 1 second, refresh it
  if (!cachedData || (Date.now() - lastFetchTime > 1000)) {
    await fetchAircraftData();
  }

  res.json({
    ...cachedData,
    cached: true,
    location: {
      lat: DEFAULT_LAT,
      lon: DEFAULT_LON,
      radius: DEFAULT_RADIUS,
    },
  });
});

// ======== Auto-refresh cache every x second ========
setInterval(fetchAircraftData, 1000);    // setup the auto-refresh interval



//radio transcribe controller
router.get('/transcribe', radioController);


module.exports = router;