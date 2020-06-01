 var coordLat = 51.963604;
 var coordLong = 7.613225;

window.onload = function getLocation() {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(showPosition);

 } else {
   document.getElementbyId("geojson").value = "Geolocation is not supported by this browser.";

 }
}

function showPosition(position) {
  coordLat = position.coords.longitude;
  coordLong = position.coords.latitude;
  //busstops([coordLat, coordLong]);
  busstops([7.6342129334807405, 51.957614000311956]);
  
}

var lon = showPosition.coordLong;
var lat = showPosition.coordLat;


/**
 * @description This function takes the input coordinates from an oringin and a destination as arrays
 * and calculates the distance from the origin point to that destination point
 * @param {array} origin - the single point that is the origin to other points
 * @param {array} dest - a single point to which the distance has to be calculated to
 * @return {number} d - the distance
  */

 var dist = function(origin, dest){

  //get coordinates of point
  var lon1 = origin[0];
  var lat1 = origin[1];
  var lon2 = dest[0];
  var lat2 = dest[1];

  //degrees to radiants
  var R = 6371e3; // metres
  var φ1 = lat1 * (Math.PI/180);
  var φ2 = lat2 * (Math.PI/180);
  var φ3 = lon1 * (Math.PI/180);
  var φ4 = lon2 * (Math.PI/180);
  var Δφ = (lat2-lat1) * (Math.PI/180);
  var Δλ = (lon2-lon1) * (Math.PI/180);

  //calculate distances
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  //distance
  var d = Math.round(R * c);

  return d;
}


/**
* @description This function takes the input coordinates from an oringin and a destination as arrays
* and calculates the direction from the origin point to that destination point as string (e.g N/S/SE etc.)
* @param {array} origin - the single point that is the origin to other points
* @param {array} dest - a single point to which the direction has to be calculated to
* @return {string} text - the direction in text format (e.g. "N"/"SE" etc.)
*/

var direc = function(origin, dest){

  //get coordinates of point
  var lon1 = origin[0];
  var lat1 = origin[1];
  var lon2 = dest[0];
  var lat2 = dest[1];

  //degrees to radiants
  var R = 6371e3; // metres
  var φ1 = lat1 * (Math.PI/180);
  var φ2 = lat2 * (Math.PI/180);
  var φ3 = lon1 * (Math.PI/180);
  var φ4 = lon2 * (Math.PI/180);
  var Δφ = (lat2-lat1) * (Math.PI/180);
  var Δλ = (lon2-lon1) * (Math.PI/180);

  //bearing
  var y = Math.sin((φ4-φ3) * Math.cos(φ2));
  var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ4-φ3);
  var brng = Math.atan2(y,x)*180/Math.PI;

  //avoid negative bearing
  if (brng < 0) {
      brng += 360;
  }

  //direction derived from bearing
  switch(true){
      case (brng < 22.5):
          var text = "N";
          break;
      case (brng < 67.5):
          text = "NE";
          break;
      case (brng < 112.5):
          text = "E";
          break;
      case (brng < 157.5):
          text = "SE";
          break;
      case (brng < 202.5):
          text = "S";
          break;
      case (brng < 247.5):
          text = "SW";
          break;
      case (brng < 292.5):
          text = "W";
          break;
      case (brng < 337.5):
          text = "NW";
          break;
      case (brng < 360):
          text = "N";
      }

      return text
  }

/**
 * @description This function gets the busstops of Münster by attaching to the API and calculates the closest 5 bussops 
 * to a specific position
 * @param {array} pnt - the position that the calcualtions are based on
 */
function busstops(pnt){


var url = "https://rest.busradar.conterra.de/prod/haltestellen";
fetch(url)
.then(function(response){
  //console.log(response.text);
  return response.json();
})
.then(function(json){
 // initialize output array
 var narr =[];
  
 // for every busstop do the following:
 for (i=0; i< json.features.length; i++ ){
     // get name of busstop
     var lagebez = json.features[i].properties.lbez;
     //get id of busstop
     var lageid = json.features[i].properties.nr;
     //get coordinates of busstop
     var coords = json.features[i].geometry.coordinates;
     //get distance of busstop
     var distance = dist(pnt, coords);
     //get direction of busstop
     var direction = direc(pnt, coords);
     //save all the data above in a single array
     var inarr = [lagebez, lageid, coords, distance, direction];
     //push the array into the output array
     narr.push(inarr);
 }
     // sort busstops by distance to the users location
    narr.sort(
      function(a,b) {
      return a[3] - b[3];
      });
    
    // only take the 5 clostest busstops into consideration
    var stops = narr.slice(0,1);
    console.log(stops)
    
    // get buslines by bussops
    lines(stops); 
    
  })

// if can't access data
.catch(function(error){
  console.log("Fehler");
})
}


/**
*@desc This function determines the next lines departuring from the clostest busstops
*@param {array} busstops - The closest 5 busstops to users position
*/
function lines(busstops){
  // for every busstop do the following
  
    
    var busid = busstops[0][1];
 
    //let busline = busstops;
    
    // access data from API to get buslines that depart from busstop
    var url = "https://rest.busradar.conterra.de/prod/haltestellen"+"/"+busid+"/abfahrten?sekunden="+1600;
   
    fetch(url)
    .then(function(response){
      console.log(response);
      return response.json();
    })
    .then(function(json){
        console.log(json);
        var fahrtenbezeichner = json[0].fahrtbezeichner;
        console.log(fahrtenbezeichner);
        //Fahrt(fahrtenbezeichner);           
        //Fahrt(-11829976) //1;
        Fahrt(-11830239);
    })
    // if can't access data
    .catch(function(error){
      console.log("Fehler");
    })    
  }

 


//get Fahrtenstring by Fahrtenid
function Fahrt(fahrtenid){
  var url = "https://rest.busradar.conterra.de/prod/fahrten/"+fahrtenid;
  console.log(url);
  fetch(url)
  .then(function(response){
    return response.json();
  })
  .then(function(json){
    //console.log(json);
    var lineString = json.geometry.coordinates;
    var outarr = [];
    //console.log(lineString);
    for (i=0; i< lineString.length; i++){
      var arr = [];
      var x = Math.abs(lineString[i][0] - coordLong);
      var z = Math.abs(lineString[i][1] - coordLat);
      arr.push(x, 1, z);
      console.log(arr);
      outarr.push(arr);
    }
    console.log(outarr);
    createLine(outarr);
  })
  // if can't access data
  .catch(function(error){
    console.log("Fehler");
  }) 
}

function createLine(arr){
  for (i=0; i<arr.length; i++){
    var line = [("line__"+[i]+"=start: "+ arr[i] + "; end:"+ arr[i+1] +"; color: red")];
    console.log(line)
  }
}


function component(json){
AFRAME.registerComponent('foo', {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify
    }
  }
});

el.setAttribute('foo', 'jsonData', json)
}