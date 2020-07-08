//Declare variables
var venues = null; //variable for storing all venues
var venuesLayer = new L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var n = 0;
        //console.log(markers);
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
 * Function to download and visualize all venues within the specified radius via Foursquare's Search API.
 */
function getVenues() {
    //URL for the API call
    let url = 'https://api.foursquare.com/v2/venues/search?' + //API endpoint
        'client_id=' + FOURSQUARE_ID + //Token ID (-> token.js)
        '&client_secret=' + FOURSQUARE_SECRET + //Token Secret (-> token.js)
        '&v=' + foursquareVersion + //Version of the API endpoint (-> settings.js)
        '&ll=' + lat + ',' + lon + //The user's current position (-> main.js)
        '&radius=' + foursquareRadius; //Get all venues within the specified radius (-> settings.js)

    //Execute the AJAX call
    $.ajax({
        dataType: "json", //Download the data in JSON format
        url: url, //The specified url
        //If the API call is successful...
        success: (data) => {
            venues = data.response.venues; //Store all venues
            let filteredVenues = filterVenues(data.response.venues, radius); //Filter the venues by radius
            displayVenues(filteredVenues); //Display the venues
        },
        //If the API call fails...
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown); //Print the error message in console
            alert("Data acquisition failed (See console for details)."); //Throw an alert
        }
    });
}

/**
 * Function to filter venues by only returning the ones within the user-specified radius.
 */
function filterVenues() {
    let result = [];

    venues.forEach((venue) => {
        //Store the venue's location
        let v_lat = venue.location.lat;
        let v_lon = venue.location.lng;

        //Calculate the distance between the user's position and the venue
        let distance = getDistance(lat, lon, v_lat, v_lon);

        //If the venue lies within the radius push it to the resulting array
        if (distance <= radius) {
            result.push(venue);
        }
    });

    return result;
}

/**
 * Function to display venues in the AR-view and on the Leaflet map.
 * @param {Array} venues - Venues to be displayed
 */
function displayVenues(venues) {
    displayVenuesInAR(venues); //Display venues in AR-view
    displayVenuesOnMap(venues); //Display venues on map
}

/**
 * Function to visualize venues as markers within the AR-view.
 * @param {GeoJSON} venues - Nearby venues to visualize in AR
 */
function displayVenuesInAR(venues) {
    venues.forEach((venue) => {
        //Store the position for each venue
        let v_lat = venue.location.lat;
        let v_lon = venue.location.lng;

        //Store relevant attributes
        let name = venue.name; //The venue's name

        //Create a new A-Frame image object as a marker
        let marker = $('<a-image>');

        //Set the necessary attributes for the marker
        $(marker).attr('gps-entity-place', `latitude: ${v_lat}; longitude: ${v_lon}`); //The marker's location
        $(marker).attr('src', 'img/star-icon.png'); //Image for the marker
        $(marker).attr('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        $(marker).attr('scale', '20 20') //The marker's size
        $(marker).attr('type', 'venue'); //Type of the marker to distinguish different kinds of markers
        $(marker).attr('lat', `${v_lat}`); //Seperate latitude for navigation
        $(marker).attr('lon', `${v_lon}`); //Seperate longitude for navigation
        $(marker).attr('name', name); //The venue's name
        $(marker).attr('cursoronvenue', true); //Event handler for the hovering event

        //Add the marker to the AR-view
        scene.append(marker);
    });
    venuesAR = true;
}

/**
 * Function to visualize venues as markers on the Leaflet map.
 * @param {GeoJSON} venues - Nearby venues to visualize on the map
 */
function displayVenuesOnMap(venues) {
    venues.forEach((venue) => {
        //Define the marker's appearance
        let markerOptions = L.ExtraMarkers.icon({
            icon: 'fa-star', //Font Awesome Icon
            markerColor: 'yellow', //Color of the marker itself
            prefix: 'far' //Font Awesome Prefix
        });

        //Store the position for each venue
        let v_lat = venue.location.lat;
        let v_lon = venue.location.lng;

        //Create a popup with information for the venue
        let popup = generateVenuePopup(venue);

        //Create a new Leaflet marker, bind the popup to it and add it to the LayerGroup
        venuesLayer.addLayer(L.marker([v_lat, v_lon], { icon: markerOptions })
            .bindPopup(popup))
    });

    //Add the LayerGroup to the map
    venuesLayer.addTo(map);
    venuesMap = true;
}

/**
 * Function to redisplay venues after they have been disabled.
 */
function enableVenues() {
    changeVenues(); //Enable venues for the AR-view
    map.addLayer(venuesLayer); //Enable venues for the map
}

/**
 * Function to hide all venues.
 */
function disableVenues() {
    $('[type="venue"]').remove(); //Disable venues for the AR-view
    venuesLayer.clearLayers(); //Disable venues for the map
}

/**
 * Function to update venues.
 */
function changeVenues() {
    disableVenues(); //Disable all venues
    let filteredVenues = filterVenues(); //Filter the venues with the new radius
    displayVenues(filteredVenues); //Display the new venues
}
