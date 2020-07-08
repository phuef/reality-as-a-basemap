/**
 * Function to generate a popup for a bus stop on the Leaflet map.
 * @param {GeoJSON} busStop - A single bus stop in GeoJSON format 
 */
function generateBusStopPopup(busStop) {
    var name = busStop.properties.lbez;
    var direction = busStop.properties.richtung;
    var distance = busStop.properties.distance;

    return (`<i class="fas fa-bus fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-map-signs fa-2x"></i> ${direction}<br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`);
}

/**
 * Function to generate a popup for a bus stop on the Leaflet map.
 * @param {GeoJSON} busRoute - A single bus route in GeoJSON format
 */
function generateBusRoutePopup(busRoute) {
    var id = busRoute.properties.linienid;
    var direction = busRoute.properties.richtungstext;
    var delay = busRoute.properties.delay;

    var html = '<i class="fas fa-bus fa-3x"></i><br><br><h4>Linie ' + id
        + '</h4><br><i class="fas fa-map-signs fa-2x"></i><h7>' + direction
        + '</h7><br><i class="far fa-clock fa-2x"></i><h7>' + delay + ' </h7>';

    return html;
}

/**
 * Function to generate a popup for a venue on the Leaflet map.
 * @param {GeoJSON} venue - A single venue in GeoJSON format
 */
function generateVenuePopup(venue) {
    var name = venue.name;

    return (`<i class="fas fa-info fa-3x"></i><br> ${name}<br><br>`);
}

/**
 * Function to generate the infobox for a bus stop in AR.
 * @param {*} busStop
 */
function generateBusStopInfobox(busStop) {
    var name = $(busStop).attr('name');
    var direction = `stadt${$(busStop).attr('direction')}`;
    var distance = $(busStop).attr('distancemsg');
    var lat = $(busStop).attr('lat');
    var lon = $(busStop).attr('lon');

    return (`<i class="fas fa-bus fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-map-signs fa-2x"></i> ${direction}<br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`
        + `<a class="btn btn-success" href="#" onclick="navigate(${lat},${lon})"><i class="fas fa-crosshairs"></i> Navigate</a>`);
}

/**
 * Function to generate the infobox for a bus route in AR.
 * @param {*} busRoute
 */
function generateBusRouteInfobox(busRoute) {
    var id = busRoute.properties.linienid;

    return (`<text>${id}</text>`);
}

/**
 * Function to generate the infobox for a venue in AR.
 * @param {*} venue
 */
function generateVenueInfobox(venue) {
    var name = $(venue).attr('name');
    var distance = $(venue).attr('distancemsg');
    var lat = $(venue).attr('lat');
    var lon = $(venue).attr('lon');

    return (`<i class="fas fa-star fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`
        + `<a class="btn btn-success" href="#" onclick="navigate(${lat},${lon})"><i class="fas fa-crosshairs"></i> Navigate</a>`);
}