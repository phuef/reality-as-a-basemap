//Make the current position and the A-Frame scene object globally available
var current_position, scene = null;

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
        '&ll=' + current_position[0] + ',' + current_position[1];

    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            var venues = data.response.venues; //Extract venues
            venuesToAR(venues); //Visualize venues in AR
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
        //Add the marker to the scene
        scene.appendChild(marker);
    });
    //Visualize venues in 2D
    venuesToMap(venues);
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
        L.marker([v_lat, v_lon], { icon: marker })
            .bindPopup(popup)
            .addTo(map);
    });
}