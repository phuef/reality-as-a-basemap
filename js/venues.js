//Make the current position and the A-Frame scene object globally available
var latitude, longitude, scene = null;

/**
 * This function gets called by the main script every time the user changes his position.
 * It makes the user's position globally available to the script, sets the A-Frame scene object
 * and downloads venues through Foursquare API.
 * @param {Number} lat - Latitude of the current position
 * @param {Number} lon - Longitude of the current position
 */
function initVenues(lat, lon) {
    latitude = lat;
    longitude = lon;
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
        '&ll=' + latitude + ',' + longitude;

    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            var venues = data.response.venues; //Extract venues
            //venuesToAR(venues); //Visualize venues in AR
            venuesToMap(venues); //Visualize venues in 2D
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown); //Throw an error if the API call fails
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
        var lat = venue.location.lat;
        var lon = venue.location.lng;
        //Create a new marker in AR
        var icon = document.createElement('a-image');
        //Set the necessary attributes for the marker
        icon.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lon}`); //The marker's location
        icon.setAttribute('src', 'img/star-icon.png'); //Image for the marker
        icon.setAttribute('look-at', '[gps-camera]'); //Fix the marker to the correct position when looking at it in AR
        icon.setAttribute('scale', '10 10') //The marker's size
        //Add the marker to the scene
        scene.appendChild(icon);
    });
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
        var lat = venue.location.lat;
        var lon = venue.location.lng;

        var popup = venueToPopup(venue);

        //Create a new Leaflet marker and bind a popup to it
        L.marker([lat, lon], { icon: marker })
            .bindPopup(popup)
            .addTo(map);
    });
}

/**
 * This function takes a single venue and creates the html content to show within the marker's popup
 * @param {GeoJSON} busStop - A single venue in GeoJSON format
 */
function venueToPopup(venue) {
    console.log(venue);

    var name = venue.name;
    var category = venue.categeories[0].name;
    var street = venue.location.formattedAddress[0];
    var city = venue.location.formattedAddress[1];
    var country = venue.location.formattedAddress[2];

    var html = '<i class="fas fa-star fa-3x"></i><br><br><h5>' + name
        + '</h5><br>';

    return html;
}