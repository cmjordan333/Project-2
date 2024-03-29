/// Create a map object
var myMap = L.map("map-id", {
    center: [37.6462903, -97.193111],
    zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(myMap);


// Read a JSON file or API
// 
d3.json('/api/worldmap-data')
    .then(function (artists) {
        console.log(artists);
        // Define fun fact function
        // def funFact():
        var markers = L.markerClusterGroup();
        
        // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
        // for (var i = 0; i < artists.length; i++) {
        //     var artist = artists[i];
        //     L.marker([+artist['LAT '], +artist['LONG']]) //artist.location)
        //         .bindPopup("<h1>" + artist.name + "<h2>" + artist.location__city + "</h1> </h2> <hr> <h3> Music Video: <a href='" + artist.youtube__clipExampleUrl + "' target='_blank'>" + artist.youtube__clipExampleUrl + "</a></h3>")
        //         .addTo(myMap);
        // }
        for (var i = 0; i < artists.length; i++) {
            var artist = artists[i];
            markers.addLayer(L.marker([+artist['LAT '], +artist['LONG']]) //artist.location)
                .bindPopup("<h1>" + artist.name + "<h2>" + artist.location__city + "</h1> </h2> <hr> <h3> Music Video: <a href='" + artist.youtube__clipExampleUrl + "' target='_blank'>" + artist.youtube__clipExampleUrl + "</a></h3>"))
        }

        myMap.addLayer(markers)
    })


//     // Loop through the cities array and create one marker for each city object
// for (var i = 0; i < countries.length; i++) {

//     // Conditionals for countries points
//     var color = "";
//     if (countries[i].points > 200) {
//       color = "yellow";
//     }
//     else if (countries[i].points > 100) {
//       color = "blue";
//     }
//     else if (countries[i].points > 90) {
//       color = "green";
//     }
//     else {
//       color = "red";
//     }

//     // Add circles to map
//     L.circle(countries[i].location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: color,
//       // Adjust radius
//       radius: countries[i].points * 1500
//     }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
//   }