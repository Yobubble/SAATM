/*
 * Live_Flight_Tracker (All Aircraft Version)
 *
 * This sketch fetches ALL aircraft within a 20nm radius of
 * Mahidol University every 2 seconds.
 *
 * - Active paths are drawn in GREEN.
 * - Inactive paths (planes that left the radius) turn YELLOW
 * and fade to RED over 4 minutes.
 * - Map zoom level is now tied to the SEARCH_RADIUS_NM.
 * - NEW: Click the mouse to retry fetching if an error stops the feed.
 */

import processing.data.*; // For JSON
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStream;
import java.util.ArrayList; // To store the flight path
import java.util.Collections; // For thread-safe list
import java.util.List;
import java.util.HashSet; // To check which planes are active

// --- Global Variables ---

// --- Map & Location ---
final float CENTER_LAT = 13.7999;
final float CENTER_LON = 100.3238;

// --- THIS IS NOW THE MAIN VARIABLE ---
// Change this to zoom in or out. 50nm = zoomed out, 10nm = zoomed in.
final int SEARCH_RADIUS_NM = 20;

// These are now calculated in setup() based on the radius
float MAP_WIDTH_DEGREES;
float MAP_HEIGHT_DEGREES;
final float MAP_PADDING_FACTOR = 1.2; // 20% padding

// --- API Timer ---
int lastApiCallTime = 0;
final int API_CALL_INTERVAL = 2000; // 2 seconds
boolean fetchData = true; // NEW: Flag to control the update loop

// --- Aircraft Data ---
final int MAX_PATH_POINTS = 200; // Max points per trail
String currentFlightInfo = "Fetching data...";

// --- NEW: Data structure for multiple paths ---
List<FlightPath> allPaths = Collections.synchronizedList(new ArrayList<FlightPath>());

// A class to hold the path and state for a single aircraft
class FlightPath {
  String hex;
  String flightName = "N/A"; // NEW: Store the callsign
  List<PVector> points = new ArrayList<PVector>();
  
  // State tracking for color
  boolean active = true;
  long inactiveTimestamp = 0;
  final long FADE_DURATION = 4 * 60 * 1000; // 4 minutes in milliseconds
  
  FlightPath(String hex) {
    this.hex = hex;
  }
  
  void addPoint(PVector p) {
    points.add(p);
    // Prune the trail if it gets too long
    while (points.size() > MAX_PATH_POINTS) {
      points.remove(0); // Remove the oldest point
    }
  }
  
  PVector getLastPoint() {
    if (points.isEmpty()) return null;
    return points.get(points.size() - 1);
  }
  
  // Called every time the plane is seen in the API response
  void markAsActive() {
    this.active = true;
    this.inactiveTimestamp = 0;
  }
  
  // Called if the plane is *not* in the API response
  void markAsInactive() {
    // Only set the timestamp the *first time* it's marked inactive
    if (this.active) {
      this.inactiveTimestamp = millis();
    }
    this.active = false;
  }
  
  // Returns the correct color based on state
  color getPathColor() {
    if (this.active) {
      return color(0, 255, 0); // Green
    }
    
    // --- It's inactive, calculate the fade ---
    long timeSinceInactive = millis() - this.inactiveTimestamp;
    
    if (timeSinceInactive >= FADE_DURATION) {
      return color(255, 0, 0); // Fully Red
    }
    
    // Calculate the fade amount (0.0 to 1.0)
    float fadeAmount = (float)timeSinceInactive / FADE_DURATION;
    
    // Lerp color from Yellow to Red
    color yellow = color(255, 255, 0);
    color red = color(255, 0, 0);
    return lerpColor(yellow, red, fadeAmount);
  }
}


/**
 * Helper function to make the API call with a User-Agent.
 * (Unchanged)
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
    return null;
  }
}

/**
 * UPDATED: This is our main data update logic.
 * It now processes *all* aircraft in the response.
 */
void updateAircraftData() {
  // --- FIX 1: Use the /v2/point/ endpoint ---
  String url = "https://api.adsb.lol/v2/point/" + CENTER_LAT + "/" + CENTER_LON + "/" + SEARCH_RADIUS_NM;
  
  try {
    JSONObject response = getJsonWithUserAgent(url);
    
    if (response == null) {
      currentFlightInfo = "API Error: No response. Click to retry.";
      fetchData = false; // --- NEW: Stop the loop
      return;
    }
    
    // --- FIX: Check for "ac" key instead of "aircraft" ---
    if (!response.hasKey("ac")) {
      currentFlightInfo = "API Error: Response missing 'ac' key. Click to retry.";
      // --- FIX: Correct typo and truncate string to prevent console flood ---
      String responseStr = response.toString();
      println("API Error. Full response (truncated): " + responseStr.substring(0, min(responseStr.length(), 500)));
      fetchData = false; // --- NEW: Stop the loop
      return;
    }

    // --- FIX: Get JSON array named "ac" ---
    JSONArray aircraftList = response.getJSONArray("ac");
    
    // --- FIX: Add a null check for the array itself ---
    if (aircraftList == null) {
      currentFlightInfo = "API Error: 'ac' data is null. Click to retry.";
      fetchData = false; // --- NEW: Stop the loop
      return;
    }
    
    // A set to keep track of all planes seen in *this* API call
    HashSet<String> seenHexCodes = new HashSet<String>();

    if (aircraftList.size() > 0) {
      
      // Update the info string to show the *closest* plane's info
      // We can just grab the first one, though it's not guaranteed sorted.
      JSONObject closest_ac = aircraftList.getJSONObject(0);
      String flight = closest_ac.getString("flight", "N/A").trim();
      int altitude = closest_ac.getInt("alt_baro", 0);
      float groundSpeed = closest_ac.getFloat("gs", 0.0);
      currentFlightInfo = String.format(
        "Tracking %d aircraft. First: %-10s | Alt: %-7d ft", 
        aircraftList.size(), flight, altitude
      );
      
      // --- Loop through ALL aircraft in the list ---
      for (int i = 0; i < aircraftList.size(); i++) {
        JSONObject ac = aircraftList.getJSONObject(i);
        String newHex = ac.getString("hex", "N/A");
        String newFlightName = ac.getString("flight", "N/A").trim(); // Get name
        
        // Add to our set of seen planes
        seenHexCodes.add(newHex);
        
        if (ac.hasKey("lat") && ac.hasKey("lon")) {
            float currentLat = ac.getFloat("lat");
            float currentLon = ac.getFloat("lon");
            PVector newPoint = geoToScreen(currentLat, currentLon);
            
            synchronized(allPaths) {
              // Find the path for this hex, or create it if it doesn't exist
              FlightPath pathForThisHex = null;
              for (FlightPath p : allPaths) {
                if (p.hex.equals(newHex)) {
                  pathForThisHex = p;
                  break;
                }
              }
              
              // If no path was found, create a new one
              if (pathForThisHex == null) {
                pathForThisHex = new FlightPath(newHex);
                allPaths.add(pathForThisHex);
              }
              
              pathForThisHex.flightName = newFlightName; // Store/update name
              pathForThisHex.addPoint(newPoint);
              // --- THIS IS THE FIX ---
              pathForThisHex.markAsActive();
            }
        }
      }
      
    } else {
      // No aircraft found
      currentFlightInfo = "No aircraft found within " + SEARCH_RADIUS_NM + " nm.";
    }
    
    // --- Mark unseen planes as inactive ---
    // Now, loop through all our known paths and see which ones
    // were *not* in this latest API call.
    synchronized(allPaths) {
      for (FlightPath p : allPaths) {
        if (!seenHexCodes.contains(p.hex)) {
          p.markAsInactive();
        }
      }
    }
    
  } catch (Exception e) {
    currentFlightInfo = "Error parsing JSON data. Click to retry.";
    println("JSON Parse Error: " + e.getMessage());
    e.printStackTrace(); // Print the full error
    fetchData = false; // --- NEW: Stop the loop
  }
}

/**
 * Converts (lat, lon) to screen (x, y).
 * (Unchanged)
 */
PVector geoToScreen(float lat, float lon) {
  // Calculate map boundaries based on the dynamic zoom level
  float minLat = CENTER_LAT - MAP_HEIGHT_DEGREES / 2;
  float maxLat = CENTER_LAT + MAP_HEIGHT_DEGREES / 2;
  float minLon = CENTER_LON - MAP_WIDTH_DEGREES / 2;
  float maxLon = CENTER_LON + MAP_WIDTH_DEGREES / 2;
  
  float x = map(lon, minLon, maxLon, 0, width);
  float y = map(lat, maxLat, minLat, 0, height); 
  
  return new PVector(x, y);
}


// --- Main Processing Functions ---

void setup() {
  size(800, 800); 
  strokeWeight(2);
  textSize(16);
  
  // --- NEW: Calculate the map's zoom level based on the radius ---
  // 1 degree lat = 60 nm
  // 1 degree lon = 60 * cos(lat) nm
  float radiusInLatDegrees = SEARCH_RADIUS_NM / 60.0;
  float radiusInLonDegrees = SEARCH_RADIUS_NM / (60.0 * cos(radians(CENTER_LAT)));
  
  // Set the map dimensions to be the diameter (radius * 2) plus padding
  MAP_HEIGHT_DEGREES = radiusInLatDegrees * 2 * MAP_PADDING_FACTOR;
  MAP_WIDTH_DEGREES = radiusInLonDegrees * 2 * MAP_PADDING_FACTOR;
  
  println("Fetching initial aircraft data...");
  println("Map zoom level set for " + SEARCH_RADIUS_NM + "nm radius.");
  
  thread("updateAircraftData"); 
  lastApiCallTime = millis();
}

/**
 * UPDATED: The draw loop now draws all paths based on their
 * active state and color.
 */
void draw() {
  // Check if it's time to call the API again
  // --- NEW: Only fetch if the flag is true ---
  if (fetchData && (millis() - lastApiCallTime > API_CALL_INTERVAL)) {
    thread("updateAircraftData"); 
    lastApiCallTime = millis();
  }
  
  // --- Draw the visualization ---
  
  // 1. Draw the dark background
  background(20); 
  
  // 2. Draw Mahidol University's location
  PVector mahidolPos = geoToScreen(CENTER_LAT, CENTER_LON);
  stroke(255, 0, 0); // Red
  fill(255, 0, 0);
  circle(mahidolPos.x, mahidolPos.y, 10);
  
  // 3. Draw the flight paths
  synchronized(allPaths) {
    
    // --- Loop 1: Draw INACTIVE paths first (fading yellow/red) ---
    noFill();
    for (FlightPath path : allPaths) {
      if (!path.active && !path.points.isEmpty()) {
        stroke(path.getPathColor()); // Get the fading color
        beginShape();
        for (PVector v : path.points) {
          vertex(v.x, v.y);
        }
        endShape();
      }
    }
    
    // --- Loop 2: Draw ACTIVE paths on top (green) ---
    for (FlightPath path : allPaths) {
      if (path.active && !path.points.isEmpty()) {
        stroke(path.getPathColor()); // This will be green
        noFill();
        beginShape();
        // --- THIS IS THE FIX ---
        for (PVector v : path.points) {
          vertex(v.x, v.y);
        }
        endShape();
        
        // Draw the current aircraft (last point in the list)
        PVector currentPos = path.getLastPoint();
        fill(0, 255, 0); // Green
        stroke(0, 255, 0); // Green
        circle(currentPos.x, currentPos.y, 8);
        
        // --- NEW: Draw flight name label ---
        fill(255); // White text
        noStroke();
        textAlign(LEFT, BASELINE);
        // Draw text slightly offset from the circle
        text(path.flightName, currentPos.x + 8, currentPos.y + 4);
      }
    }
  }
  
  // 4. Draw the text info at the bottom
  fill(255); // White text
  noStroke();
  textAlign(LEFT, BOTTOM);
  text(currentFlightInfo, 10, height - 10);
}

// --- NEW: Add mousePressed function to retry fetching ---
void mousePressed() {
  if (!fetchData) {
    fetchData = true;
    currentFlightInfo = "Retrying... Fetching data...";
    println("Retrying data fetch...");
    thread("updateAircraftData");
    lastApiCallTime = millis();
  }
}
