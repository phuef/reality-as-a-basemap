var venues = null;
var venuesLayer = new L.LayerGroup();

function getFoursquareVersion() {
    return '20200707';
}

function displayVenues(venues) {
    displayVenuesInAR(venues);
    displayVenuesOnMap(venues);
}

/**
 * This function calls Foursquare API to download nearby venues in JSON format.
 */
function getVenues() {
    const url = 'https://api.foursquare.com/v2/venues/search?' +
        'client_id=' + FOURSQUARE_ID +
        '&client_secret=' + FOURSQUARE_SECRET +
        '&v=' + getFoursquareVersion() +
        '&ll=' + lat + ',' + lon +
        '&radius=' + foursquareRadius;

    $.ajax({
        dataType: "json",
        url: url,
        success: function (data) {
            venues = data.response.venues;
            var filteredVenues = filterVenues(data.response.venues, radius);
            displayVenues(filteredVenues);
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
function displayVenuesInAR(venues) {
    venues.forEach((venue) => {
        //Store the position for each venue
        var v_lat = venue.location.lat;
        var v_lon = venue.location.lng;
        //Store relevant attributes
        var name = venue.name;
        //Create a new marker in AR
        var marker = $('a-image');
        //Set the necessary attributes for the marker
        $(marker).attr('gps-entity-place', `latitude: ${v_lat}; longitude: ${v_lon}`); //The marker's location
        $(marker).attr('src', 'img/star-icon.png'); //Image for the marker
        $(marker).attr('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        $(marker).attr('scale', '20 20') //The marker's size
        $(marker).attr('name', name); //Name of the venue
        $(marker).attr('lat', `${v_lat}`); //Seperate latitude for navigation 
        $(marker).attr('lon', `${v_lon}`); //Seperate longitude for navigation 
        $(marker).attr('cursoronvenue', true); //Handle hovering event
        $(marker).attr('type', 'venue');
        //Add the marker to the scene
        scene.append(marker);
    });
}

/**
 * This function visualizes the venues as markers on the 2D map
 * @param {Array} venues
 */
function displayVenuesOnMap(venues) {
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
}

/**
 * This function filters the downloaded venues, so only the nearest five ones are shown.
 * @param {Array} venues
 */
function filterVenues() {
    var result = [];

    venues.forEach((venue) => {
        var v_lat = venue.location.lat;
        var v_lon = venue.location.lng;

        var distance = getDistance(lat, lon, v_lat, v_lon); //Calculate the distance between the user's position and the bus stop

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