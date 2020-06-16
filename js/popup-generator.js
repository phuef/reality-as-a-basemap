function generateBusStopPopup(busStop) {
    console.log(busStop);
    var name = $(busStop).attr(name);
    var direction = `stadt${$(busStop).attr(direction)}`;
    var distance = $(busStop).attr(distancemsg);
    var lat = $(busStop).attr(lat);
    var lon = $(busStop).attr(lon);

    return (`<i class="fas fa-bus fa-3x"></i><br>${name}<br><br>`
        + `<i class="fas fa-map-signs fa-2x"></i>${direction}<br>`
        + `<i class="fas fa-walking fa-2x"></i>${distance}<br><br>`
        + `<a class="btn btn-success" href="#" onclick="navigate(${lat},${lon})"><i class="fas fa-crosshairs"></i> Navigate</a>`);
}

function generateVenuePopup(venue) {
}