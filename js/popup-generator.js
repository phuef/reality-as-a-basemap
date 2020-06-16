function generateBusStopPopup(busStop) {
    var name = busStop.name;
    var direction = `stadt${busStop.direction}`;
    var distance = busStop.distancemsg;
    var lat = busStop.lat;
    var lon = busStop.lon;

    return (`<i class="fas fa-bus fa-3x"></i><br>'
        + name + '<br><br>'
        + '<i class="fas fa-map-signs fa-2x"></i> stadt'
        + direction + '<br>'
        + '<i class="fas fa-walking fa-2x"></i> '
        + distance + '<br><br>'
        + '<a class="btn btn-success" href="#" onclick="navigate(' + lat + ', ' + lon + ')"><i class="fas fa-crosshairs"></i> Navigate</a>'`);
}

function generateVenuePopup(venue) {
}