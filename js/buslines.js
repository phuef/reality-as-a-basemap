var latitude, longitude, scene = null;

function initBuslines(lat, lon) {
    latitude = lat;
    longitude = lon;
    scene = $('a-scene')[0];
}

function getBuslines(busstop) {
    var nr = busstop.properties.nr;
    var conterra_url = "https://rest.busradar.conterra.de/prod/haltestellen" + "/" + nr + "/abfahrten?sekunden=" + 1600;

    $.ajax({
        dataType: "json",
        url: conterra_url,
        data: {},
        success: function (data) {
            if (data.length > 0) {
                var fahrtbezeichner = data[0].fahrtbezeichner;
                getLineString(fahrtbezeichner);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function getLineString(fahrtbezeichner) {
    var url = "https://rest.busradar.conterra.de/prod/fahrten/" + fahrtbezeichner;
    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            LineStringToAR(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function LineStringToAR(linestring) {
    var arr = [];
    linestring.geometry.coordinates.forEach((coordinate) => {

        var lat1 = latitude;
        var lon1 = longitude;
        var lat2 = coordinate[1];
        var lon2 = coordinate[0];

        var distance = getDistance(lat1, lon1, lat2, lon2);
        var direction = getDirection(lat1, lon1, lat2, lon2);
        var xz = getXZ(direction, distance);

        arr.push([xz[0], 1, xz[1]]);
    });

    createLine(arr);
};

function createLine(arr) {
    var result = [];
    for (i = 0; i < arr.length; i++) {
        var line = "start: " + arr[i] + "; end: " + arr[i + 1] + "; color: red";
        result.push(line);
    }

    drawToAR(result);
}

function drawToAR(lines) {
    var entity = document.createElement('a-entity');
    lines.forEach((line, index) => {
        $(entity).attr("line__" + index, line);
    });
    console.log(entity);
}