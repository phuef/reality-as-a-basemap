//Declare variables
var busStops = null; //variable for storing all bus stops
var busStopsLayer = new L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var n = 0;
        //console.log(markers);
        n += markers.length;

        return L.divIcon({ html: n, className: 'mybusstopscluster', iconSize: L.point(40, 40) });
    },
    //Disable all of the defaults:
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    disableClusteringAtZoom: 17
});
var busstopsAR = false;
var busstopsMap = false;


/**
 * Function to download and visualize all bus stops via Conterra's Bus API.
 */
function getBusStops() {
    //URL for the API call
    let url = 'https://rest.busradar.conterra.de/prod/haltestellen';

    //Execute the AJAX call
    $.ajax({
        dataType: "json", //Download the data in JSON format
        url: url, //The specified url
        //If the API call is successful...
        success: (data) => {
            busStops = data.features; //Store all bus stops
            let filteredBusStops = filterBusStops(busStops); //Filter the bus stops by radius
            displayBusStops(filteredBusStops);
        },
        //If the API call fails...
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown); //Print the error message in console
            alert("Data acquisition failed (See console for details)."); //Throw an alert
        }
    });
}

/**
 * Function to filter bus stops by only returning the ones within the user-specified radius.
 */
function filterBusStops() {
    let result = [];

    busStops.forEach((busStop) => {
        //Store the bus stop's location
        let b_lat = busStop.geometry.coordinates[1];
        let b_lon = busStop.geometry.coordinates[0];

        //Calculate the distance between the user's position and the bus stop
        let distance = getDistance(lat, lon, b_lat, b_lon);

        //busStop.properties.distance = distance; //Store the distance within the GeoJSON object

        //If the bus stop lies within the radius push it to the resulting array
        if (distance <= radius) {
            result.push(busStop);
        }
    });

    return result;
}

/**
 * Function to display bus stops in the AR-view and on the Leaflet map.
 * @param {Array} busStops - Bus stops to be displayed
 */
function displayBusStops(busStops) {
    displayBusStopsInAR(busStops); //Display bus stops in AR-view
    displayBusStopsOnMap(busStops); //Display bus stops on map
}

/**
 * Function to visualize bus stops as markers within the AR-view.
 * @param {GeoJSON} busStops - Nearby bus stops to visualize in AR
 */
function displayBusStopsInAR(busStops) {
    busStops.forEach((busStop) => {
        //Store the position for each bus stop
        let b_lat = busStop.geometry.coordinates[1];
        let b_lon = busStop.geometry.coordinates[0];

        //Store relevant attributes
        let name = busStop.properties.lbez;
        let direction = busStop.properties.richtung;

        //Create a new marker in AR
        let marker = $('<a-image>');

        //Set the necessary attributes for the marker
        $(marker).attr('gps-entity-place', `latitude: ${b_lat}; longitude: ${b_lon}`); //The marker's location
        $(marker).attr('src', 'img/busstop.png'); //Image for the marker
        $(marker).attr('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        $(marker).attr('scale', '20 20') //The marker's size
        $(marker).attr('type', 'busStop'); //Type of the marker to distinguish different kinds of markers
        $(marker).attr('lat', `${b_lat}`); //Seperate latitude for navigation
        $(marker).attr('lon', `${b_lon}`); //Seperate longitude for navigation
        $(marker).attr('name', name); //The bus stop's name
        $(marker).attr('direction', direction); //Driving direction of the bus stop
        $(marker).attr('cursoronbusstop', true); //Event handler for the hovering event

        //Add the marker to the AR-view
        scene.append(marker);

        //Download the bus lines for the bus stop
        getBusLinesForBusStop(busStop);
    });
    busstopsAR = true;
}

/**
 * Function to visualize bus stops as markers on the Leaflet map.
 * @param {GeoJSON} busStops - Nearby bus stops to visualize on the map
 */
function displayBusStopsOnMap(busStops) {
    busStops.forEach((busStop) => {
        //Define a new marker for each bus stop
        let markerOptions = L.ExtraMarkers.icon({
            icon: 'fa-bus', //Font Awesome Icon
            markerColor: 'green', //Color of the marker itself
            prefix: 'fas' //Font Awesome Prefix
        });

        //Store the position for each bus stop
        var b_lat = busStop.geometry.coordinates[1];
        var b_lon = busStop.geometry.coordinates[0];

        //Create a popup with information for the bus stop
        var popup = generateBusStopPopup(busStop);

        //Create a new Leaflet marker, bind the popup to it and add it to the LayerGroup
        busStopsLayer.addLayer(L.marker([b_lat, b_lon], { icon: markerOptions })
            .bindPopup(popup))

    });

    //Add the LayerGroup to the map
    busStopsLayer.addTo(map);
    busstopsMap = true;
}

/**
 * Function to redisplay bus stops after they have been disabled.
 */
function enableBusStops() {
    changeBusStops(); //Enable bus stops for the AR-view
    map.addLayer(busStopsLayer); //Enable bus stops for the map
}

/**
 * Function to hide all bus stops.
 */
function disableBusStops() {
    $('[type="busStop"]').remove(); //Disable bus stops for the AR-view
    busStopsLayer.clearLayers(); //Disable bus stops for the map
}

/**
 * Function to update bus stops.
 */
function changeBusStops() {
    disableBusStops(); //Disable all bus stops
    let filteredBusStops = filterBusStops(); //Filter the bus stops with the new radius
    displayBusStops(filteredBusStops); //Display the new bus stops
}
