//Make the current position and the A-Frame scene object globally available
var latitude, longitude, scene = null;

/**
 * This function gets called by the main script every time the user changes his position.
 * It makes the user's position globally available to the script, sets the A-Frame scene object 
 * and downloads busstops through Conterra's Bus API for Muenster.
 * @param {Number} lat - Latitude of the current position
 * @param {Number} lon - Longitude of the current position
 */
function initNavigator(lat, lon) {
    latitude = lat;
    longitude = lon;
    //console.log(latitude, longitude);
    scene = $('a-scene')[0]; //Store the A-Frame scene object to add objects later on
}

function getRoute(lat, lon) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_KEY}&start=${longitude},${latitude}&end=${lon},${lat}`;

    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown); //Throw an error if the API call fails
        }
    });
}