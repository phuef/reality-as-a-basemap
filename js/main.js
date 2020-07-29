var current_position; //the current position on the map as a marker
var lat, lon; // latitude and longitude of the current position
var mapview = false;
var radius = $('#radius').val();
var oldRadius = null;
var siteLoaded=false;
$('#showRadius')[0].innerHTML = radius;
var positionInitialised = false;
var scene = $('#scene').first();

$(document).ready(() => {
  setInterval(updatePosition, positionUpdateRate);
});


/**
 * @desc retrieves the data
 *
 */
function getData() {
  getVenues();
  getBusStops();
}

//initialize leaflet with links for different basemaps
var mapLink = '<a href="http://www.esri.com/">Esri</a>';

var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; ' + mapLink,
  maxZoom: 20,
});
var topoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: ''
});

var worldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});

var map = L.map('map', {
  layers: [satelliteMap]
})
map.locate({ setView: true, maxZoom: 20 });

var initialised = false;

/**
 * @desc deletes the old marker and creates a new one for the updated location
 *
 */
function onLocationFound(e) {
  if (current_position) {
    map.removeLayer(current_position);
  }
  current_position = L.marker(e.latlng).addTo(map);
  var latLngs = [current_position.getLatLng()];
  lat = latLngs[0].lat;
  lon = latLngs[0].lng;
  if (!initialised) {
    init();
    initialised = true;
  }

}

/**
 * @desc throws an error when no location is available
 *
 */
function onLocationError(e) {
  console.log(e.message);
  //alert(e.message);
}

//eventhandler for the location
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

/**
 * @desc Function to relocate to the current position on the map
 *
 */
function locate() {
  if (mapview) {
    map.locate();
  }
}

/**
 * @desc Function to initiate everything
 *
 */
function init() {
  locate();
  radiusCircle(radius);
  // hier werden die anderen Methoden aufgerufen
}
var interval = setInterval(isLoaded, 2000);

/**
 * @desc function checking if everything is loaded. If yes the loader disappears
 *
 */
function isLoaded() {
  if (busstopsMap && busstopsAR && venuesAR && venuesMap) {
    siteLoaded = true;
    clearInterval(interval);
    document.getElementById("loadingScreen").style.display = "none";
    }
}

// add an eventlistener for tilting the device (to switch between the views)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    // alpha: rotation around z-axis
    var rotateDegrees = event.alpha;
    // gamma: left to right
    var leftToRight = event.gamma;
    // beta: front back motion
    var frontToBack = event.beta;

    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
  }, true);
}
/**
 * @desc changes  the shown elements when the devices orientation changes
 *
 */
var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    var checked = document.getElementById("checkboxSwitchView").checked;
    if (checked) {} else {
        if (frontToBack < 30 && frontToBack > -30) {
            document.getElementById("sceneview").style.display = "none";
            document.getElementById("slider").style.display = "none";
            document.getElementById("mapview").style.display = "flex";
            if (!mapview) {
                map.locate({ setView: true, maxZoom: 20 });
            }
            mapview = true;
        } else {
            document.getElementById("mapview").style.display = "none";
            document.getElementById("sceneview").style.display = "flex";
            document.getElementById("slider").style.display = "flex";
            mapview = false;
        }
    }
}

/**
 * @desc deletes old radius circle and adds the new one
 *
 *@param radius - chosen radius in meter
 */
function radiusCircle(radius) {
  if (oldRadius != null) {
    map.removeLayer(oldRadius);
  }
  if (document.getElementById("radiusShown").checked) {
    oldRadius = L.circle([lat, lon], {
      color: 'grey',
      fillColor: 'grey',
      fillOpacity: 0.4,
      radius: radius
    }).addTo(map);
  }
}

/**
 * @desc started when the radius is changed, updating radius circle and features
 *
 */
function submitRadius() {
  radius = document.getElementById('radius').value;
  var showRadius = document.getElementById('showRadius');
  showRadius.innerHTML = radius;
  radiusCircle(radius);
  changeVenues(radius);
  changeBusStops(radius);
}

/**
 * @desc hides or shows busstop features, whether the checkbox is checked
 *
 */
function toggleBusStops() {
  if (!document.getElementById("busstops").checked) {
    disableBusStops();
  }
  else {
    enableBusStops();
  }
}

/**
 * @desc hides or shows busroutes features, whether the checkbox is checked
 *
 */
function toggleBusRoutes() {
  if (!document.getElementById("buslines").checked) {
    disableBusRoutes();
  }
  else {
    enableBusRoutes();
  }
}

/**
 * @desc hides or shows venuesfeatures, whether the checkbox is checked
 *
 */
function toggleVenues() {
  if (!document.getElementById("venues").checked) {
    disableVenues();
  }
  else {
    enableVenues();
  }
}

var layers = [];
map.eachLayer(function (layer) {
  if (layer instanceof L.TileLayer)
    layers.push(layer);
});

/**
 * @desc displays the menu
 *
 */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}
/**
 * @desc hide the menu
 *
 */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

/**
 * @desc changes the basemap to the one chosen in the radio button
 *
 *@param layer - inout from radio button
 */
function switchBaselayer(layer) {
    if (document.getElementById(layer).checked) {
        switch (layer) {
            case "topo":
                map.addLayer(topoMap);
                map.removeLayer(satelliteMap);
                map.removeLayer(worldStreetMap);
                break;

            case "worldStreet":
                map.addLayer(worldStreetMap);
                map.removeLayer(satelliteMap);
                map.removeLayer(topoMap);
                break;

            case "satellite":
                map.addLayer(satelliteMap);
                map.removeLayer(topoMap);
                map.removeLayer(worldStreetMap);
                break;
            default:

        }
    }
}

/**
 * @desc deletes old radius circle and adds the new one
 *
 */
function toggleRadius() {
  radiusCircle(radius);
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

/**
 * @desc function to connect the slider to camera zoom
 *
 */
function zoomSlider() {
    zoomlevel = document.getElementById('slider').value;
    let mediaStream = document.querySelector('video');
    // this is the runnning camera stream
    mediaStream = mediaStream.srcObject;

    const track = mediaStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    // Check whether zoom is supported or not.
    if (!('zoom' in capabilities)) {
        return Promise.reject('Zoom is not supported by ' + track.label);
    }

    track.applyConstraints({ advanced: [{ zoom: zoomlevel }] });
}
