//Declare variables
var busRoutes = []; //variable for storing all bus routes
var busRoutesLayer = new L.LayerGroup(); //variable for storing the bus routes as a layer, which should be drawn to the Leaflet map
var busRoutesEnabled = true; //Store if Bus Routes are enabled in AR or not

/**
 * Function for downloading the corresponding bus lines for a given bus stop via Conterra's Bus API
 * @param {GeoJSON} busStop - Bus stop to get the lines of
 */
function getBusLinesForBusStop(busStop) {
    //URL for the API call
    let url = "https://rest.busradar.conterra.de/prod/haltestellen"
        + "/" + busStop.properties.nr + "/abfahrten?sekunden="
        + busDeparture;

    //Execute the AJAX call
    $.ajax({
        dataType: "json", //Download the data in JSON format
        url: url, //The specified url
        //If the API call is successful...
        success: function (data) {
            if (data.length > 0) { //If there are bus lines within the departure window
                let id = data[0].fahrtbezeichner; //store the id
                getBusRoute(id); //Get the specific bus route for the bus line
            }
        },
        //If the API call fails...
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown); //Print the error message in console
            alert("Data acquisition failed (See console for details)."); //Throw an alert 
        }
    });
}

/**
 * Function for downloading the concrete routes of the corresponding bus lines.
 * @param {string} id 
 */
function getBusRoute(id) {
    //URL for the API call
    let url = "https://rest.busradar.conterra.de/prod/fahrten/"
        + id;

    //Execute the AJAX call
    $.ajax({
        dataType: "json", //Download the data in JSON format
        url: url, //The specified url
        //If the API call is successful...
        success: (data) => {
            busRoutes.push(turf.buffer(data, 0.002, { units: 'kilometres' })); //Create a buffer around the route and store it
            displayBusRouteOnMap(data); //Draw the bus route to the Leaflet map
        },
        //If the API call fails...
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown); //Print the error message in console
            alert("Data acquisition failed (See console for details)."); //Throw an alert 
        }
    });
}

/**
 * Function to visualize a single bus route on the Leaflet map.
 * @param {GeoJSON} busRoute - Route to visualize on the map
 */
function displayBusRouteOnMap(busRoute) {
    //Styling for the Leaflet line feature
    const lineStyle = {
        "color": "green",
        "weight": 5,
        "opacity": 0.9
    }

    //Create a popup for the line feature
    var popup = generateBusRoutePopup(busRoute);

    //Create the route as a new GeoJSON object, bind the popup to it, add the styling and add it to the LayerGroup
    busRoutesLayer.addLayer(L.geoJSON(busRoute, {
        onEachFeature: (feature, line) => {
            line.bindPopup(popup);
        },
        style: lineStyle
    }));

    //Add the LayerGroup to the map
    map.addLayer(busRoutesLayer);
}

function userOnBusRoute() {
    var container = $('#scene')[0];
    var infobox = $('#lineinfo')[0];

    if (busRoutesEnabled) {
        //var pos = [position.coords.longitude, position.coords.latitude];
        var pos = [7.607940025627613, 51.93378282786479];
        var circle = turf.circle(pos, radius / 1000);
        var bbox = turf.bbox(circle);

        busRoutes.forEach((busRoute) => {
            var filtered = turf.bboxClip(busRoute, bbox);
            if (turf.booleanPointInPolygon(pos, filtered)) {
                $(container).attr('style', 'border-style: solid');
                infobox.innerHTML = generateBusRouteInfobox(busRoute);
            } else {
                $(container).attr('style', 'border-style: none');
                infobox.innerHTML = "";
            }
        });
    }
}

function enableBusRoutes() {
    busRoutesEnabled = true;
    busRoutes.forEach((busRoute) => {
        displayBusRouteOnMap(busRoute);
    });
}

function disableBusRoutes() {
    busRoutesEnabled = false;
    var container = $('#scene')[0];
    var infobox = $('#lineinfo')[0];
    $(container).attr('style', 'border-style: none');
    infobox.innerHTML = "";
    busRoutesLayer.clearLayers();
}