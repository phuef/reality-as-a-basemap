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