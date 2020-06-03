var latitude, longitude, scene = null;

function initVenues(lat, lon) {
    latitude = lat;
    longitude = lon;
    scene = $('a-scene')[0];
    getVenues();

    console.log(scene);
}

function getVenues() {
    const foursquare_url = 'https://api.foursquare.com/v2/venues/search?' +
        'client_id=' + FOURSQUARE_ID +
        '&client_secret=' + FOURSQUARE_SECRET +
        '&v=20200528' +
        '&ll=' + latitude + ',' + longitude;

    $.ajax({
        dataType: "json",
        url: foursquare_url,
        data: {},
        success: function (data) {
            var venues = data.response.venues;
            venuesToAR(venues);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function venuesToAR(venues) {
    venues.forEach((venue) => {
        var lat = venue.location.lat;
        var lon = venue.location.lng;
        var icon = document.createElement('a-image');

        icon.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lon}`);
        icon.setAttribute('src', 'img/star-icon.png');
        icon.setAttribute('look-at', '[gps-camera]');
        icon.setAttribute('scale', '10 10')

        scene.appendChild(icon);
    });
}