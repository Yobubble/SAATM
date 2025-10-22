import processing.data.*; // For JSON

// Add these new imports for the advanced connection
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStream;

/**
 * This is a new helper function that replaces loadJSONObject().
 * It makes a request with a "User-Agent" header to prevent
 * the API server from blocking us.
 */
JSONObject getJsonWithUserAgent(String urlString) {
  try {
    URL url = new URL(urlString);
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");
    
    // This is the *critical* line to mimic a browser
    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    
    // Get the data from the connection
    InputStream in = conn.getInputStream();
    String jsonText = new String(in.readAllBytes());
    in.close();
    
    // Use parseJSONObject (for a string) instead of loadJSONObject
    return parseJSONObject(jsonText);
    
  } catch (Exception e) {
    println("Error during advanced fetch: " + e.getMessage());
    e.printStackTrace();
    return null; // Return null if anything goes wrong
  }
}

void setup() {
  // Don't run the 'draw()' loop.
  noLoop(); 
  
  println("Fetching aircraft data from adsb.lol...");
  
  // Coordinates for Mahidol University (Salaya Campus)
  float lat = 13.7999;
  float lon = 100.3238;
  
  // Construct the API URL
 // /v2/closest/{lat}/{lon}/{radius}
  String url = "https://api.adsb.lol/v2/closest/" + lat + "/" + lon + "/" + 20;
               
  try {
    // --- THIS IS THE CHANGED LINE ---
    // We now call our new helper function instead of loadJSONObject()
    JSONObject response = getJsonWithUserAgent(url);
    
    // We must check if our function returned null (meaning it failed)
    if (response == null) {
      println("Error: Failed to get a valid response from the API.");
      return; // Stop the sketch
    }

    // Get the array of aircraft ("ac") from the response
    JSONArray aircraftList = response.getJSONArray("ac");
    
    // Check if any aircraft were found
    if (aircraftList.size() > 0) {
      println("--- Found the closest aircraft to Mahidol University ---");
      println(""); // Add a blank line
      
      // Get only the FIRST aircraft in the list (index 0)
      JSONObject ac = aircraftList.getJSONObject(0);
      
      String flight = ac.getString("flight", "N/A").trim();
      String hex = ac.getString("hex", "N/A");
      int altitude = ac.getInt("alt_baro", 0);
      float groundSpeed = ac.getFloat("gs", 0.0);
      
      String output = String.format(
        "  - Flight: %-10s | Hex: %-8s | Altitude: %-7d ft | Speed: %-5.1f kts", 
        flight, hex, altitude, groundSpeed
      );
      println(output);
      
    } else {
      println("--- No aircraft found near Mahidol University ---");
    }
    
  } catch (Exception e) {
    // This will catch any errors if the JSON structure is wrong
    println("Error parsing the JSON data: " + e.getMessage());
    e.printStackTrace();
  }
}
