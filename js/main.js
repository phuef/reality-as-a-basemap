var current_position;
var lat,lon;
var mapview=false;

var mapLink = '<a href="http://www.esri.com/">Esri</a>';

var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; '+mapLink,
    maxZoom: 20,
});
var topoMap= L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
//initialize leaflet map
var map = L.map('map', {
  layers: [satelliteMap]
})
var baseMaps = {
  "Satellite": satelliteMap,
  "Topographic": topoMap
};
var layerControl = L.control.layers(null, baseMaps, {position:'bottomleft'}).addTo(map);
//L.control.layers(baseMaps).addTo(map);




function onLocationFound(e) {
    if (current_position) {
        map.removeLayer(current_position);
    }
    current_position= L.marker(e.latlng).addTo(map);

    var latLngs = [ current_position.getLatLng() ];
    lat=latLngs[0].lat;
    lon=latLngs[0].lng;
    //map.panTo(new L.LatLng(lat, lon));

}

function onLocationError(e) {
    alert(e.message);
}
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//relocates to the current position on the map
function locate(){
  if(mapview){
    map.locate();
  }
}


// call locate every 5 seconds... forever
setInterval(init, 5000);

function init(){
    locate();
    // hier werden die anderen Methoden aufgerufen
    // initVenues(lat,lon)
    // initBusstops(lat, lon)
    // initBusLines(lat, lon)
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        // alpha: rotation around z-axis
        var rotateDegrees = event.alpha;
        // gamma: left to right
        var leftToRight = event.gamma;
        // beta: front back motion
        var frontToBack = event.beta;

        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
}


// changes  the shown elements when the devices orientation changes
var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
  var checked= document.getElementById("checkboxSwitchView").checked;
  if(checked){}
    else{
    if (frontToBack<30 && frontToBack>-30){
        var scene = document.querySelector('a-scene');
        scene.setAttribute('display', "none");
        document.getElementById("dummerSlider").style.display="none";
        document.getElementById("mapview").style.display="flex";
        if (!mapview)
        {
          map.locate({setView: true, maxZoom: 20});
        }
        mapview=true;
    }
    else{
        document.getElementById("mapview").style.display="none";
        document.getElementById("scene").style.display="flex";
        document.getElementById("dummerSlider").style.display="flex";
        mapview = false;
    }
  }
}

function kelvinInCelsius(kelvin){
    return kelvin-273.15;
}
