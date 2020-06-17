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

function busLineToMap(busLine) {
    const lineStyle = {
        "color": "green",
        "weight": 5,
        "opacity": 0.9
    }

    var popup = busLineToPopup(busLine);

    L.geoJSON(busLine, {
        onEachFeature: (feature, line) => {
            line.bindPopup(popup);
        },
        style: lineStyle
    }).addTo(map);
}

/**
 * This function takes a single bus line and creates the html content to show within the marker's popup
 * @param {GeoJSON} busStop - A single bus stop in GeoJSON format
 */
function busLineToPopup(busLine) {
    var id = busLine.properties.linienid;
    var direction = busLine.properties.richtungstext;
    var delay = busLine.properties.delay;

    var html = '<i class="fas fa-bus fa-3x"></i><br><br><h4>Linie ' + id
        + '</h4><br><i class="fas fa-map-signs fa-2x"></i><h7>' + direction
        + '</h7><br><i class="far fa-clock fa-2x"></i><h7>' + delay + ' </h7>';

    return html;
}

function getLineString(fahrtbezeichner) {
    var url = "https://rest.busradar.conterra.de/prod/fahrten/" + fahrtbezeichner;
    $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: function (data) {
            LineStringToAR(data);
            busLineToMap(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function LineStringToAR(linestring) {
    var arr = [];
    var id = linestring.properties.linienid;
    var direction = linestring.properties.richtungstext;
    var delay = linestring.properties.delay;

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

    createLine(arr, id, direction, delay);
};

function createLine(arr, id, direction, delay) {
    var result = [];
    for (i = 0; i < arr.length; i++) {
        var line = "start: " + arr[i] + "; end: " + arr[i + 1] + "; color: green";
        result.push(line);
    }

    drawToAR(result, id, direction, delay);
}

function drawToAR(lines, id, direction, delay) {
    var entity = document.createElement('a-entity');
    lines.forEach((line, index) => {
        $(entity).attr("line__" + index, line);
        $(entity).attr('look-at', '[gps-camera]');
        //$(entity).attr('scale', '50 50');
        $(entity).attr('id', id);
        $(entity).attr('direction', direction);
        $(entity).attr('delay', delay);
        $(entity).attr('cursor_busline', true);
    });

    scene.appendChild(entity);
}