 var coordLat = 51.963604;
 var coordLong = 7.613225;

 function getLocation() {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(showPosition);

 } else {
   document.getElementbyId("geojson").value = "Geolocation is not supported by this browser.";

 }
}

function showPosition(position) {
  coordLat = position.coords.longitude;
  coordLong = position.coords.latitude;
  requestWeatherData(coordLat,coordLong);

}
getLocation();
var request = new XMLHttpRequest();
function requestWeatherData(lat,lon){
  var APIKey= "9e55039796c9a5f733b4100a7273622d";
  // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}
  // https://api.openweathermap.org/data/2.5/weather?lat=51.9541&lon=7.6210&appid=9e55039796c9a5f733b4100a7273622d

  var apicall="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+APIKey;
  var weather=weatherData(apicall);
  console.log(weather);
  console.log(weather.weather);
  console.log(weather.weather[0].description);
  //document.getElementById('output').value= weather.weather[0].description;
  //console.log(document.getElementById('output').value);
  var weatherText = document.querySelector('a-text');
 //console.log(weatherText.value);
   weatherText.setAttribute('value', weather.weather[0].description);
  console.log(weatherText);
}

function weatherData(apicall){
  request.open('GET', apicall, false);
   request.onload = function() {
    var data = JSON.parse(this.response);
  }
  //{"coord":{"lon":7.62,"lat":51.95},"weather":[{"id":521,"main":"Rain","description":"shower rain","icon":"09d"}],"base":"stations","main":{"temp":285.15,"feels_like":280.09,"temp_min":283.15,"temp_max":287.04,"pressure":1000,"humidity":71},"visibility":10000,"wind":{"speed":6.2,"deg":300},"clouds":{"all":40},"dt":1588347256,"sys":{"type":1,"id":1269,"country":"DE","sunrise":1588305552,"sunset":1588359227},"timezone":7200,"id":2867543,"name":"Münster","cod":200}
  //weather.description
  //main.temp in celsius
  request.send(null);
  return JSON.parse(request.responseText);
}

  var map = L.map('map')
          mapLink =
              '<a href="http://www.esri.com/">Esri</a>';
          wholink =
              'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
          L.tileLayer(
              'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: '&copy; '+mapLink+', '+wholink,
              maxZoom: 20,
              }).addTo(map);
console.log(map);
 var current_position;
var lat,lon;
  function onLocationFound(e) {
            if (current_position) {
            map.removeLayer(current_position);
        }
          current_position= L.marker(e.latlng).addTo(map);
console.log(map)

          var latLngs = [ current_position.getLatLng() ];
          lat=latLngs[0].lat;
            lon=latLngs[0].lng;
          map.panTo(new L.LatLng(lat, lon));

      }
      function onLocationError(e) {
        alert(e.message);
    }
  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

  // wrap map.locate in a function
   function locate() {
     map.locate({setView: true, maxZoom: 20});
   }
   locate();
   // call locate every 3 seconds... forever
   setInterval(locate, 5000);
   //locate()
   L.easyButton('<img src="./crosshairs-gps.png">', function(btn, map){
    map.setView([lat,lon]);
}).addTo(map);
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
var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    if (frontToBack<30 && frontToBack>-30){
      var weatherText = document.querySelector('a-text');
       weatherText.setAttribute('value', "vertical");
         var scene = document.querySelector('a-scene');
         scene.setAttribute('display', "none");
       document.getElementById("map").style.display="flex";

    }
    else{
      var weatherText = document.querySelector('a-text');
       weatherText.setAttribute('value', "horizontal");
       document.getElementById("map").style.display="none";
       document.getElementById("scene").style.display="flex";
    }
}

 function kelvinInCelsius(kelvin){
   return kelvin-273.15;
 }
