var current_position; //the current position on the map as a marker
var lat, lon; // latitude and longitude of the current position
var mapview = false;
var radius = $('#radius').val();
var oldRadius = null;
//initialize leaflet
var mapLink = '<a href="http://www.esri.com/">Esri</a>';

var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; ' + mapLink,
  maxZoom: 20,
});
var topoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var map = L.map('map', {
  layers: [satelliteMap]
})

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

function onLocationError(e) {
  console.log(e.message);
  //alert(e.message);
}
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


// call init every 5 seconds... forever
//setInterval(init, 5000);

/**
 * @desc Function to initiate everything
 *
 */
function init() {
  locate();
  radiusCircle(radius);
  // hier werden die anderen Methoden aufgerufen
  initVenues(lat, lon);
  initBusstops(lat, lon);
  initBuslines(lat, lon);
}

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
var handleOrientationEvent = function (frontToBack, leftToRight, rotateDegrees) {
  var checked = document.getElementById("checkboxSwitchView").checked;
  if (checked) { }
  else {
    //var scene = document.querySelector('a-scene');
    if (frontToBack < 30 && frontToBack > -30) {
      //scene.setAttribute('display', "none");
      document.getElementById("scene").style.display = "none";
      document.getElementById("slider").style.display = "none";
      document.getElementById("mapview").style.display = "flex";
      //document.querySelector('a-image').style.display="none";
      if (!mapview) {
        map.locate({ setView: true, maxZoom: 20 });
      }
      //document.querySelectorAll('.leaflet-control-layers,.leaflet-control').style.position= 'fixed';
      //document.querySelectorAll('.leaflet-control-layers,.leaflet-control').style.right= '0';
      //document.querySelectorAll('.leaflet-control-layers,.leaflet-control').style.top= '0';
      mapview = true;
    }
    else {
      document.getElementById("mapview").style.display = "none";
      document.getElementById("scene").style.display = "flex";
      //scene.setAttribute('display', 'flex');
      document.getElementById("slider").style.display = "flex";
      //document.querySelector('a-image').style.display="flex";
      mapview = false;
    }
  }
}

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

function submitRadius() {
  radius = document.getElementById('radius').value;
  var showRadius = document.getElementById('showRadius');
  showRadius.innerHTML = radius;
  radiusCircle(radius);
  changeVenues(radius);
  changeBusStops(radius);
}

function toggleBusstops() {
  if (!document.getElementById("busstops").checked) {
    map.removeLayer(busstopsLayer);
    disableBusStopsInAR();
  }
  else {
    map.addLayer(busstopsLayer);
    enableBusStopsInAR();
  }
}
function toggleBuslines() {
  if (!document.getElementById("buslines").checked) {
    map.removeLayer(buslinesLayer);
  }
  else {
    map.addLayer(buslinesLayer);
  }
}
function toggleVenues() {
  if (!document.getElementById("venues").checked) {
    map.removeLayer(venuesLayer);
    disableVenuesInAR();
  }
  else {
    map.addLayer(venuesLayer);
    enableVenuesInAR();
  }
}

var layers = [];
map.eachLayer(function (layer) {
  if (layer instanceof L.TileLayer)
    layers.push(layer);
});
console.log(layers);
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function switchBaselayer(layer) {
  if (document.getElementById(layer).checked) {
    switch (layer) {
      case "topo": map.addLayer(topoMap);
        map.removeLayer(satelliteMap); break;

      case "satellite": map.addLayer(satelliteMap);
        map.removeLayer(topoMap);
        break;
      default:

    }
  }
}
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
