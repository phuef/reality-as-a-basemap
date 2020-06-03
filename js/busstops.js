var position, scene = null;

function initBusstops(p, s) {
    position = p;
    scene = s;
    getBusstops();
}

function getBusstops() {
    const conterra_url = 'https://rest.busradar.conterra.de/prod/haltestellen';

    $.ajax({
        dataType: "json",
        url: conterra_url,
        data: {},
        success: function (data) {
            var busstops = filterBusstops(data.features);
            busstopsToAR(busstops);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function busstopsToAR(busstops) {
    busstops.forEach((busstop) => {
        var latitude = busstop.geometry.coordinates[1];
        var longitude = busstop.geometry.coordinates[0];
        var icon = document.createElement('a-image');

        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('src', 'img/busstop.png');
        icon.setAttribute('look-at', '[gps-camera]');
        icon.setAttribute('scale', '20 20')

        scene.appendChild(icon);

        getBuslines(busstop);
    });
}

function filterBusstops(busstops) {
    busstops.forEach((busstop) => {
        var lat1 = position.coords.latitude;
        var lon1 = position.coords.longitude;
        var lat2 = busstop.geometry.coordinates[1];
        var lon2 = busstop.geometry.coordinates[0];

        var distance = getDistance(lat1, lon1, lat2, lon2);
        busstop.properties.distance = distance;
    });

    busstops.sort((a, b) => {
        return a.properties.distance - b.properties.distance;
    });

    return busstops.slice(0, 5);
}