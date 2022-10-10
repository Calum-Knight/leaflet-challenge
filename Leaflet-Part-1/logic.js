// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

    earthquakeData = data.features

    // Save the earthquake data in a variable.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`${feature.properties.place} <hr> Magnitude: ${feature.properties.mag}`)
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        style: markerStyle,
        onEachFeature: onEachFeature,
        poinToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }

    })


    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Creat an overlays object.
    var overlayMaps = {
        "Earthquakes": earthquakes
    }
    // Create a new map.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    var markers = L.circle

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = LDomUntil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        var legendInfo = "<h2>Depth of Earthquake</h2>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>"
        div.innerHTML = legendInfo;
        limits.forEach(function (limit, index) {
            labels.push("li style=\"background-color: " + colors[index] + "\"></li");
        });
        div.innerHTML = + "<ul>" + labels.join("") + "</ul>";
        return div;
    };



    // Create a layer control that contains our baseMaps.
    L.control.layers(baseMaps, overlayMaps, legend, {
        collapsed: false
    }).addTo(myMap);

});
