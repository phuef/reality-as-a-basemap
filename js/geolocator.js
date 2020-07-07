function updatePosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onPosition, onPositionError, geolocationOptions);
    } else {
        alert("Error: Your Device or Browser does not support Geolocation API.")
    }
}

function onPosition(position) {
    if (!positionInitialised) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getData();
        positionInitialised = true;
    }

    lat = position.coords.latitude;
    lon = position.coords.longitude;
    userOnBusRoute(position);
}

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