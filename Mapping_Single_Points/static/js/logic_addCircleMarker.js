// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level:
// Set center over Central Las Angeles (LA)
// Set zoom level to 14
let map = L.map('mapid').setView([34.0522, -118.2437], 14);

// Use the circleMarker() function to place a circle on the map
L.circleMarker([34.0522, -118.2437], {
    radius: 300, // measures the radius of the circle in pixels
    color: "black", // black outline on circle
    fillColor: "#ffffa1", // light-yellow inside of circle
    fillOpacity: 0.3 // adjust opacity
}).addTo(map);

// We create the tile layer that will be the background of our map.
// Change style to a dark map (https://docs.mapbox.com/api/maps/#styles)
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);