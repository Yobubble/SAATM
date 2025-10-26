/*
 * Live_Flight_Tracker (Processing Demo)
 *
 * This sketch fetches the closest aircraft to Mahidol University
 * every 2 seconds and draws its flight path on the canvas.
 *
 * - Uses thread() to prevent the API call from freezing the sketch.
 * - Uses millis() as a timer.
 * - Uses a helper function to map (lat, lon) to (x, y) coordinates.
 * - Creates a "breadcrumb trail" for the currently tracked aircraft.
 */

import processing.data.*; // For JSON
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStream;
import java.util.ArrayList; // To store the flight path
import java.util.Collections; // For thread-safe list
import java.util.List;

// --- Global Variables ---

// --- Map & Location ---
// We will center our map on Mahidol University
final float CENTER_LAT = 13.7999;
final float CENTER_LON = 100.3238;
// This defines our "zoom" level. 1.0 degrees = wider view
final float MAP_WIDTH_DEGREES = 1.0;
final float MAP_HEIGHT_DEGREES = 1.0;
// The search radius for the API call (in nautical miles)
final int SEARCH_RADIUS_NM = 50; // Increased radius

// --- API Timer ---
int lastApiCallTime = 0;
final int API_CALL_INTERVAL = 2000; // 2000 ms = 2 seconds

// --- Aircraft Data ---
// We need a thread-safe list because one thread (API) will be
// writing to it while the main thread (draw) is reading it.
List<PVector> flightPath = Collections.synchronizedList(new ArrayList<PVector>());
String currentFlightInfo = "Fetching data...";

// --- FIX: Add variables to track the *current* plane ---
String currentlyTrackedHex = "";
final int MAX_PATH_POINTS = 200; // Max points in our trail


/**
 * Helper function to make the API call with a User-Agent.
 * This is the same as before.
 */
JSONObject getJsonWithUserAgent(String urlString) {
  try {
    URL url = new URL(urlString);
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");
    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    
    InputStream in = conn.getInputStream();
    String jsonText = new String(in.readAllBytes());
    in.close();
    
    return parseJSONObject(jsonText);
  } catch (Exception e) {
    println("Error during advanced fetch: " + e.getMessage());
    // Don't print the full stack trace, it's too noisy for a loop
    // e.printStackTrace(); 
    return null;
  }
}

/**
 * NEW FUNCTION: This is our main data update logic.
 * We will call this function in a separate thread.
 */
void updateAircraftData() {
  // Construct the API URL
  String url = "https://api.adsb.lol/v2/closest/" + CENTER_LAT + "/" + CENTER_LON + "/" + SEARCH_RADIUS_NM;
  
  try {
    JSONObject response = getJsonWithUserAgent(url);
    
    if (response == null) {
      currentFlightInfo = "API Error: No response.";
      return;
    }

    JSONArray aircraftList = response.getJSONArray("ac");
    
    if (aircraftList.size() > 0) {
      // Get the first aircraft (the closest)
      JSONObject ac = aircraftList.getJSONObject(0);
      
      // Update the text display
      String flight = ac.getString("flight", "N/A").trim();
      int altitude = ac.getInt("alt_baro", 0);
      float groundSpeed = ac.getFloat("gs", 0.0);
      currentFlightInfo = String.format(
        "Flight: %-10s | Alt: %-7d ft | Spd: %-5.1f kts", 
        flight, altitude, groundSpeed
      );
      
      // --- FIX: Breadcrumb Trail Logic ---
      
      // Get the unique ID and current position of the closest plane
      String newHex = ac.getString("hex", "N/A");
      
      if (ac.hasKey("lat") && ac.hasKey("lon")) {
          float currentLat = ac.getFloat("lat");
          float currentLon = ac.getFloat("lon");
          
          synchronized(flightPath) {
            // Check if this is a *different* plane than we were tracking
            if (!newHex.equals(currentlyTrackedHex)) {
              // It's a new plane, so clear the old path
              flightPath.clear();
              // And update the ID of the plane we are now tracking
              currentlyTrackedHex = newHex;
            }
            
            // Add the new, current position to the trail
            flightPath.add(geoToScreen(currentLat, currentLon));
            
            // Prune the trail if it gets too long
            while (flightPath.size() > MAX_PATH_POINTS) {
              flightPath.remove(0); // Remove the oldest point
            }
          }
      }
      // --- END FIX ---
      
    } else {
      // No aircraft found
      currentFlightInfo = "No aircraft found within " + SEARCH_RADIUS_NM + " nm.";
      synchronized(flightPath) {
        flightPath.clear(); // Clear path if no plane
        currentlyTrackedHex = ""; // Reset tracked plane
      }
    }
    
  } catch (Exception e) {
    currentFlightInfo = "Error parsing JSON data.";
    println("JSON Parse Error: " + e.getMessage());
  }
}

/**
 * NEW FUNCTION: Converts (lat, lon) to screen (x, y).
 */
PVector geoToScreen(float lat, float lon) {
  // Calculate the latitude/longitude boundaries of our map
  float minLat = CENTER_LAT - MAP_HEIGHT_DEGREES / 2;
  float maxLat = CENTER_LAT + MAP_HEIGHT_DEGREES / 2;
  float minLon = CENTER_LON - MAP_WIDTH_DEGREES / 2;
  float maxLon = CENTER_LON + MAP_WIDTH_DEGREES / 2;
  
  // Use Processing's map() function to scale the coordinates
  float x = map(lon, minLon, maxLon, 0, width);
  // Y-axis is inverted: High latitude is 0 on screen (top)
  float y = map(lat, maxLat, minLat, 0, height); 
  
  return new PVector(x, y);
}


// --- Main Processing Functions ---

void setup() {
  // Set up our canvas
  size(800, 800); 
  
  // Set drawing styles
  strokeWeight(2);
  textSize(16);
  
  // Get the first batch of data immediately on startup
  println("Fetching initial aircraft data...");
  thread("updateAircraftData"); 
  lastApiCallTime = millis();
}

void draw() {
  // Check if it's time to call the API again
  if (millis() - lastApiCallTime > API_CALL_INTERVAL) {
    // Call in a new thread so the animation doesn't freeze
    thread("updateAircraftData"); 
    lastApiCallTime = millis(); // Reset the timer
  }
  
  // --- Draw the visualization ---
  
  // 1. Draw the dark background
  background(20); 
  
  // 2. Draw Mahidol University's location (our center point)
  PVector mahidolPos = geoToScreen(CENTER_LAT, CENTER_LON);
  stroke(255, 0, 0); // Red
  fill(255, 0, 0);
  circle(mahidolPos.x, mahidolPos.y, 10);
  
  // 3. Draw the flight path and current plane
  // We use 'synchronized' to safely read the list
  synchronized(flightPath) {
    if (!flightPath.isEmpty()) {
      
      // Draw the path as a blue line
      stroke(0, 150, 255); // Blue
      noFill();
      beginShape();
      for (PVector v : flightPath) {
        vertex(v.x, v.y);
      }
      endShape();
      
      // Draw the current aircraft (last point in the list)
      PVector currentPos = flightPath.get(flightPath.size() - 1);
      stroke(255, 255, 0); // Yellow
      fill(255, 255, 0);
      circle(currentPos.x, currentPos.y, 8);
    }
  }
  
  // 4. Draw the text info at the bottom
  fill(255); // White text
  noStroke();
  textAlign(LEFT, BOTTOM);
  text(currentFlightInfo, 10, height - 10);
}
