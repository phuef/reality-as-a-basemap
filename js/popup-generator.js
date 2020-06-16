function generateBusStopPopup(busStop) {
    var name = busStop.properties.lbez;
    var direction = busStop.properties.richtung;
    var distance = busStop.properties.distance;

    return (`<i class="fas fa-bus fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-map-signs fa-2x"></i> ${direction}<br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`);
}

function generateVenuePopup(venue) {
    var name = venue.name;

    return (`<i class="fas fa-bus fa-3x"></i><br> ${name}<br><br>`);
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

function generateVenueInfobox(venue) {
    var name = $(venue).attr('name');
    var distance = $(venue).attr('distancemsg');
    var lat = $(venue).attr('lat');
    var lon = $(venue).attr('lon');

    return (`<i class="fas fa-star fa-3x"></i><br> ${name}<br><br>`
        + `<i class="fas fa-walking fa-2x"></i> ${distance}<br><br>`
        + `<a class="btn btn-success" href="#" onclick="navigate(${lat},${lon})"><i class="fas fa-crosshairs"></i> Navigate</a>`);
}