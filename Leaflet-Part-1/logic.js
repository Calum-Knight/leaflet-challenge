var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
    console.log(data.features);

    var myMap = L.map("map", {
        center: [50.52, -122.00],
        zoom: 4
    });


    var earthquakes = data.features
    console.log(earthquakes[0]["geometry"]["coordinates"][0])


    list_depths = []



    EQMarkers = []

    for (var i = 0; i < earthquakes.length; i++) {


        var lat = earthquakes[i]["geometry"]["coordinates"][1]
        var lng = earthquakes[i]["geometry"]["coordinates"][0]
        var depth = earthquakes[i]["geometry"]["coordinates"][2]
        var properties = earthquakes[i]["properties"]
        var mag = earthquakes[i]["properties"]["mag"] * 30000

        list_depths.push(depth)

        function markerColor(depth) {
            if (depth > 500) {
                return "#3f007d";
            } else if (depth > 200) {
                return "#54278f";
            } else if (depth > 100) {
                return "#6a51a3";
            } else if (depth > 50) {
                return "#807dba";

                // } else if (depth > 50) {
                //     return "#60821d";
            } else if (depth > 20) {
                return "#9e9ac8";
                // } else if (depth > 30) {
                //     return "#87b629";
            } else if (depth > 10) {
                return "#bcbddc";
                // } else if (depth > 10) {
                //     return "#aeea35";
            } else {
                return "#dadaeb"
            }
        }


        EQMarkers.push(L.circle([lat, lng], {
            radius: mag,
            fillColor: markerColor(depth),
            color: markerColor(depth),
            fillOpacity: 0.75
        }).bindPopup("<h2>" + properties.place + "</h2> <hr> <h4><ul> <li> Type: " + properties.type + "</li> <li> Magnitude: " + properties.mag + "</li> </ul></h4>"));
    }



    EQLayer = L.layerGroup(EQMarkers).addTo(myMap);

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        Street: street,
        Topography: topo
    };


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500],
            colors = ["#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    L.control.layers(baseMaps).addTo(myMap);
})


