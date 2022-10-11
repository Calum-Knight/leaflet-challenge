var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
    console.log(data.features);

    var myMap = L.map("map", {
        center: [30.52, 0.00],
        zoom: 2
    });


    var earthquakes = data.features
    console.log(earthquakes[0]["geometry"]["coordinates"][0])


    list_depths = []
    for (var i = 0; i < earthquakes.length; i++) {

        var lat = earthquakes[i]["geometry"]["coordinates"][1]
        var lng = earthquakes[i]["geometry"]["coordinates"][0]
        var depth = earthquakes[i]["geometry"]["coordinates"][2]
        var properties = earthquakes[i]["properties"]
        var mag = earthquakes[i]["properties"]["mag"] * 30000

        list_depths.push(depth)

        function markerColor(depth) {
            if (depth > 90) {
                return "#131a05";
            } else if (depth > 80) {
                return "#26340b";
            } else if (depth > 70) {
                return "#3a4e11";
            } else if (depth > 60) {
                return "#4d6817";
            } else if (depth > 60) {
                return "#60821d";
            } else if (depth > 40) {
                return "#749c23";
            } else if (depth > 30) {
                return "#87b629";
            } else if (depth > 20) {
                return "#9ad02f";
            } else if (depth > 10) {
                return "#aeea35";
            } else {
                return "#c8f76a"
            }
        }


        var circle = L.circle([lat, lng], {
            radius: mag,
            fillColor: markerColor(depth),
            color: markerColor(depth),
            fillOpacity: 0.5,
        }).addTo(myMap);

        circle.bindPopup(properties.place);
    }
    console.log(list_depths)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

});