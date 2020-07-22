const positionUpdateRate = 5000; //Rate of how often the user's geolocation should be updated (in ms)

const geolocationOptions = {
    enableHighAccuracy: true //Enable high accurary for the geolocation detection 
};

const foursquareVersion = '20200707'; //Version of the Foursquare API Endpoint to be used (YYYYMMDD)

const foursquareRadius = 1000; //Get all venues within the specified radius (in m)

const busDeparture = 1600; //Time window of the bus departures (in s)