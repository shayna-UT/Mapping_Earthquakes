// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Dark": dark
};

// Create the earthquake layer for our map.
let earthquakeLayer = new L.layerGroup();

// Create the tectonic plates layer
let tectonicsLayer = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    "Earthquakes": earthquakeLayer,
    "Tectonic Plates": tectonicsLayer
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -98.5], // geographic center of the United States
	zoom: 3,
	layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
// Then add a control to the map that will allow user to change which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the data for earthquaked in the past 7 days
// Resources: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Resources: https://earthquake.usgs.gov/data/comcat/data-eventterms.php
let earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing our GeoJSON data.
d3.json(earthquakes).then(function(data) {
    console.log(data);
    
    // This function returns the style data for each of the earthquakes.
    // We pass the magnitude of the earthquake into a function to calc. the radius.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    // This function determines the color of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
        return "#ea2c2c";
        }
        if (magnitude > 4) {
        return "#ea822c";
        }
        if (magnitude > 3) {
        return "#ee9c00";
        }
        if (magnitude > 2) {
        return "#eecc00";
        }
        if (magnitude > 1) {
        return "#d4ee00";
        }
        return "#98ee00";
    };
    
    // This function determines the radius of the earthquake marker based on magnitude.
    // Earthquakes with magnitude of 0 will be plotted with radius of 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    };
    
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using styleInfo() function
        style: styleInfo,
        // We create our popup for each circleMarker to display the earthquake's
        // magnitude and location after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakeLayer);
    // Then we add the earthquake layer to our map.
    earthquakeLayer.addTo(map);

    // Create a legend control object.
    // Resources: https://leafletjs.com/examples/choropleth/
    let legend = L.control({
        position: "bottomright"
    });

    // Add all the details for the legend.
    legend.onAdd = function() {
        // The legend will be added to a div element on the index.html 
        // using the "DomUtil" utility function.
        let div = L.DomUtil.create("div", "info legend");
        
        // magnitudes array
        const magnitudes = [0, 1, 2, 3, 4, 5];

        // colors array that holds the colors for our magnitudes
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];
        
        // The for loop will add the color choices from our color array 
        // as a small box for the color of the earthquakes
        // and place the text of the magnitude range next to the box.
        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    // Finally, we add our legend to the map. 
    legend.addTo(map);
});

// Accessing the data for tectonic plates
let tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Grabbing our GeoJSON data.
d3.json(tectonicPlates).then(function(data) {
    console.log(data);
    
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        color: "#EC7063",
        weight: 2
    }).addTo(tectonicsLayer);

  // Then we add the earthquake layer to our map.
  tectonicsLayer.addTo(map);
});