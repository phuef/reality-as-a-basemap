function getDistance(lat1, lon1, lat2, lon2) {
    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    //calculate distances
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //distance
    var d = Math.round(R * c);

    return d;
}

function getDirection(lat1, lon1, lat2, lon2) {
    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var φ3 = lon1 * (Math.PI / 180);
    var φ4 = lon2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    //bearing
    var y = Math.sin((φ4 - φ3) * Math.cos(φ2));
    var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ4 - φ3);
    var brng = Math.atan2(y, x) * 180 / Math.PI;

    //avoid negative bearing
    if (brng < 0) {
        brng += 360;
    }
    return brng;
}

function getXZ(direct, distance) {
    console.log(direct, distance);
    if (direct <= 90) {
        var x = Math.sin(alpha) * distance
        var z = Math.sqrt((Math.pow(distance, 2) - Math.pow(x, 2)));
    }
    else if (direct <= 180) {
        var alpha = direct - 90;
        var z = (Math.sin(alpha) * distance) * (-1);
        var x = Math.sqrt((Math.pow(distance, 2) - Math.pow(z, 2)));
    }
    else if (direct <= 270) {
        var alpha = direct - 180;
        var x = (Math.sin(alpha) * distance) * (-1);
        var z = Math.sqrt((Math.pow(distance, 2) - Math.pow(x, 2))) * (-1);
    }
    else {
        var alpha = direct - 270;
        var z = (Math.sin(alpha) * distance);
        var x = Math.sqrt(Math.pow(distance, 2) - Math.pow(z, 2)) * (-1);
    }

    console.log(x, z);

    return [x, z];
}
