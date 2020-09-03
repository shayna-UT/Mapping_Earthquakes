// Documentation:
// https://leafletjs.com/reference-1.6.0.html#polyline

// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([40.7, -94.5], 4);

// Coordinates for each point to be used in the line.
let line = [
  [37.6213, -122.3790], // San Francisco Intl Airport (SFO)
  [30.1945, -97.6657],  // Austin-Bergstrom Intl Airport (AUS)
  [32.9187, -97.0590],  // Dallas/Fort Worth Intl Airport (DFW)
  [43.6777, -79.6248],  // Toronto Pearson Intl Airport (YYZ)
  [40.6441, -73.7822]   // John F Kennedy Intl Airport (JFK)
];

// Create a polyline using the line coordinates and make the line red.
L.polyline(line, {
  color: "blue",
  weight: 4,
  opacity: 0.5,
  dashArray: '5,10'
}).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);