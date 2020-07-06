//Make the current position and the A-Frame scene object globally available
var current_position, scene, allVenues = null;
var venuesLayer = new L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var markers = cluster.getAllChildMarkers();
        var n = 0;
        console.log(markers);
        n += markers.length;

        return L.divIcon({ html: n, className: 'myvenuescluster', iconSize: L.point(40, 40) });
    },
    //Disable all of the defaults:
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    disableClusteringAtZoom: 17
});
var venuesAR = false;
var venuesMap = false;

/**
 * This function gets called by the main script every time the user changes his position.
 * It makes the user's position globally available to the script, sets the A-Frame scene object
 * and downloads venues through Foursquare API.
 * @param {Number} lat - Latitude of the current position
 * @param {Number} lon - Longitude of the current position
 */
function initVenues(lat, lon) {
    current_position = [lat, lon];
    scene = $('a-scene')[0];
    getVenues();
}

/**
 * This function calls Foursquare API to download nearby venues in JSON format.
 */
function getVenues() {
    const url = 'https://api.foursquare.com/v2/venues/search?' +
        'client_id=' + FOURSQUARE_ID +
        '&client_secret=' + FOURSQUARE_SECRET +
        '&v=20200528' +
        '&ll=' + current_position[0] + ',' + current_position[1] +
        '&radius=' + 1000;

    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function(data) {
            allVenues = data.response.venues;
            var venues = filterVenues(data.response.venues, radius); //Extract venues
            venuesToAR(venues); //Visualize venues in AR
            venuesToMap(venues);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //Throw an error if the API call fails
            console.log(textStatus, errorThrown);
            alert("Data acquisition failed (See console for details).");
        }
    });
}

/**
 * This function visualizes nearby venues as markers in AR
 * @param {GeoJSON} venues - Nearby venues to visualize in AR
 */
function venuesToAR(venues) {
    venues.forEach((venue) => {
        //Store the position for each venue
        var v_lat = venue.location.lat;
        var v_lon = venue.location.lng;
        //Store relevant attributes
        var name = venue.name;
        //Create a new marker in AR
        var marker = document.createElement('a-image');
        //Set the necessary attributes for the marker
        $(marker).attr('gps-entity-place', `latitude: ${v_lat}; longitude: ${v_lon}`); //The marker's location
        $(marker).attr('src', 'img/star-icon.png'); //Image for the marker
        $(marker).attr('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        $(marker).attr('scale', '20 20') //The marker's size
        $(marker).attr('name', name); //Name of the venue
        $(marker).attr('lat', `${v_lat}`); //Seperate latitude for navigation
        $(marker).attr('lon', `${v_lon}`); //Seperate longitude for navigation
        $(marker).attr('cursor_venue', true); //Handle hovering event
        $(marker).attr('type', 'venue');
        //Add the marker to the scene
        scene.appendChild(marker);
    });
    venuesAR = true;
}

/**
 * This function visualizes the venues as markers on the 2D map
 * @param {Array} venues
 */
function venuesToMap(venues) {
    venues.forEach((venue) => {
        //Define a new marker for each venue
        var marker = L.ExtraMarkers.icon({
            icon: 'fa-star', //Font Awesome Icon
            markerColor: 'yellow',
            prefix: 'far' //Font Awesome Prefix
        });

        //Venue location
        var v_lat = venue.location.lat;
        var v_lon = venue.location.lng;

        var popup = generateVenuePopup(venue);

        //Create a new Leaflet marker and bind a popup to it
        venuesLayer.addLayer(L.marker([v_lat, v_lon], { icon: marker })
            .bindPopup(popup))
    });

    venuesLayer.addTo(map);
    venuesMap = true;
}

/**
 * This function filters the downloaded venues, so only the nearest five ones are shown.
 * @param {Array} venues
 */
function filterVenues(venues, radius) {
    var result = [];
    venues.forEach((venue) => {
        //The user's current position
        var lat1 = current_position[0];
        var lon1 = current_position[1];
        //The bus stop's location
        var lat2 = venue.location.lat;
        var lon2 = venue.location.lng;

        var distance = getDistance(lat1, lon1, lat2, lon2); //Calculate the distance between the user's position and the bus stop

        if (distance <= radius) {
            result.push(venue);
        }
    });

    return result;
}

function disableVenuesInAR() {
    $('[type="venue"]').remove();
}

function disableVenuesInMap() {
    venuesLayer.clearLayers();
}

function changeVenues(radius) {
    disableVenuesInAR();
    disableVenuesInMap();
    var newVenues = filterVenues(allVenues, radius);
    venuesToAR(newVenues);
    venuesToMap(newVenues);
}