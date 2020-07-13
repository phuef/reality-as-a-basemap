//Declare variables
var busRoutes = []; //Variable for storing all bus routes
var busRoutesLayer = new L.LayerGroup(); //Variable for storing the bus routes as a layer, which should be drawn to the Leaflet map
var busRoutesEnabled = true; //Variable to toggle bus routes in AR
var frame = $('#sceneview')[0]; //Container to visualize the feedback for a bus route
var busRouteInfoFrame = $('#busRouteInfoFrame')[0];
var busRouteInfo = $('#busRouteInfo')[0]; //Infobox for the bus route

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

/**
 * Function to visualize a bus route in the AR-view. The user gets a visual feedback with further information when moving on a bus route.
 */
function displayBusRouteInAR() {
    //Only activate the visualization if the feature is enabled
    if (busRoutesEnabled) {
        //The user's position
        /* var position = [lon, lat]; */
        var position = [7.607940025627613, 51.93378282786479]; //Test position

        //Span a circle around the user's position according to the radius
        var circle = turf.circle(position, radius / 1000);

        //Calculate the bounding box for the circle
        var bbox = turf.bbox(circle);

        var inside = false;

        //Test if the user is located on any bus route
        busRoutes.forEach((busRoute) => {
            //Clip the bus route to the calculated bounding box
            var clipped = turf.bboxClip(busRoute, bbox);

            //If the user is standing on a relevant part of the bus route...
            if (turf.booleanPointInPolygon(position, clipped)) {
                //Show a feedback on the screen as a colored frame
                $(frame).attr('style', 'border-style: solid');

                //Display the information about the according bus route in the infobox
                busRouteInfo.innerHTML = generateBusRouteInfobox(busRoute);
                $(busRouteInfoFrame).attr('style', 'visibility: visible');

                inside = true;
            }
            //If the user is outside of a bus route...
            if (!inside) {
                //Revert the frame's appearance
                $(frame).attr('style', 'border-style: none');

                //Hide the infobox
                $(busRouteInfoFrame).attr('style', 'visibility: hidden');
            }
        });
    }
    //Otherwise do nothing...
}

/**
 * Function to activate the bus route visualization.
 */
function enableBusRoutes() {
    busRoutesEnabled = true; //Enable the bus route visualization in AR
    //Redraw the bus routes on the map
    busRoutes.forEach((busRoute) => {
        displayBusRouteOnMap(busRoute);
    });
}

/**
 * Function to disable the bus route visualization.
 */
function disableBusRoutes() {
    busRoutesEnabled = false; //Disable the bus route visualization in AR
    busRoutesLayer.clearLayers(); //Disable the bus route visualization on the map
    //Set the current visualization to default
    $(frame).attr('style', 'border-style: none');
    $(busRouteInfoFrame).attr('visibility', 'hidden');
}