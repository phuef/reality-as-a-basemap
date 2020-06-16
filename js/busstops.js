//Make the current position and the A-Frame scene object globally available
var current_position, scene = null;

/**
 * This function gets called by the main script every time the user changes his position.
 * It makes the user's position globally available to the script, sets the A-Frame scene object 
 * and downloads busstops through Conterra's Bus API for Muenster.
 * @param {Number} lat - Latitude of the current position
 * @param {Number} lon - Longitude of the current position
 */
function initBusstops(lat, lon) {
    current_position = [lat, lon];
    scene = $('a-scene')[0]; //Store the A-Frame scene object to add objects later on
    getBusStops(); //Download nearest bus stops from Conterra's Bus API
}

/**
 * This function calls Conterra's Bus API to download all bus stops for Muenster in JSON format.
 */
function getBusStops() {
    const url = 'https://rest.busradar.conterra.de/prod/haltestellen';

    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            var busStops = filterBusStops(data.features); //filter bus stops by selecting only the nearest ones
            busStopsToAR(busStops); //Visualize the bus stops in AR
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //Throw an error if the API call fails
            console.log(textStatus, errorThrown);
            alert("Data acquisition failed (See console for details).");
        }
    });
}

/**
 * This function visualizes the bus stops as markers in AR
 * @param {GeoJSON} busStops - Nearest bus stops to visualize in AR
 */
function busStopsToAR(busStops) {
    busStops.forEach((busStop) => {
        //Store the position for each bus stop
        var b_lat = busStop.geometry.coordinates[1];
        var b_lon = busStop.geometry.coordinates[0];
        //Store relevant attributes
        var name = busStop.properties.lbez;
        var direction = busStop.properties.richtung;
        //Create a new marker in AR
        var marker = document.createElement('a-image');
        //Set the necessary attributes for the marker
        $(marker).attr('gps-entity-place', `latitude: ${b_lat}; longitude: ${b_lon}`); //The marker's location
        $(marker).attr('src', 'img/busstop.png'); //Image for the marker
        $(marker).attr('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        $(marker).attr('scale', '20 20'); //The marker's size
        $(marker).attr('name', name); //Name of the bus stop
        $(marker).attr('direction', direction); //Driving direction of the buses (inwards/outwards)
        $(marker).attr('lat', `${b_lat}`); //Seperate latitude for navigation 
        $(marker).attr('lon', `${b_lon}`); //Seperate longitude for navigation
        $(marker).attr('cursor_busstop', true); //Handle hovering event
        //Add the marker to the scene
        scene.appendChild(marker);
    });
    //Add the bus stops to the 2D map
    busStopsToMap(busStops);
}

/** 
 * This function visualizes the bus stops as markers on the 2D map
 * @param {Array} busStops 
 */
function busStopsToMap(busStops) {
    busStops.forEach((busStop) => {
        //Define a new marker for each bus stop
        var marker = L.ExtraMarkers.icon({
            icon: 'fa-bus', //Font Awesome Icon
            markerColor: 'green',
            prefix: 'fas' //Font Awesome Prefix
        });

        //Bus stop location
        var b_lat = busStop.geometry.coordinates[1];
        var b_lon = busStop.geometry.coordinates[0];

        var popup = busStopToPopup(busStop);

        //Create a new Leaflet marker and bind a popup to it
        L.marker([b_lat, b_lon], { icon: marker })
            .bindPopup(popup)
            .addTo(map);
    });
}

/**
 * This function takes a single bus stop and creates the html content to show within the marker's popup
 * @param {GeoJSON} busStop - A single bus stop in GeoJSON format
 */
function busStopToPopup(busStop) {
    var name = busStop.properties.lbez;
    var direction = busStop.properties.richtung;
    var distance = busStop.properties.distance;

    var html = '<i class="fas fa-bus fa-3x"></i><br><br><h3>' + name
        + '</h3><br><i class="fas fa-map-signs fa-2x"></i><h5>stadt' + direction
        + '</h5><br><i class="fas fa-walking fa-2x"></i><h5>' + distance + ' m</h5>';

    return html;
}

/**
 * This function filters the downloaded bus stops, so only the nearest five ones are shown. (Needs to be replaced by the radius later on!)
 * @param {Array} busStops 
 */
function filterBusStops(busStops) {
    busStops.forEach((busStop) => {
        //The user's current position
        var lat1 = current_position[0];
        var lon1 = current_position[1];
        //The bus stop's location
        var lat2 = busStop.geometry.coordinates[1];
        var lon2 = busStop.geometry.coordinates[0];

        var distance = getDistance(lat1, lon1, lat2, lon2); //Calculate the distance between the user's position and the bus stop
        busStop.properties.distance = distance; //Store the distance within the GeoJSON object
    });

    //Sort all bus stops for their distances to the user
    busStops.sort((a, b) => {
        return a.properties.distance - b.properties.distance;
    });

    return busStops.slice(0, 5); //Return only the 5 nearest bus stops
}