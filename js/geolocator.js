/**
 * Function to continuously update the user's geolocation.
 */
function updatePosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onPosition, onPositionError, geolocationOptions);
    } else {
        alert("Error: Your Device or Browser does not support Geolocation API.")
    }
}

/**
 * Gets triggered when the Geolocation API successfully receives the user's geolocation. Stores the position and calls a function to visualize bus routes in AR.
 * @param {*} position - Position received via Geolocation API
 */
function onPosition(position) {
    //Do this when the position is recognized for the first time
    if (!positionInitialised) {
        //Store the user's position globally
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        //Download all necessary data to be visualized
        getData();

        //Set the flag to true so this gets only called once
        positionInitialised = true;
    }

    //Update the position
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    //Visualize bus routes in AR
    displayBusRouteInAR();
}

/**
 * Gets triggered when the Geolocation API could not receive the user's geolocation. Alerts the user with the according error message.
 * @param {*} error - Error thrown by the Geolocation API
 */
function onPositionError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Error: Permission to detect your position denied.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Error: Positioning data unavailable.');
            break;
        case error.TIMEOUT:
            alert('Error: Timeout at detecting your position.');
            break;
        default:
            alert('Error: Unknown error (#' + error.code + ': ' + error.message + ')');
            break;
    }
}

/**
 * Function to calculate the distance between to points on a sphere.
 * @param {Decimal} lat1 - Latitude of the origin
 * @param {Decimal} lon1 - Longitude of the origin
 * @param {Decimal} lat2 - Latitude of the destination
 * @param {Decimal} lon2 - Longiude of the destination
 */
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; //The earth's radius in m

    //Convert degrees to radians
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    //Calculate the distances
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //Calclulate the resulting distance
    var d = Math.round(R * c);

    return d;
}