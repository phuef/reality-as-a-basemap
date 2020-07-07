function generateBusStopPopup(busStop) {
    var name = busStop.properties.lbez;
    var direction = busStop.properties.richtung;
    var distance = busStop.properties.distance;

    return (`<i class="fas fa-bus fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-map-signs fa-2x"></i> ${direction}<br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`);
}

/**
 * This function takes a single bus route and creates the html content to show within the marker's popup
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

function generateVenuePopup(venue) {
    var name = venue.name;

    return (`<i class="fas fa-info fa-3x"></i><br> ${name}<br><br>`);
}

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

function generatebusRouteInfobox(busRoute) {
    var id = busRoute.properties.linienid;

    return (`<h3>${id}</h3>`);
}

function generateVenueInfobox(venue) {
    var name = $(venue).attr('name');
    var distance = $(venue).attr('distancemsg');
    var lat = $(venue).attr('lat');
    var lon = $(venue).attr('lon');

    return (`<i class="fas fa-star fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`
        + `<a class="btn btn-success" href="#" onclick="navigate(${lat},${lon})"><i class="fas fa-crosshairs"></i> Navigate</a>`);
}