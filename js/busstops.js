//Make the current position and the A-Frame scene object globally available
var latitude, longitude, scene = null;

/**
 * This function gets called by the main script every time the user changes his position.
 * It makes the user's position globally available to the script, sets the A-Frame scene object 
 * and downloads busstops through Conterra's Bus API for Muenster.
 * @param {Number} lat - Latitude of the current position
 * @param {Number} lon - Longitude of the current position
 */
function initBusstops(lat, lon) {
    console.log(typeof (lat, lon));
    latitude = lat;
    longitude = lon;
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
            busStopsToMap(busStops); //Visualize the bus stops in the 2D map
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown); //Throw an error if the API call fails
        }
    });
}

/**
 * 
 * @param {GeoJSON} busStops - Nearest bus stops to visualize in AR
 */
function busStopsToAR(busStops) {
    busstops.forEach((busstop) => {
        var latitude = busstop.geometry.coordinates[1];
        var longitude = busstop.geometry.coordinates[0];
        var icon = document.createElement('a-image');

        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('src', 'img/busstop.png');
        icon.setAttribute('look-at', '[gps-camera]');
        icon.setAttribute('scale', '20 20')

        scene.appendChild(icon);

        getBuslines(busstop);
    });
}

function filterBusStops(busstops) {
    busstops.forEach((busstop) => {
        var lat1 = latitude;
        var lon1 = longitude;
        var lat2 = busstop.geometry.coordinates[1];
        var lon2 = busstop.geometry.coordinates[0];

        var distance = getDistance(lat1, lon1, lat2, lon2);
        busstop.properties.distance = distance;
    });

    busstops.sort((a, b) => {
        return a.properties.distance - b.properties.distance;
    });

    return busstops.slice(0, 5);
}